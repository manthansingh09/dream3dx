import Link from "next/link";
import { ArrowRight, UploadCloud, Zap, ShieldCheck, Cuboid } from "lucide-react";

export default function Home() {
  return (
    <div className="animate-fade-in" style={{ background: 'var(--bg-main)' }}>
      {/* Hero Section */}
      <section className="container flex-center" style={{ minHeight: '85vh', flexDirection: 'column', textAlign: 'center', gap: '2rem', padding: '4rem 1.5rem' }}>
        <div style={{ background: 'var(--accent-glow)', padding: '0.75rem 1.5rem', borderRadius: '2rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '-1rem' }}>
          <Cuboid size={20} /> Professional 3D Printing Service
        </div>
        <h1 style={{ fontSize: '4.5rem', maxWidth: '900px', margin: '0 auto', color: 'var(--text-main)', lineHeight: 1.1 }}>
          Bring Your Digital Designs into the <span className="text-gradient">Physical World</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
          Upload your STL or OBJ files for an instant quote. We use state-of-the-art industrial printers to deliver premium quality parts with rapid turnaround times.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Link href="/quote" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Get an Instant Quote <ArrowRight size={20} />
          </Link>
          <Link href="/contact" className="btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Talk to an Expert
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="container" style={{ padding: '6rem 1.5rem', background: 'var(--bg-secondary)', borderRadius: '2rem', marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Specialized Services</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Precision engineering meets artistic design.</p>
        </div>
        
        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="glass-panel" style={{ background: 'var(--bg-main)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>1. Upload & Print</h3>
            <p style={{ color: 'var(--text-muted)' }}>Already have a 3D model? Simply upload your STL or OBJ file, get an instant quote, and we'll handle the precision printing for you.</p>
          </div>

          <div className="glass-panel" style={{ background: 'var(--bg-main)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>2. Custom Design Service</h3>
            <p style={{ color: 'var(--text-muted)' }}>Don't have a file? Our expert team can design a 3D model from your ideas, sketches, or requirements, ready for high-quality production.</p>
          </div>

          <div className="glass-panel" style={{ background: 'var(--bg-main)', gridColumn: 'span 1' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>3. Lithophane Printing</h3>
            <p style={{ color: 'var(--text-muted)' }}>Transform your favorite photos into stunning 3D printed lithophanes that reveal intricate details when held up to the light.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container" style={{ padding: '4rem 1.5rem', marginBottom: '6rem' }}>
        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '1rem', borderRadius: '0.75rem', color: 'var(--accent)' }}>
              <UploadCloud size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Instant Estimations</h3>
            <p style={{ color: 'var(--text-muted)' }}>Drag and drop your 3D files. Our intelligent engine instantly analyzes the geometry and material volume to provide an accurate, transparent quote.</p>
          </div>

          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.75rem', color: '#ef4444' }}>
              <Zap size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Rapid Prototyping</h3>
            <p style={{ color: 'var(--text-muted)' }}>Need it fast? We offer same-day priority printing for early orders. Track your production status in real-time right from your dashboard.</p>
          </div>

          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '0.75rem', color: 'var(--success)' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Secure & Reliable</h3>
            <p style={{ color: 'var(--text-muted)' }}>We protect your intellectual property. All payments are processed securely via Razorpay, and we ship directly to your door.</p>
          </div>

        </div>
      </section>
    </div>
  );
}
