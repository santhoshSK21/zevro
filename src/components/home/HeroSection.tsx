'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    eyebrow: 'ZEVRO',
    title: 'WEAR TO INSPIRE',
    subtitle: 'Timeless designs. Modern elegance.',
    cta: 'EXPLORE COLLECTION',
    link: '/products',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1400&q=80'
  },
  {
    eyebrow: 'NEW IN',
    title: 'JUST DROPPED',
    subtitle: 'Be the first to wear the latest.',
    cta: 'SHOP NEW IN',
    link: '/new-in',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=80'
  },
  {
    eyebrow: 'ETHNIC WEAR',
    title: 'TRADITION REIMAGINED',
    subtitle: 'Heritage craftsmanship for the modern woman.',
    cta: 'SHOP ETHNIC',
    link: '/products?category=ethnic-wear',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1400&q=80'
  }
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--ivory)' }}>
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div 
            key={index}
            className={isActive ? 'hero-slide-enter' : 'hero-slide-exit'}
            style={{
              position: 'absolute', inset: 0,
              display: isActive ? 'flex' : 'none',
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 1 : 0
            }}
          >
            {/* Left Content (40%) */}
            <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10%', position: 'relative', zIndex: 2 }}>
              <div className={isActive ? 'fade-up fade-up-delay-1' : ''}>
                <p style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '16px' }}>{slide.eyebrow}</p>
                <h2 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: '88px', color: 'var(--espresso)', lineHeight: 1.1, marginBottom: '24px' }}>
                  {slide.title.split(' ')[0]} <br/> <em style={{ fontStyle: 'italic', fontWeight: 300 }}>{slide.title.split(' ').slice(1).join(' ')}</em>
                </h2>
              </div>
              <div className={isActive ? 'fade-up fade-up-delay-2' : ''}>
                <div className="gold-rule" />
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontStyle: 'italic', color: 'var(--warm-grey)', marginBottom: '40px' }}>{slide.subtitle}</p>
              </div>
              <div className={isActive ? 'fade-up fade-up-delay-3' : ''}>
                <Link href={slide.link} className="btn btn-primary" style={{ padding: '16px 48px' }}>
                  {slide.cta} <span style={{ marginLeft: '8px' }}>→</span>
                </Link>
              </div>
            </div>

            {/* Right Image (60%) */}
            <div style={{ flex: '1', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to right, var(--ivory) 0%, transparent 15%)' }} />
              <Image 
                src={slide.image} 
                alt={slide.title} 
                fill 
                priority={index === 0}
                style={{ 
                  objectFit: 'cover', 
                  animation: isActive ? 'scaleIn 5s linear forwards' : 'none',
                  transformOrigin: 'center right'
                }} 
              />
            </div>
          </div>
        );
      })}

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '40px', left: '10%', display: 'flex', gap: '12px', zIndex: 10 }}>
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            style={{ 
              width: '8px', height: '8px', borderRadius: '50%', 
              backgroundColor: i === current ? 'var(--gold)' : 'rgba(0,0,0,0.2)',
              transition: 'all 0.3s'
            }} 
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scaleIn {
          from { transform: scale(1.05); }
          to { transform: scale(1); }
        }
        @media (max-width: 1024px) {
          .hero-slide-enter, .hero-slide-exit { flex-direction: column-reverse !important; }
          .hero-slide-enter > div:first-child { flex: 1 !important; padding: 40px !important; text-align: center; align-items: center; }
          .hero-slide-enter > div:last-child { flex: 1.5 !important; }
          .hero-slide-enter > div:last-child > div { background: linear-gradient(to top, var(--ivory) 0%, transparent 40%) !important; }
        }
      `}} />
    </section>
  );
}
