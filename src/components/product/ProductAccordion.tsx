'use client';

import React, { useState } from 'react';

export default function ProductAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  const sections = [
    { title: 'PRODUCT DETAILS', content: 'Crafted from premium materials, this garment features exquisite detailing and a comfortable fit tailored for the modern silhouette. Material: 100% Silk Blend. Care: Dry clean only.' },
    { title: 'SHIPPING & RETURNS', content: 'Free standard shipping on all orders above ₹999. Delivery within 3-5 business days. We accept returns within 7 days of delivery. The item must be unused and with all original tags attached.' },
    { title: 'STYLING TIPS', content: 'Pair it with statement gold jewellery and minimal makeup for a sophisticated evening look, or dress it down with simple flats for a daytime event.' }
  ];

  return (
    <div style={{ borderTop: '1px solid var(--linen)' }}>
      {sections.map((sec, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--linen)' }}>
          <button 
            onClick={() => toggle(i)}
            style={{ 
              width: '100%', padding: '24px 0', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: 'transparent', border: 'none', cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--espresso)' }}>
              {sec.title}
            </span>
            <span style={{ fontSize: '18px', color: 'var(--warm-grey)' }}>
              {open === i ? '−' : '+'}
            </span>
          </button>
          
          <div style={{ 
            height: open === i ? 'auto' : '0', 
            overflow: 'hidden', 
            transition: 'height 0.3s ease'
          }}>
            <div style={{ paddingBottom: '24px', color: 'var(--warm-grey)', lineHeight: 1.6, fontSize: '14px' }}>
              {sec.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
