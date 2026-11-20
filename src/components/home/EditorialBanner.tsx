'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export interface EditorialBannerProps {
  tag?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
}

export default function EditorialBanner({
  tag = 'COLLECTION N° 04',
  title = 'THE SIGNATURE EDIT',
  description = 'Effortless silhouettes crafted with quiet confidence. Merging raw Indian artisanal silks with minimalist architectural tailoring.',
  buttonText = 'EXPLORE COLLECTION',
  buttonLink = '/category/ethnic-wear',
  imageUrl = '/pdp_hero_1.png',
}: EditorialBannerProps = {}) {
  const prefersReducedMotion = useReducedMotion();
  const resolvedBg = imageUrl && !imageUrl.includes('placeholder') ? imageUrl : '/pdp_hero_1.png';

  return (
    <section className="ed-banner-section">
      <div 
        className="ed-banner-bg"
        style={{ 
          backgroundImage: `url(${resolvedBg})`,
        }} 
      />
      <div className="ed-banner-overlay" />
      
      {/* Decorative Gold Frame */}
      <div className="ed-banner-inner">
        <div className="container">
          <motion.div
            className="ed-banner-content"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Tag Badge */}
            <div className="ed-badge-row">
              <span className="ed-sparkle">✦</span>
              <span className="ed-tag">{tag}</span>
              <span className="ed-sparkle">✦</span>
            </div>

            {/* Title with Italic Contrast */}
            <h2 className="ed-title">
              {title}
            </h2>

            {/* Gold Divider */}
            <div className="ed-gold-divider" />

            {/* Description */}
            <p className="ed-desc">
              {description}
            </p>

            {/* Dual Actions */}
            <div className="ed-actions">
              <Link href={buttonLink} className="ed-btn-primary">
                {buttonText.replace(/→/g, '').trim()} <span className="arrow">→</span>
              </Link>
              <Link href="/about" className="ed-btn-secondary">
                READ THE ATELIER STORY
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ed-banner-section {
          position: relative;
          width: 100%;
          min-height: 420px;
          overflow: hidden;
          background-color: #121210;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ed-banner-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 35%;
          filter: contrast(1.05) brightness(0.78);
          transform: scale(1.02);
          transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ed-banner-section:hover .ed-banner-bg {
          transform: scale(1.05);
        }
        .ed-banner-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(18, 18, 16, 0.5) 0%,
            rgba(18, 18, 16, 0.82) 80%,
            rgba(18, 18, 16, 0.95) 100%
          );
        }
        .ed-banner-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          padding: clamp(48px, 6vw, 76px) 0;
        }
        .ed-banner-content {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: clamp(32px, 5vw, 48px) clamp(24px, 4vw, 40px);
          background: rgba(20, 20, 18, 0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(197, 168, 105, 0.35);
          border-radius: 4px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }
        .ed-badge-row {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .ed-sparkle {
          color: #C5A869;
          font-size: 11px;
        }
        .ed-tag {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #C5A869;
          font-weight: 600;
        }
        .ed-title {
          font-family: var(--font-display);
          font-size: clamp(32px, 5vw, 52px);
          color: #FAF7F2;
          font-weight: 400;
          margin: 0;
          letter-spacing: -0.015em;
          line-height: 1.15;
        }
        .ed-gold-divider {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #C5A869, transparent);
          margin: 16px 0;
        }
        .ed-desc {
          font-family: var(--font-body);
          font-size: clamp(14px, 1.8vw, 16px);
          line-height: 1.7;
          color: rgba(250, 247, 242, 0.85);
          margin: 0 0 28px 0;
          max-width: 580px;
        }
        .ed-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .ed-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #141412;
          background: #C5A869;
          padding: 13px 28px;
          border-radius: 2px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .ed-btn-primary:hover {
          background: #DFCA95;
          transform: translateY(-2px);
        }
        .ed-btn-primary .arrow {
          transition: transform 0.3s ease;
        }
        .ed-btn-primary:hover .arrow {
          transform: translateX(3px);
        }
        .ed-btn-secondary {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #FAF7F2;
          background: transparent;
          border: 1px solid rgba(250, 247, 242, 0.35);
          padding: 13px 24px;
          border-radius: 2px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .ed-btn-secondary:hover {
          border-color: #FAF7F2;
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }
        @media (max-width: 600px) {
          .ed-banner-content {
            padding: 28px 20px;
          }
          .ed-actions {
            flex-direction: column;
            width: 100%;
          }
          .ed-btn-primary, .ed-btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}} />
    </section>
  );
}
