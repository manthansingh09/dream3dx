"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, MessageSquare, Download } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<any>({ orders: [], contacts: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("/api/admin/data");
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    fetchData();
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

      {loading ? (
        <div style={{ textAlign: 'center' }}>Loading...</div>
      ) : (
        <div className="grid-2">
          {/* Orders Section */}
          <div className="glass-panel" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Package color="var(--primary)" />
              <h2 style={{ fontSize: '1.5rem' }}>Orders ({data.orders.length})</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.orders.map((order: any) => (
                <div key={order._id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>{order.userEmail}</span>
                    <span style={{ color: order.deliverySpeed === 'Same Day' ? 'var(--success)' : 'var(--text-muted)' }}>{order.deliverySpeed}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span>Amount: ₹{order.amount}</span>
                    <span>Volume: {order.volumeOrSize.toFixed(2)} cm³</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select 
                      value={order.status} 
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      style={{ flex: 1, padding: '0.5rem' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Printing">Printing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    
                    <a href={order.fileUrl} target="_blank" className="btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Download size={16}/> STL
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contacts & Ideas Section */}
          <div className="glass-panel" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <MessageSquare color="var(--accent)" />
              <h2 style={{ fontSize: '1.5rem' }}>Messages & Ideas ({data.contacts.length})</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.contacts.map((contact: any) => (
                <div key={contact._id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>{contact.name}</span>
                    <span style={{ background: contact.type === 'Idea' ? 'var(--primary)' : 'var(--text-muted)', padding: '0.2rem 0.5rem', borderRadius: '0.2rem', fontSize: '0.8rem' }}>
                      {contact.type}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{contact.email}</div>
                  <p style={{ fontSize: '0.95rem' }}>{contact.message}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
