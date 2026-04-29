import Link from "next/link";
import { ArrowRight, UploadCloud, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="container flex-center" style={{ minHeight: '80vh', flexDirection: 'column', textAlign: 'center', gap: '2rem' }}>
        <h1 style={{ fontSize: '4rem', maxWidth: '800px', margin: '0 auto' }}>
          Bring Your Ideas to Life with <span className="text-gradient">Dream3DX</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Upload your 3D models and get instant quotes. Premium quality, same-day delivery available for early orders.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link href="/quote" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Get an Instant Quote <ArrowRight size={20} />
          </Link>
          <Link href="/contact" className="btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Have an Idea? Let's Talk
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container" style={{ padding: '4rem 1.5rem', marginBottom: '4rem' }}>
        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(109, 40, 217, 0.2)', padding: '1rem', borderRadius: '50%', color: 'var(--accent)' }}>
              <UploadCloud size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem' }}>Easy Uploads</h3>
            <p style={{ color: 'var(--text-muted)' }}>Drag and drop your .stl or .obj files. Our system instantly analyzes your model to provide an accurate quote based on volume and material.</p>
          </div>

          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '50%', color: '#ef4444' }}>
              <Zap size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem' }}>Same Day Delivery</h3>
            <p style={{ color: 'var(--text-muted)' }}>The first 5 orders of the day qualify for same-day priority printing. Real-time availability tracking.</p>
          </div>

          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '50%', color: 'var(--success)' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem' }}>Secure Payments</h3>
            <p style={{ color: 'var(--text-muted)' }}>Integrated with Razorpay for seamless and secure transactions. Track your order progress right from your dashboard.</p>
          </div>

        </div>
      </section>
    </div>
  );
}
