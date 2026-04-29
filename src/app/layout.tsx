import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dream3DX - Premium 3D Printing Service",
  description: "Upload your STL/OBJ models, get instant quotes, and print them with state-of-the-art technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <nav style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-glass)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container flex-center" style={{ justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
        <a href="/" style={{ fontSize: '1.5rem', fontWeight: 700 }} className="text-gradient">
          Dream3DX
        </a>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="/quote">Get Quote</a>
          <a href="/contact">Contact</a>
          <a href="/login" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Login</a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-color)', marginTop: '4rem', padding: '3rem 0', background: 'var(--bg-secondary)' }}>
      <div className="container text-center text-muted">
        <p>&copy; {new Date().getFullYear()} Dream3DX. All rights reserved.</p>
      </div>
    </footer>
  );
}
