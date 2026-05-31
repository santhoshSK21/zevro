'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // Mock API call
    }
  };

  return (
    <section style={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      
      {/* Left Column: New Arrivals */}
      <div style={{ flex: '1 1 300px', backgroundColor: 'var(--black)', padding: '64px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '16px' }}>NEW ARRIVALS</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 36px)', color: 'var(--ivory)', marginBottom: '16px', fontWeight: 400 }}>
          JUST FOR YOU
        </h2>
        <p style={{ color: 'var(--warm-grey)', fontSize: '13px', marginBottom: '32px', maxWidth: '240px', lineHeight: 1.6 }}>
          Be the first to own the latest designs.
        </p>
        <Link href="/products?category=new-in" style={{ 
          fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.2em', 
          fontWeight: 600, color: 'var(--ivory)', borderBottom: '1px solid var(--ivory)', 
          alignSelf: 'flex-start', paddingBottom: '4px', transition: 'all 0.3s'
        }} className="hover-gold">
          SHOP NEW IN →
        </Link>
      </div>

      {/* Middle Column: Logo Plate */}
      <div style={{ flex: '1 1 300px', backgroundColor: '#0a0a0a', padding: '64px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: 'clamp(40px, 4vw, 56px)', 
          color: 'var(--gold)', 
          letterSpacing: '0.2em',
          fontWeight: 300,
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          marginBottom: '8px'
        }}>
          ZEVRO
        </h1>
        <p style={{ fontSize: '11px', letterSpacing: '0.4em', color: 'var(--warm-grey)', textTransform: 'uppercase' }}>
          WEAR TO INSPIRE
        </p>
      </div>

      {/* Right Column: Newsletter */}
      <div style={{ flex: '1.2 1 350px', backgroundColor: 'var(--beige)', padding: '64px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <p style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', color: 'var(--warm-grey)', textTransform: 'uppercase', marginBottom: '16px' }}>STAY INSPIRED</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3vw, 32px)', color: 'var(--espresso)', marginBottom: '16px', fontWeight: 400 }}>
          SIGN UP & GET 10% OFF
        </h2>
        <p style={{ color: 'var(--espresso)', fontSize: '13px', marginBottom: '32px', maxWidth: '320px', lineHeight: 1.6, opacity: 0.8 }}>
          Be the first to know about new collections, exclusive offers and more.
        </p>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', maxWidth: '400px', position: 'relative', zIndex: 2 }}>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                flex: 1,
                padding: '14px 20px',
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button type="submit" style={{ 
              backgroundColor: 'var(--black)', color: 'var(--ivory)', 
              border: 'none', padding: '0 24px', 
              fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.1em', fontWeight: 600,
              cursor: 'pointer', transition: 'background 0.3s'
            }} className="btn-hover-gold">
              SUBSCRIBE
            </button>
          </form>
        ) : (
          <div style={{ animation: 'fadeUp 0.5s ease', position: 'relative', zIndex: 2 }}>
            <p style={{ fontSize: '18px', color: 'var(--espresso)', marginBottom: '4px' }}>Welcome! 🎉</p>
            <p style={{ color: 'var(--espresso)' }}>Your code is: <strong style={{ color: 'var(--black)' }}>FIRST10</strong></p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hover-gold:hover { color: var(--gold) !important; border-color: var(--gold) !important; }
        .btn-hover-gold:hover { background-color: var(--gold) !important; color: var(--black) !important; }
      `}} />
    </section>
  );
}
