"use client";

import { useState } from "react";
import { Lightbulb, Mail } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", type: "Idea", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    
    if (res.ok) {
      setSuccess(true);
      setForm({ name: "", email: "", type: "Idea", message: "" });
    }
    setLoading(false);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Have an Idea?</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Don't have a 3D design yet but have a great idea? Or just want to reach out? Send us a message and we'll help bring it to life!
        </p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>Message Sent!</h3>
            <p>We'll get back to you shortly.</p>
            <button className="btn-secondary" style={{ marginTop: '2rem' }} onClick={() => setSuccess(false)}>Send Another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div 
                style={{ flex: 1, padding: '1rem', border: `2px solid ${form.type === 'Idea' ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'center' }}
                onClick={() => setForm({...form, type: 'Idea'})}
              >
                <Lightbulb style={{ margin: '0 auto 0.5rem', color: form.type === 'Idea' ? 'var(--primary)' : 'var(--text-muted)' }} />
                <div style={{ fontWeight: form.type === 'Idea' ? 700 : 400 }}>I have an idea</div>
              </div>
              <div 
                style={{ flex: 1, padding: '1rem', border: `2px solid ${form.type === 'Contact' ? 'var(--accent)' : 'var(--border-color)'}`, borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'center' }}
                onClick={() => setForm({...form, type: 'Contact'})}
              >
                <Mail style={{ margin: '0 auto 0.5rem', color: form.type === 'Contact' ? 'var(--accent)' : 'var(--text-muted)' }} />
                <div style={{ fontWeight: form.type === 'Contact' ? 700 : 400 }}>General Inquiry</div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required placeholder="John Doe" />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required placeholder="john@example.com" />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Message</label>
              <textarea 
                value={form.message} 
                onChange={(e) => setForm({...form, message: e.target.value})} 
                required 
                placeholder={form.type === 'Idea' ? "Describe your idea..." : "How can we help?"}
                rows={5}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Submit Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
