import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory, #FAF8F5)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Banner */}
      <div style={{ position: 'relative', height: '32vh', minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1600&auto=format&fit=crop&q=80" 
          alt="ZEVRO Terms of Service" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.4), rgba(15,23,42,0.8))' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#FFF', padding: '0 20px' }}>
          <span style={{ fontFamily: 'var(--font-ui, sans-serif)', fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            CLIENT AGREEMENT
          </span>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(30px, 4vw, 46px)', letterSpacing: '0.06em', margin: 0 }}>
            TERMS & CONDITIONS
          </h1>
          <p style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', fontSize: '15px', color: '#E2E8F0', marginTop: '6px' }}>
            Guidelines governing your access to the ZEVRO digital boutique and services.
          </p>
        </div>
      </div>

      <main className="container" style={{ padding: '56px 24px 80px', flex: 1, maxWidth: '860px', margin: '0 auto', width: '100%' }}>
        <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '36px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ color: '#475569', lineHeight: 1.8, fontSize: '14px' }}>
            <p style={{ fontSize: '15px', color: '#0F172A', fontWeight: 500, marginBottom: '24px' }}>
              Welcome to ZEVRO. By accessing or acquiring garments through this website, you agree to comply with and be bound by the following terms of purchase and service.
            </p>

            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '20px', color: '#0F172A', marginTop: '28px', marginBottom: '12px' }}>
              1. Boutique Orders & Fulfillment
            </h3>
            <p>
              All products listed are subject to availability. While we make every effort to display accurate fabric colors, subtle variations may occur due to screen calibration and handcrafted natural yarn dyes.
            </p>

            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '20px', color: '#0F172A', marginTop: '28px', marginBottom: '12px' }}>
              2. Bespoke Tailoring & Sizing
            </h3>
            <p>
              Garments commissioned under "Custom Sizing" are cut individually based on measurements supplied by the client. Minor alteration adjustments can be facilitated through our styling concierge.
            </p>

            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '20px', color: '#0F172A', marginTop: '28px', marginBottom: '12px' }}>
              3. Intellectual Property
            </h3>
            <p>
              All designs, editorial lookbooks, trademarks, and typography featured on ZEVRO are the exclusive intellectual property of ZEVRO Apparel Private Limited.
            </p>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '24px', marginTop: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Last Updated: March 2026</span>
              <Link href="/contact" style={{ fontSize: '12px', color: '#B49A68', fontWeight: 600, textDecoration: 'none' }}>
                Legal & Governance Inquiries →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}