import React from 'react';

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <main style={{ flex: 1 }}>
        <div style={{ position: 'relative', height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1600" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="Brand heritage" />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(44,31,20,0.5)' }}></div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'var(--white)' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '56px', letterSpacing: '0.1em', marginBottom: '16px' }}>OUR STORY</h1>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '24px' }}>Wear to Inspire</p>
          </div>
        </div>

        <div className="container" style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', color: 'var(--espresso)' }}>
          <p style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '40px' }}>
            ZEVRO was born from a desire to bridge the gap between traditional Indian craftsmanship and modern editorial fashion. We believe that every piece of clothing should tell a story—one of heritage, dedication, and timeless elegance.
          </p>
          <p style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '40px' }}>
            Our name, derived from the idea of "quiet luxury," reflects our commitment to creating garments that don't need to shout to be noticed. We use only the finest materials, from pure Banarasi silks to breathable organic linens, ensuring that every piece feels as exquisite as it looks.
          </p>
          <div style={{ width: '80px', height: '1px', backgroundColor: 'var(--gold)', margin: '0 auto 40px' }}></div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '24px' }}>The Artisans</h2>
          <p style={{ fontSize: '18px', lineHeight: 1.8 }}>
            We partner directly with master weavers across India, bypassing middlemen to ensure fair wages and sustainable practices. When you wear ZEVRO, you aren't just wearing a garment; you are sustaining a centuries-old art form.
          </p>
        </div>
      </main>

    </div>
  );
}
