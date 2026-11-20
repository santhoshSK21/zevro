'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function FabricShowcase() {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const fabrics = [
    {
      id: 'silk',
      name: 'ORGANIC MULBERRY SILK',
      drape: 'Liquid & Fluid Drape',
      origin: 'Varanasi Heritage Looms',
      gsm: '70–95 GSM Silk Crepe',
      desc: 'Sourced from heritage mulberry cocoons, spun with zero chemical treatments. Catches candlelight with a quiet, pearlescent lustre.',
      colorAccent: '#C5A869',
      image: 'https://images.unsplash.com/photo-1583391733958-d69818b2c451?w=800&q=80',
      categoryLink: '/category/ethnic-wear',
    },
    {
      id: 'velvet',
      name: 'SCULPTED ROYAL VELVET',
      drape: 'Structured Architectural Form',
      origin: 'Artisanal Handloom Clusters',
      gsm: '320 GSM Deep Pile',
      desc: 'Woven with high-density pile to create rich shadows and regal weight. Tailored for evening galas, formal jackets, and bespoke ensembles.',
      colorAccent: '#B49A68',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
      categoryLink: '/category/western-wear',
    },
    {
      id: 'linen',
      name: 'AIR-SPUN PURE LINEN',
      drape: 'Crisp Breathable Silhouette',
      origin: 'European Flax Hand-Finished',
      gsm: '160 GSM Summer Weave',
      desc: 'Pre-washed with botanical enzymes for relaxed softness that only gets better with age. Ideal for minimalist shirts and contemporary trousers.',
      colorAccent: '#A89F91',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      categoryLink: '/category/western-wear',
    },
    {
      id: 'chanderi',
      name: 'HERITAGE GOLD CHANDERI',
      drape: 'Semi-Sheer Shimmering Drape',
      origin: 'Madhya Pradesh Master Guilds',
      gsm: '85 GSM Silk-Cotton Blend',
      desc: 'Interwoven with genuine zari metallic thread and fine cotton warp. Celebrated for centuries across Indian royal courts for festive grace.',
      colorAccent: '#DFCA95',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      categoryLink: '/category/indo-western',
    },
  ];

  const activeFabric = fabrics[selectedIdx];

  return (
    <section className="fabric-section">
      <div className="container">
        {/* Header */}
        <div className="fabric-header">
          <div className="fabric-tag-row">
            <span className="fabric-sparkle">✦</span>
            <span className="fabric-tag">TACTILE EXCELLENCE</span>
            <span className="fabric-sparkle">✦</span>
          </div>
          <h2 className="fabric-title">
            THE ATELIER <span className="serif-italic">Material Study</span>
          </h2>
          <p className="fabric-subtitle">
            Luxury begins with the fiber. Explore the exceptional natural textiles behind every ZEVRO garment.
          </p>
        </div>

        {/* Interactive Material Showcase Box */}
        <div className="fabric-card-wrap">
          {/* Left: Material Selector Tabs */}
          <div className="fabric-nav-col">
            {fabrics.map((fab, i) => (
              <button
                key={fab.id}
                onClick={() => setSelectedIdx(i)}
                className={`fabric-tab-btn ${selectedIdx === i ? 'is-active' : ''}`}
              >
                <div className="fabric-tab-indicator" />
                <div className="fabric-tab-info">
                  <div className="fabric-tab-top">
                    <span className="fabric-tab-num">0{i + 1}</span>
                    <span className="fabric-tab-drape">{fab.drape}</span>
                  </div>
                  <h4 className="fabric-tab-title">{fab.name}</h4>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Interactive Live Material Preview Stage */}
          <div className="fabric-stage-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFabric.id}
                className="fabric-stage"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(18, 18, 16, 0.88) 0%, rgba(18, 18, 16, 0.45) 60%, rgba(18, 18, 16, 0.75) 100%), url(${activeFabric.image})`,
                }}
              >
                <div className="fabric-stage-content">
                  <span className="fabric-badge-pill">
                    <span>ORIGIN: {activeFabric.origin}</span>
                  </span>

                  <h3 className="fabric-stage-heading">{activeFabric.name}</h3>

                  <div className="fabric-metrics-row">
                    <div className="fabric-metric">
                      <span className="metric-label">FABRIC WEIGHT</span>
                      <span className="metric-val">{activeFabric.gsm}</span>
                    </div>
                    <div className="fabric-metric-divider" />
                    <div className="fabric-metric">
                      <span className="metric-label">CHARACTERISTIC</span>
                      <span className="metric-val">{activeFabric.drape}</span>
                    </div>
                  </div>

                  <p className="fabric-stage-desc">{activeFabric.desc}</p>

                  <Link href={activeFabric.categoryLink} className="fabric-cta-btn">
                    EXPLORE GARMENTS IN THIS WEAVE →
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .fabric-section {
          padding: clamp(48px, 6vw, 76px) 0;
          background-color: var(--color-surface);
          border-top: 1px solid var(--color-stone);
          border-bottom: 1px solid var(--color-stone);
        }
        .fabric-header {
          text-align: center;
          margin-bottom: clamp(32px, 4vw, 44px);
          max-width: 680px;
          margin-inline: auto;
        }
        .fabric-tag-row {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .fabric-sparkle {
          color: var(--color-accent);
          font-size: 11px;
        }
        .fabric-tag {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--color-accent);
          font-weight: 600;
        }
        .fabric-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 3.8vw, 3rem);
          color: var(--color-ink);
          font-weight: 400;
          margin: 0;
          letter-spacing: -0.015em;
          line-height: 1.15;
        }
        .fabric-subtitle {
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--color-ink-muted);
          line-height: 1.6;
          margin-top: 8px;
        }
        .fabric-card-wrap {
          display: grid;
          grid-template-columns: 360px 1fr;
          background-color: #141412;
          border: 1px solid rgba(197, 168, 105, 0.35);
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 16px 48px rgba(0,0,0,0.12);
        }
        .fabric-nav-col {
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          background: #181816;
        }
        .fabric-tab-btn {
          display: flex;
          align-items: stretch;
          text-align: left;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 24px 28px;
          cursor: pointer;
          position: relative;
          transition: background 0.3s ease;
        }
        .fabric-tab-btn:hover {
          background: rgba(255, 255, 255, 0.03);
        }
        .fabric-tab-btn.is-active {
          background: rgba(197, 168, 105, 0.1);
        }
        .fabric-tab-indicator {
          width: 3px;
          background: transparent;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          transition: background 0.3s ease;
        }
        .fabric-tab-btn.is-active .fabric-tab-indicator {
          background: #C5A869;
        }
        .fabric-tab-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }
        .fabric-tab-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .fabric-tab-num {
          font-family: var(--font-display);
          font-size: 11px;
          color: #C5A869;
          letter-spacing: 0.1em;
        }
        .fabric-tab-drape {
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
        }
        .fabric-tab-title {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.02em;
          color: #FAF7F2;
          margin: 0;
          transition: color 0.3s ease;
        }
        .fabric-tab-btn.is-active .fabric-tab-title {
          color: #C5A869;
        }
        .fabric-stage-col {
          position: relative;
          min-height: 440px;
        }
        .fabric-stage {
          position: relative;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          padding: clamp(32px, 5vw, 56px);
        }
        .fabric-stage-content {
          max-width: 540px;
          color: #FAF7F2;
          z-index: 2;
        }
        .fabric-badge-pill {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          color: #C5A869;
          background: rgba(20, 20, 18, 0.7);
          border: 1px solid rgba(197, 168, 105, 0.4);
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 16px;
        }
        .fabric-stage-heading {
          font-family: var(--font-display);
          font-size: clamp(26px, 3.2vw, 38px);
          font-weight: 400;
          letter-spacing: -0.01em;
          color: #FFFFFF;
          margin: 0 0 16px 0;
        }
        .fabric-metrics-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 20px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          max-width: 440px;
        }
        .fabric-metric {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .metric-label {
          font-family: var(--font-ui);
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #C5A869;
          font-weight: 600;
        }
        .metric-val {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: #FAF7F2;
        }
        .fabric-metric-divider {
          width: 1px;
          height: 28px;
          background: rgba(255, 255, 255, 0.15);
        }
        .fabric-stage-desc {
          font-family: var(--font-body);
          font-size: 14px;
          line-height: 1.7;
          color: rgba(250, 247, 242, 0.85);
          margin-bottom: 28px;
        }
        .fabric-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #141412;
          background: #C5A869;
          padding: 12px 24px;
          border-radius: 2px;
          text-decoration: none;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .fabric-cta-btn:hover {
          background: #DFCA95;
          transform: translateY(-2px);
        }
        @media (max-width: 900px) {
          .fabric-card-wrap {
            grid-template-columns: 1fr;
          }
          .fabric-nav-col {
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }
          .fabric-tab-btn {
            padding: 16px;
            border-right: 1px solid rgba(255, 255, 255, 0.06);
          }
          .fabric-tab-btn:nth-child(2n) {
            border-right: none;
          }
          .fabric-stage {
            padding: 32px 24px;
            min-height: 400px;
          }
        }
        @media (max-width: 600px) {
          .fabric-nav-col {
            grid-template-columns: 1fr;
          }
          .fabric-tab-btn {
            border-right: none;
            padding: 12px 16px;
          }
          .fabric-stage {
            padding: 24px 16px;
            min-height: 380px;
          }
          .fabric-metrics-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            width: 100%;
          }
          .fabric-metric-divider {
            display: none;
          }
          .fabric-cta-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}} />
    </section>
  );
}
