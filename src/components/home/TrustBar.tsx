import React from 'react';

export default function TrustBar() {
  const items = [
    { title: 'FREE SHIPPING', sub: 'Orders above ₹999' },
    { title: 'PREMIUM QUALITY', sub: 'Crafted with perfection' },
    { title: 'SECURE PAYMENTS', sub: '256-bit encrypted' },
    { title: 'EASY RETURNS', sub: '7-day hassle-free' },
    { title: '24/7 SUPPORT', sub: 'Always here for you' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', padding: '64px 0', borderTop: '1px solid var(--color-stone)' }}>
      <div className="container trust-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px', textAlign: 'center' }}>
        {items.map((item, i) => (
          <div key={i} className="trust-item">
            <h4 style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.15em', fontWeight: 500, color: 'var(--color-ink)', marginBottom: '8px' }}>{item.title}</h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--color-ink-muted)' }}>{item.sub}</p>
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .trust-bar { flex-wrap: nowrap !important; overflow-x: auto; padding-bottom: 8px; justify-content: flex-start !important; }
          .trust-bar::-webkit-scrollbar { display: none; }
          .trust-item { min-width: 200px; flex-shrink: 0; }
        }
      `}} />
    </div>
  );
}
