import React from 'react';
import Link from 'next/link';

export default function EditorialBanner() {
  return (
    <section className="editorial-banner-section">
      <div 
        className="editorial-banner-bg"
        style={{ 
          backgroundImage: 'url(/pdp_hero_1.png)',
        }} 
      />
      <div className="editorial-banner-overlay" />
      
      <div className="container editorial-banner-content">
        <span className="editorial-tag">THE EDITORIAL</span>
        <h2 className="editorial-title">
          THE SIGNATURE EDIT
        </h2>
        <p className="editorial-desc">
          Effortless silhouettes crafted with quiet confidence.
        </p>
        <div>
          <Link href="/category/ethnic-wear" className="editorial-btn">
            EXPLORE COLLECTION →
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .editorial-banner-section {
          position: relative;
          width: 100%;
          height: 60vh;
          min-height: 480px;
          overflow: hidden;
          background-color: #1B1B19;
        }
        .editorial-banner-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 25%;
          filter: contrast(1.02) brightness(0.92);
        }
        .editorial-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(27, 27, 25, 0.4) 0%,
            rgba(27, 27, 25, 0.5) 100%
          );
        }
        .editorial-banner-content {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: #FAF8F5;
          z-index: 2;
        }
        .editorial-tag {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #B49A68;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .editorial-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 5.5vw, 58px);
          color: #FAF8F5;
          font-weight: 400;
          margin: 0 0 14px 0;
          letter-spacing: -0.01em;
        }
        .editorial-desc {
          font-family: var(--font-body);
          color: rgba(245, 241, 232, 0.88);
          font-size: 15px;
          letter-spacing: 0.04em;
          margin-bottom: 32px;
          max-width: 440px;
          line-height: 1.6;
        }
        .editorial-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #FAF8F5;
          color: #1C1C1A;
          padding: 14px 32px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.35s ease;
          border: 1px solid #FAF8F5;
        }
        .editorial-btn:hover {
          background: transparent;
          color: #FAF8F5;
          transform: translateY(-1px);
        }
      `}} />
    </section>
  );
}
