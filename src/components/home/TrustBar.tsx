import React from 'react';

export default function TrustBar() {
  const items = [
    { title: 'COMPLIMENTARY SHIPPING', sub: 'On all orders above ₹999' },
    { title: 'ARTISANAL LUXURY', sub: 'Handcrafted with perfection' },
    { title: 'SECURE CHECKOUT', sub: 'Encrypted payment gateway' },
    { title: 'HASSLE-FREE RETURNS', sub: '7-day return policy' },
  ];

  return (
    <div className="trust-bar-section">
      <div className="container trust-bar-grid">
        {items.map((item, i) => (
          <div key={i} className="trust-item">
            <span className="trust-item-bullet" />
            <div>
              <h4 className="trust-title">{item.title}</h4>
              <p className="trust-sub">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .trust-bar-section {
          background-color: var(--color-surface);
          padding: 40px 0;
          border-top: 1px solid var(--color-stone);
          border-bottom: 1px solid var(--color-stone);
        }
        .trust-bar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }
        .trust-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .trust-item-bullet {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: var(--color-accent);
          margin-top: 5px;
          flex-shrink: 0;
        }
        .trust-title {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.14em;
          font-weight: 600;
          color: var(--color-ink);
          margin: 0 0 4px 0;
          text-transform: uppercase;
        }
        .trust-sub {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--color-ink-muted);
          margin: 0;
          line-height: 1.4;
        }
        @media (max-width: 900px) {
          .trust-bar-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }
        @media (max-width: 520px) {
          .trust-bar-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}} />
    </div>
  );
}
