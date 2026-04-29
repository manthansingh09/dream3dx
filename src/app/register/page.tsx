"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "placeholder_client_id";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError(data.error || "Registration failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("");
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: credentialResponse.credential }),
    });
    
    const data = await res.json();
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError(data.error || "Google auth failed");
    }
  };

  const handleGoogleError = () => {
    setError("Google auth failed");
  };

  return (
    <div className="container flex-center animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create an Account</h2>
        {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Register</button>
        </form>

        <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          <span style={{ padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        </div>

        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
             <GoogleLogin
               onSuccess={handleGoogleSuccess}
               onError={handleGoogleError}
               theme="filled_black"
               shape="rectangular"
               text="signup_with"
             />
          </div>
        </GoogleOAuthProvider>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Already have an account? <Link href="/login" className="text-gradient">Login</Link>
        </p>
      </div>
    </div>
  );
}
