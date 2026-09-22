import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory, #FAF8F5)', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--espresso, #1C1C1A)' }}>
      <main style={{ flex: 1 }}>
        
        {/* Hero Section */}
        <div style={{ position: 'relative', height: '65vh', minHeight: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img 
            src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1600&auto=format&fit=crop&q=80" 
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }} 
            alt="ZEVRO Atelier Heritage" 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.7) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#FFF', padding: '0 24px', maxWidth: '780px' }}>
            <span style={{ fontFamily: 'var(--font-ui, sans-serif)', fontSize: '12px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C5A880', display: 'block', marginBottom: '12px', fontWeight: 600 }}>
              OUR PHILOSOPHY
            </span>
            <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '0.08em', marginBottom: '16px', lineHeight: 1.15 }}>
              WEAR TO INSPIRE
            </h1>
            <p style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#E2E8F0', fontWeight: 300 }}>
              Where ancestral Indian craftsmanship meets contemporary silhouettes.
            </p>
          </div>
        </div>

        {/* Narrative Section with Editorial 2-Col Image */}
        <section className="container" style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-ui, sans-serif)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B49A68', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                THE GENESIS
              </span>
              <h2 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(28px, 3.5vw, 40px)', lineHeight: 1.25, marginBottom: '24px', color: '#0F172A' }}>
                Crafting Timeless Elegance Through Quiet Luxury
              </h2>
              <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#475569', marginBottom: '20px' }}>
                ZEVRO was born from a desire to bridge the gap between traditional Indian craftsmanship and modern editorial fashion. We believe that every piece of clothing should tell a story—one of heritage, dedication, and timeless elegance.
              </p>
              <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#475569', marginBottom: '28px' }}>
                Our name reflects our commitment to garments that don't need to shout to be noticed. We use only the finest natural materials—from pure mulberry silks to breathable organic linens—ensuring that every piece feels as exquisite as it looks.
              </p>
              <div style={{ display: 'flex', gap: '32px', borderTop: '1px solid #E2E8F0', paddingTop: '24px' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '28px', color: '#0F172A', margin: '0 0 4px 0' }}>100%</h4>
                  <p style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B', margin: 0 }}>Natural Fibres</p>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '28px', color: '#0F172A', margin: '0 0 4px 0' }}>35+</h4>
                  <p style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B', margin: 0 }}>Master Artisan Clusters</p>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '28px', color: '#0F172A', margin: '0 0 4px 0' }}>Zero</h4>
                  <p style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B', margin: 0 }}>Compromise on Fit</p>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: '4px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80" 
                  alt="ZEVRO Atelier Draping" 
                  style={{ width: '100%', height: '480px', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ position: 'absolute', bottom: '-24px', left: '-24px', background: '#FFF', padding: '20px 24px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', maxWidth: '240px', display: 'none', smDisplay: 'block' } as any}>
                <p style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', fontSize: '14px', color: '#1E293B', margin: 0 }}>
                  "True couture is defined by what you feel against your skin."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Artisans Section */}
        <section style={{ backgroundColor: '#F8F6F0', borderTop: '1px solid #EAE6DF', borderBottom: '1px solid #EAE6DF', padding: '80px 24px' }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center' }}>
              
              <div style={{ order: 2 }}>
                <span style={{ fontFamily: 'var(--font-ui, sans-serif)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B49A68', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                  THE HANDS BEHIND THE THREADS
                </span>
                <h2 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(28px, 3.5vw, 38px)', lineHeight: 1.25, marginBottom: '20px', color: '#0F172A' }}>
                  Preserving Centuries-Old Handloom Legacies
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#475569', marginBottom: '16px' }}>
                  We partner directly with master weavers across Varanasi, Chanderi, and Jaipur, bypassing intermediary agents to guarantee direct livelihood support and fair ethical compensation.
                </p>
                <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#475569', marginBottom: '32px' }}>
                  When you wear ZEVRO, you are not merely donning a tailored piece; you are honoring the generational rhythm of the loom and keeping artistic heritage vibrantly alive.
                </p>
                <Link 
                  href="/category/all" 
                  className="btn btn-primary" 
                  style={{ display: 'inline-block', padding: '14px 28px', background: '#0F172A', color: '#FAF8F5', textDecoration: 'none', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}
                >
                  EXPLORE THE COLLECTION
                </Link>
              </div>

              <div style={{ order: 1 }}>
                <div style={{ borderRadius: '4px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=80" 
                    alt="Artisan Textile Weaving" 
                    style={{ width: '100%', height: '460px', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

