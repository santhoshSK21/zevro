import React from 'react';
import Link from 'next/link';

export default function EditorialBanner() {
  return (
    <section style={{ position: 'relative', width: '100%', height: '50vh', minHeight: '400px', overflow: 'hidden' }}>
      <div 
        style={{ 
          position: 'absolute', inset: 0, 
          backgroundImage: 'url(https://images.unsplash.com/photo-1606503153255-59d5e417b0d8?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundAttachment: 'fixed', // Simple parallax without JS
        }} 
      />
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 5, 5, 0.4)' }} />
      
      <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 6vw, 60px)', fontStyle: 'italic', color: '#FDFAF7', marginBottom: '16px' }}>
          THE ETHNIC EDIT
        </h2>
        <p style={{ color: '#E7D8C9', fontSize: '16px', letterSpacing: '0.05em', marginBottom: '32px', maxWidth: '400px' }}>
          Tradition woven into every thread. Explore our handcrafted festive collection.
        </p>
        <div>
          <Link href="/ethnic-wear" className="btn btn-outline-gold" style={{ border: '1px solid var(--gold)', color: 'var(--gold)' }}>
            EXPLORE →
          </Link>
        </div>
      </div>
    </section>
  );
}
