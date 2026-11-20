'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LookbookStrip() {
  const [activeLook, setActiveLook] = useState<number | null>(null);

  const looks = [
    {
      num: 'LOOK 01',
      title: 'Obsidian Velvet Ensemble',
      tagline: 'Modern Noir Silhouettes',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=80',
      link: '/products',
    },
    {
      num: 'LOOK 02',
      title: 'Ivory Fluid Silk Column',
      tagline: 'Weightless Evening Drape',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80',
      link: '/category/western-wear',
    },
    {
      num: 'LOOK 03',
      title: 'Gilded Zari Chanderi Drapes',
      tagline: 'Heirloom Festive Grandeur',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80',
      link: '/category/ethnic-wear',
    },
    {
      num: 'LOOK 04',
      title: 'Architectural Fusion Cape',
      tagline: 'Sartorial East-West Blend',
      image: 'https://images.unsplash.com/photo-1509631179647-0c739ba73a16?w=900&q=80',
      link: '/category/indo-western',
    },
    {
      num: 'LOOK 05',
      title: 'Bespoke Evening Atelier',
      tagline: 'Quiet Confidence & Craft',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80',
      link: '/products',
    },
  ];

  return (
    <section className="lookbook-section">
      <div className="container lookbook-header-container">
        <div className="lookbook-tag-row">
          <span className="lookbook-star">✦</span>
          <span className="lookbook-eyebrow">THE RUNWAY ARCHIVES</span>
          <span className="lookbook-star">✦</span>
        </div>
        <h2 className="lookbook-heading">
          STYLING & <span className="serif-italic">Silhouettes</span>
        </h2>
        <p className="lookbook-desc">
          Hover to unfold runway perspectives from the Autumn / Winter 2026 atelier.
        </p>
      </div>

      {/* Accordion Expand Motion Strip */}
      <div className="lookbook-strip-wrap">
        {looks.map((look, i) => {
          const isExpanded = activeLook === i;
          return (
            <div
              key={look.num}
              className={`lookbook-card ${isExpanded ? 'is-expanded' : ''}`}
              onMouseEnter={() => setActiveLook(i)}
              onMouseLeave={() => setActiveLook(null)}
            >
              <Image
                src={look.image}
                alt={look.title}
                fill
                className="lookbook-image"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="lookbook-overlay" />

              {/* Look Number Pill Top */}
              <div className="lookbook-pill-top">
                <span>{look.num}</span>
              </div>

              {/* Look Info Bottom */}
              <div className="lookbook-info">
                <span className="lookbook-tagline">{look.tagline}</span>
                <h3 className="lookbook-title">{look.title}</h3>
                <Link href={look.link} className="lookbook-btn">
                  SHOP THIS LOOK →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .lookbook-section {
          background-color: #141412;
          color: #FAF7F2;
          padding: clamp(48px, 6vw, 76px) 0 0;
          overflow: hidden;
        }
        .lookbook-header-container {
          text-align: center;
          margin-bottom: clamp(28px, 4vw, 40px);
        }
        .lookbook-tag-row {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .lookbook-star {
          color: #C5A869;
          font-size: 11px;
        }
        .lookbook-eyebrow {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #C5A869;
          font-weight: 600;
        }
        .lookbook-heading {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          color: #FAF7F2;
          font-weight: 400;
          margin: 0;
          letter-spacing: -0.015em;
        }
        .lookbook-desc {
          font-family: var(--font-body);
          font-size: 14px;
          color: rgba(250, 247, 242, 0.7);
          margin-top: 8px;
        }
        .lookbook-strip-wrap {
          display: flex;
          width: 100%;
          height: clamp(420px, 50vh, 560px);
          overflow: hidden;
        }
        .lookbook-card {
          position: relative;
          flex: 1;
          height: 100%;
          overflow: hidden;
          cursor: pointer;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          transition: flex 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease;
        }
        .lookbook-card:last-child {
          border-right: none;
        }
        .lookbook-card:hover, .lookbook-card.is-expanded {
          flex: 2.2;
        }
        .lookbook-image {
          object-fit: cover;
          object-position: center 25%;
          filter: brightness(0.85) contrast(1.04);
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease;
        }
        .lookbook-card:hover .lookbook-image {
          transform: scale(1.06);
          filter: brightness(0.95) contrast(1.06);
        }
        .lookbook-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(20, 20, 18, 0.92) 0%,
            rgba(20, 20, 18, 0.3) 50%,
            rgba(20, 20, 18, 0.4) 100%
          );
          transition: opacity 0.4s ease;
        }
        .lookbook-pill-top {
          position: absolute;
          top: 20px;
          left: 20px;
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 700;
          color: #FAF7F2;
          background: rgba(20, 20, 18, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 5px 12px;
          border-radius: 20px;
          border: 1px solid rgba(197, 168, 105, 0.3);
          z-index: 2;
        }
        .lookbook-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: clamp(20px, 3vw, 32px);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 0.4s ease;
        }
        .lookbook-tagline {
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #C5A869;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .lookbook-title {
          font-family: var(--font-display);
          font-size: clamp(18px, 2vw, 26px);
          font-weight: 400;
          color: #FAF7F2;
          margin: 0 0 16px 0;
          line-height: 1.2;
          white-space: nowrap;
        }
        .lookbook-btn {
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          color: #141412;
          background: #C5A869;
          padding: 8px 18px;
          border-radius: 20px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(10px);
        }
        .lookbook-card:hover .lookbook-btn, .lookbook-card.is-expanded .lookbook-btn {
          opacity: 1;
          transform: translateY(0);
        }
        .lookbook-btn:hover {
          background: #DFCA95;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .lookbook-strip-wrap {
            flex-direction: column;
            height: auto;
          }
          .lookbook-card {
            height: 280px;
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .lookbook-card:hover {
            flex: 1;
          }
          .lookbook-btn {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </section>
  );
}
