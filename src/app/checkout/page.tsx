"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseServer";

export default function CheckoutPage() {
  const [orderData, setOrderData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem("pendingOrder");
    if (!data) {
      router.push("/quote");
    } else {
      setOrderData(JSON.parse(data));
      // Hacky way to retrieve file from input if we hadn't used a global store
      // But since we lost the file object due to sessionStorage, we should implement
      // an upload in Quote, or just ask them to re-select if lost.
      // For this robust mockup, we will assume `file` is missing unless dropped again.
    }
  }, [router]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Mock File Upload to Supabase (assuming we don't have the File object here)
      // In a real app, file upload should happen in Quote step and pass the URL here
      const mockFileUrl = `https://placeholder.supabase.co/storage/v1/object/public/models/${Date.now()}.stl`;

      // 2. Create Order API
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: orderData.price,
          fileUrl: mockFileUrl,
          volumeOrSize: orderData.volume
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 3. Init Razorpay
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) throw new Error("Razorpay SDK failed to load");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.price * 100,
        currency: "INR",
        name: "Dream3DX",
        description: "3D Printing Service",
        order_id: data.rzpOrderId,
        handler: async function (response: any) {
          // Verify on backend
          await fetch("/api/orders/verify", {
            method: "POST",
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: data.orderId 
            })
          });
          sessionStorage.removeItem("pendingOrder");
          router.push("/dashboard");
        },
        theme: { color: "#6d28d9" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) return <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ marginBottom: '2rem' }}>Checkout Summary</h1>
      
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>Order Details</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>File</span>
          <span style={{ fontWeight: 500 }}>{orderData.fileName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Material Volume</span>
          <span style={{ fontWeight: 500 }}>{orderData.volume.toFixed(2)} cm³</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Total</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>₹{orderData.price}</span>
        </div>

        {error && <div style={{ color: 'var(--error)', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}

        <button 
          className="btn-primary" 
          style={{ width: '100%', marginTop: '2rem', padding: '1rem' }}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay with Razorpay"}
        </button>
      </div>
    </div>
  );
}
