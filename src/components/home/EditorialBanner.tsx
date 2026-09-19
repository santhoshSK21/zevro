import React from 'react';
import Link from 'next/link';

export default function EditorialBanner() {
  return (
    <section style={{ position: 'relative', width: '100%', height: '50vh', minHeight: '400px', overflow: 'hidden' }}>
      <div 
        style={{ 
          position: 'absolute', inset: 0, 
          backgroundImage: 'url(/pdp_hero_1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          backgroundAttachment: 'fixed',
        }} 
      />
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26, 26, 26, 0.2)' }} />
      
      <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 60px)', color: 'var(--color-white)', marginBottom: '16px', letterSpacing: '0.02em' }}>
          THE FESTIVE EDIT
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', letterSpacing: '0.05em', marginBottom: '32px', maxWidth: '400px' }}>
          Tradition woven into every thread. Explore our handcrafted collection.
        </p>
        <div>
          <Link href="/category/ethnic-wear" style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            background: 'var(--color-bg)', color: 'var(--color-ink)', 
            padding: '14px 28px', fontFamily: 'var(--font-ui)', fontSize: '11px', 
            letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' 
          }}>
            EXPLORE <span style={{ transition: 'transform 0.3s ease' }}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
