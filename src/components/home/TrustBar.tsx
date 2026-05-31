import React from 'react';

export default function TrustBar() {
  const items = [
    { icon: '🚚', title: 'FREE SHIPPING', sub: 'On orders above ₹999' },
    { icon: '✦', title: 'PREMIUM QUALITY', sub: 'Crafted with perfection' },
    { icon: '🔒', title: 'SECURE PAYMENTS', sub: '256-bit encrypted' },
    { icon: '↩', title: 'EASY RETURNS', sub: '7-day hassle-free' },
    { icon: '💬', title: '24/7 SUPPORT', sub: 'Always here for you' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--black)', padding: '32px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '28px', color: 'var(--gold)' }}>{item.icon}</span>
            <div>
              <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.15em', fontWeight: 500, color: 'var(--ivory)', marginBottom: '4px' }}>{item.title}</h4>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--warm-grey)' }}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
