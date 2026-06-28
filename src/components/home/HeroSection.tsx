'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <section className="hero-editorial">
      {/* Full-bleed background image */}
      <Image
        src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1400&q=80"
        alt="Zevro editorial hero — luxury fashion"
        fill
        priority
        style={{ objectFit: 'cover' }}
        className="hero-bg-image"
      />

      {/* Dark overlay gradient */}
      <div className="hero-overlay" />

      {/* Text block — bottom-left */}
      <div className="hero-text-block">
        <motion.p
          className="label-caps hero-eyebrow"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease }}
        >
          The New Collection
        </motion.p>

        <motion.h1
          className="display-serif hero-headline"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease }}
        >
          Wear to <em>Inspire</em>
        </motion.h1>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7, ease }}
        >
          <Link href="/products" className="btn-ghost hero-cta">
            Explore Collection
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator — bottom-right */}
      <motion.div
        className="hero-scroll-indicator"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.7, ease }}
      >
        <motion.div
          className="hero-scroll-line"
          initial={prefersReducedMotion ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.4, duration: 0.8, ease }}
        />
        <span className="label-caps hero-scroll-label">Scroll</span>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        .hero-editorial {
          position: relative;
          height: 100svh;
          overflow: hidden;
          background-color: var(--color-ink);
        }
        .hero-bg-image {
          z-index: 1;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(to bottom, rgba(13,13,13,0.15) 0%, rgba(13,13,13,0.55) 100%);
        }
        .hero-text-block {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 3;
          padding: var(--space-16) var(--container-gutter);
        }
        .hero-eyebrow {
          color: var(--color-white);
          margin-bottom: var(--space-4);
        }
        .hero-headline {
          font-size: var(--text-hero);
          color: var(--color-white);
          max-width: 14ch;
          margin-bottom: var(--space-8);
        }
        .hero-headline em {
          font-style: italic;
          font-weight: 300;
        }
        .hero-cta {
          border-color: var(--color-white);
          color: var(--color-white);
        }
        .hero-cta:hover {
          background: var(--color-white);
          color: var(--color-ink);
        }
        .hero-scroll-indicator {
          position: absolute;
          bottom: var(--space-8);
          right: var(--container-gutter);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
        }
        .hero-scroll-line {
          width: 1px;
          height: 40px;
          background: var(--color-white);
          transform-origin: top;
        }
        .hero-scroll-label {
          color: var(--color-white);
          font-size: 9px;
          letter-spacing: var(--tracking-wider);
        }
        @media (max-width: 768px) {
          .hero-text-block {
            padding: var(--space-8) var(--space-6);
          }
          .hero-scroll-indicator {
            display: none;
          }
        }
      `}} />
    </section>
  );
}
