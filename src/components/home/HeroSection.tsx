'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  buttonLink?: string;
  badgeText?: string;
  imageUrl?: string;
}

export default function HeroSection({
  headline,
  subheadline = 'Modern silhouettes. Timeless traditions.\nCrafted with quiet elegance.',
  buttonText = 'DISCOVER COLLECTION',
  buttonLink = '/products',
  badgeText = 'AUTUMN / WINTER 2026 EDITORIAL',
  imageUrl,
}: HeroSectionProps = {}) {
  const prefersReducedMotion = useReducedMotion();

  // Safely resolve image: if missing or dummy path, use default /hero.png
  const resolvedImage = imageUrl && !imageUrl.includes('hero-desktop.jpg') ? imageUrl : '/hero.png';

  // Parse headline into two lines if space-delimited
  let headlineTop = 'WEAR';
  let headlineAccent = 'Your Story';
  if (headline) {
    const parts = headline.trim().split(' ');
    if (parts.length > 2) {
      headlineTop = parts.slice(0, Math.ceil(parts.length / 2)).join(' ');
      headlineAccent = parts.slice(Math.ceil(parts.length / 2)).join(' ');
    } else if (parts.length === 2) {
      headlineTop = parts[0];
      headlineAccent = parts[1];
    } else {
      headlineTop = headline;
      headlineAccent = '';
    }
  }

  return (
    <section className="hero-editorial">
      {/* Background Image with warm grading */}
      <div className="hero-bg-wrap">
        <Image
          src={resolvedImage}
          alt={headline || "Zevro Autumn / Winter Collection"}
          fill
          priority
          loading="eager"
          className="hero-img"
          sizes="100vw"
        />
      </div>

      {/* Cinematic subtle warm vignette overlay */}
      <div className="hero-overlay" />

      {/* Centered Editorial Content */}
      <div className="hero-center-container">
        <motion.div
          className="hero-content"
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.16 } }
          }}
        >
          {/* Creative Frosted Eyebrow Badge */}
          <motion.div
            className="hero-badge-wrap"
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
          >
            <div className="hero-pill-badge">
              <span className="badge-sparkle">✦</span>
              <span>{badgeText}</span>
              <span className="badge-sparkle">✦</span>
            </div>
          </motion.div>

          {/* Master Creative Display Title */}
          <motion.h1
            className="hero-headline"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
            }}
          >
            <span className="headline-top">{headlineTop}</span>
            {headlineAccent && <span className="headline-accent">{headlineAccent}</span>}
          </motion.h1>

          {/* Divider Line */}
          <motion.div
            className="hero-gold-divider"
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: { opacity: 1, scaleX: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
          />

          {/* Centered Editorial Subtitle */}
          <motion.p
            className="hero-body"
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
          >
            {subheadline}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="hero-actions"
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
          >
            <Link href={buttonLink} className="hero-btn-primary">
              <span>{buttonText}</span>
              <span className="btn-arrow">→</span>
            </Link>
            <Link href="/category/new-in" className="hero-btn-secondary">
              <span>NEW IN DROP</span>
            </Link>
          </motion.div>

          {/* Quick Category Discovery Chips directly in Hero */}
          <motion.div
            className="hero-quick-chips hide-mobile"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] } }
            }}
          >
            <span className="chips-label">DEPARTMENTS:</span>
            <div className="chips-list">
              <Link href="/category/western-wear" className="hero-chip">Western Wear</Link>
              <Link href="/category/ethnic-wear" className="hero-chip">Ethnic Wear</Link>
              <Link href="/category/indo-western" className="hero-chip">Indo-Western</Link>
              <Link href="/category/accessories" className="hero-chip">Accessories</Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hero-editorial {
          position: relative;
          height: clamp(480px, 60vh, 580px);
          min-height: 440px;
          width: 100%;
          background-color: #121210;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-bg-wrap {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .hero-img {
          object-fit: cover;
          object-position: center 40%;
          filter: contrast(1.04) brightness(0.88);
          transition: transform 1.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-editorial:hover .hero-img {
          transform: scale(1.025);
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: radial-gradient(
            circle at center,
            rgba(18, 18, 16, 0.35) 0%,
            rgba(18, 18, 16, 0.65) 60%,
            rgba(18, 18, 16, 0.92) 100%
          );
        }
        .hero-center-container {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 960px;
          padding: 0 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          margin-top: -20px;
        }
        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
        }
        .hero-badge-wrap {
          margin-bottom: 24px;
        }
        .hero-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 7px 20px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.4);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 12px rgba(212, 175, 55, 0.1);
          color: #FAF8F5;
          font-family: var(--font-ui, sans-serif);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .badge-sparkle {
          color: #D4AF37;
          font-size: 11px;
        }
        .hero-headline {
          margin: 0 0 16px 0;
          line-height: 1.05;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .headline-top {
          font-family: var(--font-display, serif);
          font-size: clamp(2.4rem, 5.5vw, 4.4rem);
          font-weight: 400;
          letter-spacing: 0.22em;
          color: #FAF8F5;
          text-transform: uppercase;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        }
        .headline-accent {
          font-family: var(--font-display, serif);
          font-size: clamp(3.4rem, 8.5vw, 6.6rem);
          font-weight: 400;
          font-style: italic;
          letter-spacing: 0.02em;
          margin-top: -6px;
          background: linear-gradient(135deg, #FFFFFF 15%, #F0D999 50%, #C5A880 85%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 6px 24px rgba(0, 0, 0, 0.5));
        }
        .hero-gold-divider {
          width: 80px;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
          margin: 12px 0 20px 0;
        }
        .hero-body {
          font-family: var(--font-body, sans-serif);
          font-size: clamp(0.95rem, 1.4vw, 1.15rem);
          line-height: 1.6;
          color: rgba(250, 248, 245, 0.9);
          margin: 0 0 36px 0;
          max-width: 600px;
          letter-spacing: 0.04em;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
        }
        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #FAF8F5;
          color: #121210;
          padding: 16px 36px;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid #FAF8F5;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          border-radius: 2px;
        }
        .hero-btn-primary:hover {
          background: #D4AF37;
          border-color: #D4AF37;
          color: #121210;
          transform: translateY(-3px);
          box-shadow: 0 14px 40px rgba(212, 175, 55, 0.35);
        }
        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.06);
          color: #FAF8F5;
          padding: 16px 36px;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid rgba(250, 248, 245, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: all 0.35s ease;
          border-radius: 2px;
        }
        .hero-btn-secondary:hover {
          border-color: #FAF8F5;
          background: rgba(250, 248, 245, 0.18);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .hero-quick-chips {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
        }

        .chips-label {
          font-family: var(--font-ui);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: rgba(250, 248, 245, 0.6);
        }

        .chips-list {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .hero-chip {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-full);
          padding: 5px 14px;
          font-size: 11px;
          font-weight: 600;
          color: #FAF8F5;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .hero-chip:hover {
          background: #FFFFFF;
          color: #121210;
          transform: translateY(-1px);
        }

        /* Centered Jumping Scroll Indicator */
        .scroll-indicator-center {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          animation: heroJump 2.4s ease-in-out infinite;
          user-select: none;
        }
        .scroll-pill {
          width: 20px;
          height: 32px;
          border-radius: 12px;
          border: 1.5px solid rgba(250, 248, 245, 0.75);
          background: rgba(20, 18, 16, 0.35);
          backdrop-filter: blur(6px);
          padding-top: 5px;
          display: flex;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }
        .scroll-dot {
          width: 3px;
          height: 7px;
          border-radius: 2px;
          background: #D4AF37;
          animation: scrollDot 1.8s ease-in-out infinite;
        }
        .scroll-text {
          font-family: var(--font-ui);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #FAF8F5;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
        }
        @keyframes heroJump {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 1; }
          60% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }

        @media (max-width: 768px) {
          .hero-editorial {
            min-height: 560px;
            height: 100svh;
          }
          .hero-center-container {
            padding: 0 16px;
            margin-top: -10px;
          }
          .hero-pill-badge {
            padding: 6px 14px;
            font-size: 9px;
            letter-spacing: 0.2em;
          }
          .headline-top {
            font-size: clamp(1.8rem, 6vw, 2.4rem);
            letter-spacing: 0.16em;
          }
          .headline-accent {
            font-size: clamp(2.6rem, 9vw, 3.8rem);
          }
          .hero-body {
            font-size: 0.88rem;
            margin-bottom: 24px;
            line-height: 1.5;
            padding: 0 8px;
          }
          .hero-actions {
            flex-direction: column;
            width: 100%;
            max-width: 340px;
            gap: 10px;
          }
          .hero-btn-primary, .hero-btn-secondary {
            width: 100%;
            padding: 13px 20px;
            font-size: 10px;
          }
          .scroll-indicator-center {
            bottom: 12px;
          }
        }
      `}} />
    </section>
  );
}

