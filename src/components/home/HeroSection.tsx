'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="hero-editorial">
      {/* Background Image with warm grading */}
      <div className="hero-bg-wrap">
        <Image
          src="/hero.png"
          alt="Zevro Autumn / Winter Collection"
          fill
          priority
          loading="eager"
          className="hero-img"
          sizes="100vw"
        />
      </div>

      {/* Cinematic subtle warm vignette overlay */}
      <div className="hero-overlay" />

      {/* Editorial Content */}
      <motion.div
        className="hero-content"
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.18 } }
        }}
      >
        <motion.p
          className="hero-eyebrow"
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          AUTUMN / WINTER 2026
        </motion.p>

        <motion.h1
          className="hero-headline"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          Wear<br />Your Story
        </motion.h1>

        <motion.p
          className="hero-body"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          Modern silhouettes. Timeless traditions.<br />
          Crafted with quiet elegance.
        </motion.p>

        <motion.div
          className="hero-actions"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          <Link href="/products" className="hero-btn-primary">
            DISCOVER COLLECTION
          </Link>
          <Link href="/category/ethnic-wear" className="hero-btn-secondary">
            EXPLORE EDITORIAL
          </Link>
        </motion.div>
      </motion.div>

      {/* Minimal Scroll Indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
      >
        <div className="scroll-line"></div>
        <span>SCROLL</span>
      </motion.div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hero-editorial {
          position: relative;
          height: 100svh;
          min-height: 700px;
          width: 100%;
          background-color: #1B1B19;
          overflow: hidden;
        }
        .hero-bg-wrap {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .hero-img {
          object-fit: cover;
          object-position: 72% center;
          filter: contrast(1.03) brightness(0.96);
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(
            to right,
            rgba(27, 27, 25, 0.45) 0%,
            rgba(27, 27, 25, 0.15) 50%,
            rgba(27, 27, 25, 0.05) 100%
          );
        }
        .hero-content {
          position: absolute;
          position: relative;
          z-index: 3;
          padding: 0 var(--container-gutter);
          max-width: 680px;
          margin-top: 40px;
        }
        .hero-eyebrow {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #D4AF37;
          margin-bottom: var(--space-4);
          font-weight: 600;
        }
        .hero-headline {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5.5vw, 4.5rem);
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: #FAF8F5;
          margin-bottom: var(--space-6);
          font-weight: 400;
          text-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
        }
        .hero-body {
          font-family: var(--font-body);
          font-size: clamp(0.9rem, 1.3vw, 1.05rem);
          line-height: 1.6;
          color: rgba(250, 248, 245, 0.88);
          margin-bottom: var(--space-8);
          max-width: 440px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          background: #FAF8F5;
          color: #1C1C1A;
          padding: 14px 28px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid #FAF8F5;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .hero-btn-primary:hover {
          background: #D4AF37;
          border-color: #D4AF37;
          color: #1C1C1A;
          transform: translateY(-2px);
        }
        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          background: rgba(26, 24, 22, 0.4);
          color: #FAF8F5;
          padding: 14px 28px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid rgba(250, 248, 245, 0.45);
          backdrop-filter: blur(8px);
          transition: all 0.35s ease;
        }
        .hero-btn-secondary:hover {
          border-color: #FAF8F5;
          background: rgba(250, 248, 245, 0.15);
          transform: translateY(-2px);
        }

        /* Jumping Centered Scroll Indicator */
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
          letter-spacing: 0.22em;
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
          .hero-content {
            margin-top: 0;
            padding-bottom: 80px;
            max-width: 100%;
          }
          .hero-actions {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
          }
          .hero-btn-primary, .hero-btn-secondary {
            justify-content: center;
            text-align: center;
          }
          .scroll-indicator-center {
            bottom: 16px;
          }
          .scroll-text {
            font-size: 8px;
          }
        }
      `}} />
    </section>
  );
}
