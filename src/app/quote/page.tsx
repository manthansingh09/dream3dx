"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle, Package } from "lucide-react";
import { calculateStlVolume } from "@/lib/stlParser";
import { useRouter } from "next/navigation";
import ThreeModelViewer from "@/components/ThreeModelViewer";
import { supabase } from "@/lib/supabaseServer";

export default function QuotePage() {
  const [file, setFile] = useState<File | null>(null);
  const [volume, setVolume] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const MATERIAL_PRICE_PER_CM3 = 10; // ₹10 per cm3

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndProcessFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = async (f: File) => {
    setError("");
    if (!f.name.toLowerCase().endsWith(".stl") && !f.name.toLowerCase().endsWith(".obj")) {
      setError("Only .stl and .obj files are supported right now.");
      return;
    }
    setFile(f);
    setIsCalculating(true);
    try {
      const vol = await calculateStlVolume(f);
      setVolume(vol);
    } catch (err) {
      setError("Failed to parse 3D file.");
    } finally {
      setIsCalculating(false);
    }
  };

  const proceedToCheckout = async () => {
    if (!file || !volume) return;
    setError("");

    // --- Auth guard: verify session before proceeding ---
    try {
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        // Not logged in — redirect to login with return path
        router.push("/login?redirect=/quote");
        return;
      }
    } catch {
      router.push("/login?redirect=/quote");
      return;
    }

    setIsUploading(true);
    try {
      const { total } = getCalculatedPrice();

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage.from('dream3dx').upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('dream3dx').getPublicUrl(fileName);

      sessionStorage.setItem("pendingOrder", JSON.stringify({
        fileName: file.name,
        fileUrl: publicUrl,
        volume: volume,
        price: total
      }));

      router.push("/checkout");
    } catch (err: any) {
      console.error(err);
      setError(`Upload Failed: ${err.message || "Unknown error"}`);
      setIsUploading(false);
    }
  };

  const getCalculatedPrice = () => {
    if (!volume) return { materialCost: 0, baseCharge: 0, total: 0 };
    const materialCost = Math.round(volume * MATERIAL_PRICE_PER_CM3);
    const baseCharge = materialCost < 99 ? 100 : 0;
    const total = materialCost + baseCharge;
    return { materialCost, baseCharge, total };
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>Get an Instant Quote</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', textAlign: 'center', maxWidth: '600px' }}>
        Upload your 3D model. Our engine will calculate the material volume and provide an instant, accurate cost estimation.
      </p>

      {!file && (
        <div
          className="glass-panel"
          style={{ width: '100%', maxWidth: '600px', border: '2px dashed var(--primary)', textAlign: 'center', padding: '4rem 2rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <UploadCloud size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Drag & Drop your .STL or .OBJ file here</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>or click to browse from your device</p>
          <input type="file" id="file-upload" accept=".stl,.obj" style={{ display: 'none' }} onChange={handleFileChange} />
          <div className="btn-secondary">Browse Files</div>
          {error && <div style={{ color: 'var(--error)', marginTop: '1rem' }}>{error}</div>}
        </div>
      )}

      {isCalculating && (
        <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <h3>Analyzing Geometry...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Calculating mesh volume from binary data</p>
        </div>
      )}

      {isUploading && (
        <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <h3>Uploading Model...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Securely transferring your file to our servers</p>
        </div>
      )}

      {file && volume !== null && !isCalculating && !isUploading && (
        <div className="glass-panel" style={{ width: '100%', maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Package size={32} color="var(--accent)" />
            <div>
              <h3 style={{ wordBreak: 'break-all' }}>{file.name}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <CheckCircle size={24} color="var(--success)" style={{ marginLeft: 'auto' }} />
          </div>

          {/* 3D Preview */}
          <div style={{ marginBottom: '2rem' }}>
            <ThreeModelViewer file={file} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Estimated Volume</span>
            <span style={{ fontWeight: 600 }}>{volume.toFixed(2)} cm³</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Material Cost</span>
            <span style={{ fontWeight: 600 }}>₹{getCalculatedPrice().materialCost}</span>
          </div>

          {getCalculatedPrice().baseCharge > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Small Order Base Charge</span>
              <span style={{ fontWeight: 600 }}>₹{getCalculatedPrice().baseCharge}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2rem 0 1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Total Estimate</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
              ₹{getCalculatedPrice().total}
            </span>
          </div>

          {error && <div style={{ color: 'var(--error)', marginTop: '1rem', textAlign: 'center', background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setFile(null)}>Upload Another</button>
            <button className="btn-primary" style={{ flex: 2 }} onClick={proceedToCheckout}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
