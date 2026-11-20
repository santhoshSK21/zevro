'use client';

import React from 'react';

export interface TrustBarProps {
  item1?: string;
  item2?: string;
  item3?: string;
  item4?: string;
}

export default function TrustBar({
  item1 = 'On all domestic orders above ₹999',
  item2 = 'Generational Indian handloom techniques',
  item3 = 'End-to-end encrypted 256-bit gateway',
  item4 = '7-day complimentary concierge return',
}: TrustBarProps = {}) {
  const items = [
    {
      title: 'COMPLIMENTARY SHIPPING',
      sub: item1,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C5A869" strokeWidth="1.5">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      title: 'ARTISANAL MASTERY',
      sub: item2,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C5A869" strokeWidth="1.5">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ),
    },
    {
      title: 'PRIVILEGED SECURITY',
      sub: item3,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C5A869" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      title: 'CONCIERGE RETURNS',
      sub: item4,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C5A869" strokeWidth="1.5">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="trust-bar-section">
      <div className="container trust-bar-grid">
        {items.map((item, i) => (
          <div key={i} className="trust-item">
            <div className="trust-icon-wrap">
              {item.icon}
            </div>
            <div className="trust-text-wrap">
              <h4 className="trust-title">{item.title}</h4>
              <p className="trust-sub">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .trust-bar-section {
          background-color: var(--color-surface);
          padding: 32px 0;
          border-top: 1px solid var(--color-stone);
          border-bottom: 1px solid var(--color-stone);
        }
        .trust-bar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(16px, 2.5vw, 32px);
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 8px 12px;
          border-radius: 4px;
          transition: background 0.3s ease;
        }
        .trust-item:hover {
          background: rgba(197, 168, 105, 0.08);
        }
        .trust-icon-wrap {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #141412;
          border: 1px solid rgba(197, 168, 105, 0.4);
        }
        .trust-text-wrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .trust-title {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.16em;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0;
          text-transform: uppercase;
        }
        .trust-sub {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--color-ink-muted);
          margin: 0;
          line-height: 1.4;
        }
        @media (max-width: 960px) {
          .trust-bar-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        @media (max-width: 520px) {
          .trust-bar-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}} />
    </div>
  );
}
