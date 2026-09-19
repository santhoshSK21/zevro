'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="hero-editorial">
      <div className="hero-bg-wrap">
        <Image
          src="/hero.png"
          alt="Zevro editorial hero"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: '70% center' }}
        />
      </div>

      <div className="hero-overlay" />

      <motion.div
        className="hero-content"
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } }
        }}
      >
        <motion.p
          className="hero-eyebrow"
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
          }}
        >
          TIMELESS ELEGANCE
        </motion.p>

        <motion.h1
          className="display-serif hero-headline"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
          }}
        >
          Wear<br />Your Story
        </motion.h1>

        <motion.p
          className="hero-body"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
          }}
        >
          Modern silhouettes. Timeless traditions.<br />
          Crafted for the woman who does it all.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
          }}
        >
          <Link href="/products" className="hero-btn">
            EXPLORE COLLECTION <span className="arrow">→</span>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="scroll-line"></div>
        SCROLL DOWN
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        .hero-editorial {
          position: relative;
          height: 100svh;
          min-height: 680px;
          width: 100%;
          background-color: var(--color-bg);
          overflow: hidden;
        }
        .hero-bg-wrap {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: rgba(0, 0, 0, 0.03);
        }
        .hero-content {
          position: absolute;
          top: 50%;
          left: 7%;
          transform: translateY(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-6);
          color: var(--color-ink);
        }
        .hero-eyebrow {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: -4px;
        }
        .hero-headline {
          font-size: clamp(56px, 6.5vw, 96px);
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--color-ink);
        }
        .hero-body {
          font-family: var(--font-body);
          font-size: clamp(14px, 1.2vw, 16px);
          line-height: 1.6;
          color: rgba(30, 30, 30, 0.8);
          margin-bottom: var(--space-4);
        }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: var(--color-ink);
          color: var(--color-white);
          padding: 14px 28px;
          border-radius: 2px;
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.3s ease;
        }
        .hero-btn:hover {
          background: #333;
        }
        .hero-btn .arrow {
          transition: transform 0.3s ease;
        }
        .hero-btn:hover .arrow {
          transform: translateX(4px);
        }
        .scroll-indicator {
          position: absolute;
          bottom: 6%;
          left: 4%;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.15em;
          color: var(--color-ink);
        }
        .scroll-line {
          width: 1px;
          height: 40px;
          background: var(--color-ink);
          opacity: 0.4;
        }
        @media (max-width: 1024px) {
          .hero-content {
            left: 6%;
            top: 55%;
          }
        }
        @media (max-width: 768px) {
          .hero-content {
            top: auto;
            bottom: 12%;
            left: 5%;
            transform: none;
            width: 90%;
            gap: 16px;
          }
          .hero-btn {
            padding: 12px 24px;
          }
          .scroll-indicator {
            display: none;
          }
        }
      `}} />
    </section>
  );
}
