'use client';

import React from 'react';

export default function EditorialMarquee() {
  const items = [
    'AUTUMN / WINTER 2026 EDITORIAL',
    '100% ARTISANAL MULBERRY SILK & LINEN',
    'ETHICALLY HANDCRAFTED IN INDIA',
    'TIMELESS CONTEMPORARY SILHOUETTES',
    'COMPLIMENTARY EXPRESS DISPATCH ABOVE ₹999',
    'BESPOKE ATELIER TAILORING & FIT',
    'AUTHENTIC HERITAGE WEAVES',
  ];

  return (
    <div className="editorial-marquee-wrap" aria-label="Brand highlights ticker">
      <div className="editorial-marquee-track">
        {/* First repetition */}
        <div className="editorial-marquee-group">
          {items.map((item, idx) => (
            <span key={`a-${idx}`} className="marquee-item">
              <span className="marquee-star">✦</span>
              <span className="marquee-text">{item}</span>
            </span>
          ))}
        </div>
        {/* Second repetition for continuous seamless loop */}
        <div className="editorial-marquee-group" aria-hidden="true">
          {items.map((item, idx) => (
            <span key={`b-${idx}`} className="marquee-item">
              <span className="marquee-star">✦</span>
              <span className="marquee-text">{item}</span>
            </span>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .editorial-marquee-wrap {
          width: 100%;
          background: #141412;
          color: #FAF7F2;
          border-top: 1px solid rgba(197, 168, 105, 0.35);
          border-bottom: 1px solid rgba(197, 168, 105, 0.35);
          overflow: hidden;
          padding: 14px 0;
          position: relative;
          z-index: 5;
        }
        .editorial-marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 34s linear infinite;
        }
        .editorial-marquee-wrap:hover .editorial-marquee-track {
          animation-play-state: paused;
        }
        .editorial-marquee-group {
          display: flex;
          align-items: center;
          gap: 36px;
          padding-right: 36px;
          white-space: nowrap;
        }
        .marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 16px;
        }
        .marquee-star {
          color: #C5A869;
          font-size: 11px;
          opacity: 0.9;
        }
        .marquee-text {
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #FAF7F2;
          transition: color 0.3s ease;
        }
        .marquee-item:hover .marquee-text {
          color: #C5A869;
        }
        @media (max-width: 768px) {
          .editorial-marquee-wrap {
            padding: 11px 0;
          }
          .marquee-text {
            font-size: 10px;
            letter-spacing: 0.2em;
          }
          .editorial-marquee-group {
            gap: 24px;
            padding-right: 24px;
          }
        }
      `}} />
    </div>
  );
}
