import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BrandStory() {
  return (
    <section className="section bg-primary">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'center' }}>
          
          <div style={{ position: 'relative', aspectRatio: '3/4', width: '100%' }}>
            <Image 
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80" 
              alt="Crafted with intention" 
              fill 
              style={{ objectFit: 'cover' }} 
            />
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 44px)', color: 'var(--espresso)', marginBottom: '24px' }}>
              CRAFTED WITH INTENTION
            </h2>
            <div className="gold-rule" />
            
            <div style={{ color: 'var(--warm-grey)', display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '16px', lineHeight: 1.8, marginBottom: '32px' }}>
              <p>
                ZEVRO was born from a simple belief: luxury is not just about price, but about the feeling of quiet confidence it instills in the wearer. 
              </p>
              <p>
                We merge traditional Indian craftsmanship with contemporary silhouettes, creating pieces that honor our heritage while embracing modern elegance. 
              </p>
              <p>
                Every fabric is meticulously chosen, every seam thoughtfully placed, ensuring that when you wear ZEVRO, you wear art.
              </p>
            </div>

            <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontStyle: 'italic', color: 'var(--espresso)', marginBottom: '40px' }}>
              — WEAR TO INSPIRE
            </p>

            <Link href="/about" className="btn btn-outline-gold" style={{ border: '1px solid var(--gold)', color: 'var(--espresso)', padding: '14px 36px' }}>
              ABOUT US →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
