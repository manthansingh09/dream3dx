"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [orderData, setOrderData] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderType, setOrderType] = useState("Standard Printing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check auth first
    fetch("/api/auth/me").then((res) => {
      if (!res.ok) {
        router.push("/login?redirect=/checkout");
        return;
      }
      // Auth OK — now check for pending order
      const data = sessionStorage.getItem("pendingOrder");
      if (!data) {
        router.push("/quote");
      } else {
        setOrderData(JSON.parse(data));
      }
    }).catch(() => {
      router.push("/login?redirect=/checkout");
    });
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
    if (!name || !phone || !address) {
      setError("Please fill out all shipping details.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: orderData.price,
          fileUrl: orderData.fileUrl,
          volumeOrSize: orderData.volume,
          customerName: name,
          phoneNumber: phone,
          shippingAddress: address,
          orderType: orderType
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) throw new Error("Razorpay SDK failed to load");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.price * 100,
        currency: "INR",
        name: "Dream3DX",
        description: "3D Printing Service",
        order_id: data.rzpOrderId,
        prefill: {
          name: name,
          contact: phone
        },
        handler: async function (response: any) {
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
        theme: { color: "#4f46e5" }
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
      <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '1000px' }}>
        
        {/* Shipping Form */}
        <div className="glass-panel" style={{ flex: '1 1 400px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Shipping Details</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Shipping Address</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Printing Lane, City, State, ZIP" rows={3} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Service Type</label>
              <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                <option value="Standard Printing">Upload & Print (Standard)</option>
                <option value="Custom Design">Custom Design Service</option>
                <option value="Lithophane">Lithophane Printing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass-panel" style={{ flex: '1 1 350px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', height: 'fit-content' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>File</span>
            <span style={{ fontWeight: 500, wordBreak: 'break-all', textAlign: 'right' }}>{orderData.fileName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Material Volume</span>
            <span style={{ fontWeight: 500 }}>{orderData.volume.toFixed(2)} cm³</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Total</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>₹{orderData.price}</span>
          </div>

          {error && <div style={{ color: 'var(--error)', marginTop: '1rem', textAlign: 'center', background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</div>}

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
    </div>
  );
}
