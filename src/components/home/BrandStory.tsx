'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function BrandStory() {
  const prefersReducedMotion = useReducedMotion();

  const metrics = [
    { num: '500+', label: 'MASTER ARTISANS', desc: 'Sustaining generational handloom heritage' },
    { num: '100%', label: 'NATURAL FIBERS', desc: 'Pure mulberry silk, linen & fine wool' },
    { num: '72 hrs', label: 'HAND DETAILING', desc: 'Meticulous embroidery & hand-sewn drapes' },
    { num: 'EST. 2026', label: 'NEW DELHI ATELIER', desc: 'Quiet Indian luxury for the modern world' },
  ];

  return (
    <section className="section bg-dark brand-story-section">
      <div className="container">
        <div className="brand-story-grid">
          {/* Left: Imagery with Framed Monogram Seal */}
          <motion.div
            className="brand-story-image-wrap"
            initial={prefersReducedMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="brand-story-img-inner">
              <Image 
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=80" 
                alt="Artisanal craft at ZEVRO atelier" 
                fill 
                className="brand-story-img"
                sizes="(max-width: 860px) 100vw, 50vw"
              />
              <div className="brand-story-img-overlay" />
            </div>

            {/* Floating Luxury Atelier Seal */}
            <div className="atelier-seal-badge">
              <div className="seal-inner">
                <span className="seal-sparkle">✦</span>
                <span className="seal-title">ZEVRO</span>
                <span className="seal-sub">HAUTE ATELIER</span>
                <span className="seal-year">MCMXXVI</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Editorial Narrative & Craft Metrics */}
          <motion.div
            className="brand-story-text-col"
            initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="brand-tag-row">
              <span className="brand-sparkle">✦</span>
              <span className="label-caps" style={{ color: 'var(--color-accent)' }}>
                THE ATELIER PHILOSOPHY
              </span>
              <span className="brand-sparkle">✦</span>
            </div>

            <h2 className="brand-story-headline">
              BORN OF HERITAGE, <br />
              <span className="serif-italic">Tailored for Today</span>
            </h2>

            <div className="brand-story-gold-rule" />
            
            <div className="brand-story-paragraphs">
              <p>
                ZEVRO was founded on a singular conviction: luxury does not shout with ostentatious logos. It reveals itself in the drape of handloom mulberry silk, the weight of velvet against the collar, and the quiet confidence it inspires in the wearer.
              </p>
              <p>
                Bridging centuries-old Indian craft techniques with architectural, contemporary silhouettes, each collection celebrates timeless sartorial discipline.
              </p>
            </div>

            <p className="brand-story-quote">
              “Wear not to follow, but to inspire.”
            </p>

            {/* 4-Item Craft Metrics Grid */}
            <div className="brand-metrics-grid">
              {metrics.map((m, i) => (
                <div key={i} className="metric-cell">
                  <span className="metric-number">{m.num}</span>
                  <span className="metric-title">{m.label}</span>
                  <span className="metric-desc">{m.desc}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '32px' }}>
              <Link href="/about" className="brand-story-cta">
                DISCOVER OUR ATELIER PROCESS →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .brand-story-section {
          background-color: #121210;
          color: #FAF7F2;
          padding: clamp(64px, 8vw, 96px) 0;
          position: relative;
          overflow: hidden;
        }
        .brand-story-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: clamp(40px, 6vw, 72px);
          align-items: center;
        }
        .brand-story-image-wrap {
          position: relative;
          width: 100%;
        }
        .brand-story-img-inner {
          position: relative;
          aspect-ratio: 4 / 5;
          width: 100%;
          overflow: hidden;
          background-color: #1c1c19;
          border-radius: 4px;
          border: 1px solid rgba(197, 168, 105, 0.3);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .brand-story-img {
          object-fit: cover;
          filter: contrast(1.05) brightness(0.9);
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .brand-story-image-wrap:hover .brand-story-img {
          transform: scale(1.03);
        }
        .brand-story-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(18, 18, 16, 0.6) 0%, transparent 60%);
        }
        .atelier-seal-badge {
          position: absolute;
          bottom: -24px;
          right: -24px;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: #181816;
          border: 2px solid #C5A869;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6), inset 0 0 16px rgba(197, 168, 105, 0.15);
          z-index: 5;
        }
        .seal-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2px;
        }
        .seal-sparkle {
          color: #C5A869;
          font-size: 10px;
        }
        .seal-title {
          font-family: var(--font-display);
          font-size: 14px;
          letter-spacing: 0.2em;
          color: #C5A869;
          font-weight: 700;
        }
        .seal-sub {
          font-family: var(--font-ui);
          font-size: 8px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #FAF7F2;
        }
        .seal-year {
          font-family: var(--font-ui);
          font-size: 7px;
          letter-spacing: 0.16em;
          color: rgba(250, 247, 242, 0.6);
          margin-top: 2px;
        }
        .brand-story-text-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .brand-tag-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .brand-sparkle {
          color: #C5A869;
          font-size: 11px;
        }
        .brand-story-headline {
          font-family: var(--font-display);
          font-size: clamp(28px, 3.4vw, 44px);
          font-weight: 400;
          color: #FAF7F2;
          letter-spacing: -0.015em;
          margin: 0;
          line-height: 1.15;
        }
        .brand-story-gold-rule {
          width: 48px;
          height: 1px;
          background: #C5A869;
          margin: 18px 0 24px;
        }
        .brand-story-paragraphs {
          color: rgba(250, 247, 242, 0.85);
          display: flex;
          flex-direction: column;
          gap: 16px;
          font-size: 15px;
          line-height: 1.75;
          margin-bottom: 24px;
        }
        .brand-story-quote {
          font-family: var(--font-display);
          font-size: 19px;
          font-style: italic;
          color: #C5A869;
          margin-bottom: 28px;
        }
        .brand-metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px 24px;
          width: 100%;
          padding: 20px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .metric-cell {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .metric-number {
          font-family: var(--font-display);
          font-size: 24px;
          color: #FAF7F2;
          font-weight: 500;
        }
        .metric-title {
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #C5A869;
          font-weight: 600;
        }
        .metric-desc {
          font-family: var(--font-body);
          font-size: 12px;
          color: rgba(250, 247, 242, 0.65);
          line-height: 1.4;
        }
        .brand-story-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          color: #141412;
          background: #C5A869;
          padding: 13px 28px;
          border-radius: 2px;
          text-decoration: none;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .brand-story-cta:hover {
          background: #DFCA95;
          transform: translateY(-2px);
        }
        @media (max-width: 860px) {
          .brand-story-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .atelier-seal-badge {
            width: 100px;
            height: 100px;
            bottom: -16px;
            right: -16px;
          }
          .seal-title {
            font-size: 12px;
          }
        }
      `}} />
    </section>
  );
}
