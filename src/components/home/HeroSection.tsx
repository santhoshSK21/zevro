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
          src="/hero_campaign.png"
          alt="Zevro editorial hero"
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="hero-overlay" />

      <motion.div
        className="hero-content"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="display-serif hero-headline" style={{ color: '#F8F9FA', fontSize: '10vw', letterSpacing: '0.1em' }}>ZEVRO</h1>
        <Link href="/products" className="hero-cta link-underline">
          EXPLORE COLLECTION
        </Link>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        .hero-editorial {
          position: relative;
          height: 100svh;
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
          background: rgba(0, 0, 0, 0.15); /* very light overlay just for text legibility */
        }
        .hero-content {
          position: absolute;
          bottom: var(--space-24);
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-6);
        }
        .hero-headline {
          font-size: var(--text-hero);
          color: var(--color-white);
          letter-spacing: var(--tracking-wider);
          line-height: 1;
        }
        .hero-cta {
          font-family: var(--font-ui);
          font-size: var(--text-sm);
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
          color: var(--color-white);
          padding-bottom: 4px;
        }
        @media (max-width: 768px) {
          .hero-content {
            bottom: var(--space-16);
          }
        }
      `}} />
    </section>
  );
}
