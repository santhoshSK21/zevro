import React from 'react';
import Image from 'next/image';

export default function LookbookStrip() {
  const images = [
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80',
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&q=80',
    'https://images.unsplash.com/photo-1606503153255-59d5e417b0d8?w=500&q=80'
  ];

  return (
    <section style={{ backgroundColor: 'var(--ivory)', padding: '64px 0 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--espresso)', letterSpacing: '0.1em' }}>THE LOOKBOOK</h2>
      </div>
      
      <div style={{ display: 'flex', width: '100%', overflow: 'hidden' }}>
        {images.map((img, i) => (
          <div key={i} className="lookbook-item" style={{ flex: '1', position: 'relative', aspectRatio: '3/4', minWidth: '200px' }}>
            <Image src={img} alt="Lookbook" fill style={{ objectFit: 'cover' }} />
            <div className="lookbook-overlay" style={{
              position: 'absolute', inset: 0, 
              backgroundColor: 'rgba(5,5,5,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.3s'
            }}>
              <button className="btn btn-outline-gold" style={{ border: '1px solid #fff', color: '#fff' }}>SHOP THIS LOOK</button>
            </div>
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .lookbook-item:hover .lookbook-overlay { opacity: 1 !important; }
      `}} />
    </section>
  );
}
