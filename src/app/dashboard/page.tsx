"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Clock, Truck, CheckCircle } from "lucide-react";

export default function UserDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders/user");
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
      case "Paid": return <Clock color="var(--warning)" />;
      case "Printing": return <Package color="var(--primary)" />;
      case "Shipped": return <Truck color="var(--accent)" />;
      case "Delivered": return <CheckCircle color="var(--success)" />;
      default: return <Clock />;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>My Dashboard</h1>
        <button className="btn-secondary" onClick={() => router.push("/quote")}>New Order</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3>No Orders Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Upload a file and get your first 3D print!</p>
          <button className="btn-primary" onClick={() => router.push("/quote")}>Upload File</button>
        </div>
      ) : (
        <div className="grid-2">
          {orders.map((order: any) => (
            <div key={order._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ID: {order._id.substring(0, 8)}...</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getStatusIcon(order.status)}
                  <span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{order.status}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>₹{order.amount}</div>
                  <div style={{ fontSize: '0.8rem', color: order.deliverySpeed === 'Same Day' ? 'var(--success)' : 'var(--text-muted)' }}>
                    {order.deliverySpeed} Delivery
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
