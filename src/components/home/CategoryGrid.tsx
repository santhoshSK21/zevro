'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export interface CategoryGridProps {
  title?: string;
  subtitle?: string;
}

export default function CategoryGrid({
  title = 'CURATED DEPARTMENTS',
  subtitle = 'AUTUMN / WINTER 2026 ATELIER',
}: CategoryGridProps = {}) {
  const prefersReducedMotion = useReducedMotion();

  const categories = [
    {
      num: '01',
      eyebrow: 'Architectural Cuts & Fluid Tailoring',
      title: 'Western Wear',
      tagline: 'Modern Elegance',
      image: '/cat_western_wear.png',
      link: '/category/western-wear',
      accent: 'Crisp Silhouettes',
    },
    {
      num: '02',
      eyebrow: 'Heirloom Silks & Zari Embroidery',
      title: 'Ethnic Wear',
      tagline: 'Heritage Craft',
      image: '/cat_ethnic_wear.png',
      link: '/category/ethnic-wear',
      accent: 'Artisanal Drapes',
    },
    {
      num: '03',
      eyebrow: 'East Meets West Sartorial Innovation',
      title: 'Indo-Western',
      tagline: 'The Fusion Edit',
      image: '/cat_indo_western.png',
      link: '/category/indo-western',
      accent: 'Draped Capes & Sets',
    },
    {
      num: '04',
      eyebrow: 'Handcrafted Jewellery & Silk Stoles',
      title: 'Accessories',
      tagline: 'Artisanal Accents',
      image: '/cat_accessories.png',
      link: '/category/accessories',
      accent: 'Signature Details',
    },
  ];

  return (
    <section className="catgrid-section">
      <div className="container">
        {/* Editorial Section Header */}
        <motion.div
          className="catgrid-header"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="catgrid-tag-wrap">
            <span className="catgrid-star">✦</span>
            <span className="catgrid-tag">{subtitle}</span>
            <span className="catgrid-star">✦</span>
          </div>
          <h2 className="catgrid-title">
            THE ATELIER <span className="catgrid-italic">COLLECTIONS</span>
          </h2>
          <div className="catgrid-gold-line" />
        </motion.div>

        {/* Editorial 4-Card Luxury Asymmetric Grid */}
        <div className="catgrid-grid">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.num}
              className={`catgrid-card ${i === 0 || i === 3 ? 'card-tall' : 'card-wide'}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={cat.link} className="catgrid-link">
                <div className="catgrid-img-container">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    loading={i < 2 ? 'eager' : 'lazy'}
                    className="catgrid-img"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Subtle Grain & Ambient Gradient */}
                  <div className="catgrid-vignette" />
                  
                  {/* Top Badge: Numbering & Tagline */}
                  <div className="catgrid-badge-top">
                    <span className="catgrid-num">{cat.num}</span>
                    <span className="catgrid-pill-tag">{cat.tagline}</span>
                  </div>

                  {/* Bottom Content with Floating Pill Motion */}
                  <div className="catgrid-card-content">
                    <span className="catgrid-eyebrow">{cat.eyebrow}</span>
                    <h3 className="catgrid-name">{cat.title}</h3>
                    <div className="catgrid-action-row">
                      <span className="catgrid-explore-btn">
                        DISCOVER SILHOUETTE <span className="btn-arrow">→</span>
                      </span>
                      <span className="catgrid-accent-tag">{cat.accent}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .catgrid-section {
          padding: clamp(24px, 3.5vw, 40px) 0;
          background-color: var(--color-bg);
          position: relative;
        }
        .catgrid-header {
          text-align: center;
          margin-bottom: clamp(32px, 4vw, 48px);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .catgrid-tag-wrap {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .catgrid-star {
          color: var(--color-accent);
          font-size: 11px;
        }
        .catgrid-tag {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--color-accent);
          font-weight: 600;
        }
        .catgrid-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 3.8vw, 3.2rem);
          color: var(--color-ink);
          font-weight: 400;
          letter-spacing: -0.015em;
          margin: 0;
          line-height: 1.15;
        }
        .catgrid-italic {
          font-style: italic;
          color: var(--color-ink);
        }
        .catgrid-gold-line {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
          margin-top: 14px;
        }
        .catgrid-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(16px, 2.5vw, 28px);
        }
        .catgrid-card {
          position: relative;
          background-color: var(--color-surface);
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid var(--color-stone);
          transition: transform 0.6s var(--ease-luxury), box-shadow 0.6s var(--ease-luxury), border-color 0.4s ease;
        }
        .catgrid-card:hover {
          transform: translateY(-4px);
          border-color: rgba(197, 168, 105, 0.6);
          box-shadow: 0 16px 40px rgba(20, 20, 18, 0.08);
        }
        .catgrid-link {
          display: block;
          position: relative;
          width: 100%;
          height: 100%;
          text-decoration: none;
        }
        .catgrid-img-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 13;
          overflow: hidden;
        }
        .catgrid-img {
          object-fit: cover;
          object-position: center 30%;
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease;
          filter: brightness(0.92) contrast(1.04);
        }
        .catgrid-card:hover .catgrid-img {
          transform: scale(1.045);
          filter: brightness(0.96) contrast(1.06);
        }
        .catgrid-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(18, 18, 16, 0.82) 0%,
            rgba(18, 18, 16, 0.35) 45%,
            rgba(18, 18, 16, 0.12) 100%
          );
          transition: opacity 0.5s ease;
        }
        .catgrid-badge-top {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 2;
        }
        .catgrid-num {
          font-family: var(--font-display);
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
          letter-spacing: 0.15em;
          font-weight: 500;
        }
        .catgrid-pill-tag {
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          color: #FAF7F2;
          background: rgba(20, 20, 18, 0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(197, 168, 105, 0.3);
          padding: 4px 12px;
          border-radius: 20px;
        }
        .catgrid-card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: clamp(20px, 3vw, 32px);
          color: #FAF7F2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          z-index: 2;
        }
        .catgrid-eyebrow {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-accent-light);
          margin-bottom: 6px;
        }
        .catgrid-name {
          font-family: var(--font-display);
          font-size: clamp(24px, 2.6vw, 34px);
          font-weight: 400;
          letter-spacing: -0.01em;
          color: #FFFFFF;
          margin: 0 0 12px 0;
          line-height: 1.15;
        }
        .catgrid-action-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 12px;
        }
        .catgrid-explore-btn {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #141412;
          background: #FAF7F2;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s var(--ease-luxury);
        }
        .btn-arrow {
          transition: transform 0.3s ease;
        }
        .catgrid-card:hover .catgrid-explore-btn {
          background: #C5A869;
          color: #141412;
        }
        .catgrid-card:hover .btn-arrow {
          transform: translateX(3px);
        }
        .catgrid-accent-tag {
          font-family: var(--font-body);
          font-size: 12px;
          color: rgba(250, 247, 242, 0.7);
          font-style: italic;
        }
        @media (max-width: 820px) {
          .catgrid-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .catgrid-img-container {
            aspect-ratio: 16 / 11;
          }
          .catgrid-accent-tag {
            display: none;
          }
        }
      `}} />
    </section>
  );
}
