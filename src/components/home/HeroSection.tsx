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

      <style dangerouslySetInnerHTML={{__html: `
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
          top: 50%;
          left: max(5vw, 24px);
          transform: translateY(-46%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 580px;
          color: #FAF8F5;
        }
        .hero-eyebrow {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #B49A68;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .hero-headline {
          font-family: var(--font-display);
          font-size: clamp(48px, 6.2vw, 88px);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #FAF8F5;
          margin: 0 0 16px 0;
        }
        .hero-body {
          font-family: var(--font-body);
          font-size: clamp(14px, 1.1vw, 16px);
          line-height: 1.65;
          color: rgba(245, 241, 232, 0.85);
          margin-bottom: 32px;
          max-width: 440px;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
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
          transition: all 0.35s ease;
          border: 1px solid #FAF8F5;
        }
        .hero-btn-primary:hover {
          background: transparent;
          color: #FAF8F5;
          transform: translateY(-1px);
        }
        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          background: transparent;
          color: #FAF8F5;
          padding: 14px 28px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid rgba(250, 248, 245, 0.45);
          transition: all 0.35s ease;
        }
        .hero-btn-secondary:hover {
          border-color: #FAF8F5;
          background: rgba(250, 248, 245, 0.1);
          transform: translateY(-1px);
        }
        .scroll-indicator {
          position: absolute;
          bottom: 5%;
          left: max(5vw, 24px);
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.18em;
          color: rgba(250, 248, 245, 0.7);
        }
        .scroll-line {
          width: 32px;
          height: 1px;
          background: rgba(250, 248, 245, 0.4);
        }
        @media (max-width: 768px) {
          .hero-content {
            top: auto;
            bottom: 12%;
            transform: none;
            width: calc(100% - 48px);
          }
          .hero-actions {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
          }
          .hero-btn-primary, .hero-btn-secondary {
            justify-content: center;
          }
          .scroll-indicator {
            display: none;
          }
        }
      `}} />
    </section>
  );
}
