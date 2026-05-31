'use client';

import React, { useState, useEffect } from 'react';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const reviews = [
    { text: "The craftsmanship is unparalleled. I wore the ivory anarkali to my friend's wedding and received so many compliments.", author: "Priya S.", city: "Mumbai" },
    { text: "ZEVRO manages to blend modern aesthetics with traditional techniques perfectly. The quality is worth every penny.", author: "Ananya R.", city: "Delhi" },
    { text: "My go-to brand for work and festive wear. The fits are always perfect and the fabrics feel luxurious.", author: "Meera K.", city: "Bangalore" },
    { text: "Excellent customer service and the packaging is beautiful. Makes opening every order feel like a special occasion.", author: "Neha M.", city: "Chennai" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <section className="section" style={{ backgroundColor: 'var(--cream)', textAlign: 'center' }}>
      <div className="container-sm">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.2em', color: 'var(--espresso)', marginBottom: '48px', textTransform: 'uppercase' }}>
          WHAT OUR CUSTOMERS SAY
        </h2>

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', minHeight: '250px' }}>
          {reviews.map((r, i) => (
            <div 
              key={i} 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%',
                opacity: activeIndex === i ? 1 : 0,
                visibility: activeIndex === i ? 'visible' : 'hidden',
                transition: 'opacity 0.8s ease-in-out, visibility 0.8s ease-in-out',
                padding: '0 24px' 
              }}
            >
              <div style={{ color: 'var(--gold)', fontSize: '20px', letterSpacing: '4px', marginBottom: '24px' }}>
                ★★★★★
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 4vw, 28px)', fontStyle: 'italic', color: 'var(--espresso)', lineHeight: 1.6, marginBottom: '32px' }}>
                "{r.text}"
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', letterSpacing: '0.1em', color: 'var(--warm-grey)', textTransform: 'uppercase' }}>
                — {r.author}, {r.city}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
