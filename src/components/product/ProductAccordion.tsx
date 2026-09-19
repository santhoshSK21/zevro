'use client';

import React, { useState } from 'react';

interface Review {
  author: string;
  rating: number;
  date: string;
  body: string;
}

interface ProductAccordionProps {
  product?: any;
}

function AccordionItem({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--color-stone)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}
        aria-expanded={open}
      >
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--color-ink)', textTransform: 'uppercase' }}>{title}</span>
        <span style={{ fontSize: '20px', color: 'var(--color-ink-muted)', lineHeight: 1 }}>{open ? '−' : '+'}</span>
      </button>
      <div style={{ maxHeight: open ? '2000px' : '0', overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
        <div style={{ paddingBottom: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {[1,2,3,4,5].map(n => (
        <svg key={n} width="12" height="12" viewBox="0 0 24 24" fill={n <= Math.round(rating) ? 'var(--color-ink)' : 'none'} stroke="var(--color-ink)" strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </span>
  );
}

export default function ProductAccordion({ product }: ProductAccordionProps) {
  const reviews: Review[] = product?.reviews || [];
  const avgRating: number = product?.avgRating || 0;
  const reviewCount: number = product?.reviewCount || reviews.length;
  const material: string = product?.material || '100% Premium Fabric Blend';
  const careInstructions: string = product?.careInstructions || 'Dry clean recommended. Store in a cool, dry place.';

  // Rating breakdown (mock distribution from avg)
  const breakdown = [5,4,3,2,1].map(star => ({
    star,
    pct: star === Math.round(avgRating) ? 55 : star === Math.round(avgRating) - 1 ? 25 : star === Math.round(avgRating) + 1 ? 12 : 5
  }));

  return (
    <div style={{ borderTop: '1px solid var(--color-stone)' }}>

      {/* Material & Care */}
      <AccordionItem title="Material & Care" defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--color-ink-muted)', marginBottom: '6px' }}>COMPOSITION</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-ink)', lineHeight: 1.7 }}>{material}</p>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--color-ink-muted)', marginBottom: '6px' }}>CARE INSTRUCTIONS</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-ink)', lineHeight: 1.7 }}>{careInstructions}</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '4px' }}>
            {['Dry Clean', 'Do Not Bleach', 'Cool Iron', 'Do Not Tumble Dry'].map(care => (
              <span key={care} style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--color-ink-muted)', padding: '4px 10px', border: '1px solid var(--color-stone)' }}>{care}</span>
            ))}
          </div>
        </div>
      </AccordionItem>

      {/* Shipping & Returns */}
      <AccordionItem title="Shipping & Returns">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { icon: '🚚', text: 'Free standard delivery on orders above ₹999. Express delivery available at checkout.' },
            { icon: '📦', text: 'Estimated delivery: 3–5 business days from dispatch.' },
            { icon: '↩️', text: '7-day hassle-free returns. Item must be unused with original tags attached.' },
            { icon: '💳', text: 'Refunds processed to original payment method within 5–7 business days.' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '14px', flexShrink: 0 }}>{icon}</span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-ink-muted)', lineHeight: 1.7 }}>{text}</p>
            </div>
          ))}
        </div>
      </AccordionItem>

      {/* Ratings & Reviews */}
      <AccordionItem title={`Ratings & Reviews (${reviewCount})`}>
        {/* Aggregate */}
        <div style={{ display: 'flex', gap: '32px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 300, color: 'var(--color-ink)', lineHeight: 1 }}>{avgRating}</p>
            <Stars rating={avgRating} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '4px' }}>{reviewCount} reviews</p>
          </div>
          <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
            {breakdown.map(({ star, pct }) => (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--color-ink-muted)', width: '12px', flexShrink: 0 }}>{star}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--color-ink)" stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                <div style={{ flex: 1, height: '6px', background: 'var(--color-surface)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-ink)', borderRadius: '3px', transition: 'width 0.6s ease' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--color-ink-muted)', width: '28px', textAlign: 'right' }}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reviews.map((review, i) => (
            <div key={i} style={{ paddingBottom: '20px', borderBottom: i < reviews.length - 1 ? '1px solid var(--color-stone)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <Stars rating={review.rating} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, color: 'var(--color-ink)', marginTop: '4px' }}>{review.author}</p>
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--color-ink-muted)' }}>{review.date}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-ink-muted)', lineHeight: 1.7 }}>{review.body}</p>
            </div>
          ))}
        </div>
      </AccordionItem>

      {/* Styling Tips */}
      <AccordionItem title="Styling Tips">
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-ink-muted)', lineHeight: 1.8 }}>
          Pair with statement gold jewellery and minimal makeup for a sophisticated evening look. Dress it down with simple flats and a tote for a polished daytime ensemble. Layer with a structured blazer for a modern work-ready look.
        </p>
      </AccordionItem>

    </div>
  );
}

