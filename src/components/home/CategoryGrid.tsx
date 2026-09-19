'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function CategoryGrid() {
  const prefersReducedMotion = useReducedMotion();

  const categories = [
    {
      eyebrow: 'Contemporary Silhouettes',
      title: 'Western Wear',
      subtitle: 'Explore Collection',
      image: '/cat_western_wear.png',
      link: '/category/western-wear',
    },
    {
      eyebrow: 'Heritage & Craft',
      title: 'Ethnic Wear',
      subtitle: 'Explore Collection',
      image: '/cat_ethnic_wear.png',
      link: '/category/ethnic-wear',
    },
    {
      eyebrow: 'The Fusion Edit',
      title: 'Indo-Western',
      subtitle: 'Explore Collection',
      image: '/cat_indo_western.png',
      link: '/category/indo-western',
    },
    {
      eyebrow: 'Artisanal Accents',
      title: 'Accessories',
      subtitle: 'Explore Collection',
      image: '/cat_accessories.png',
      link: '/category/accessories',
    },
  ];

  return (
    <section className="catgrid-section">
      <div className="container">
        <motion.div
          className="catgrid-header"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="catgrid-tag">CURATED DEPARTMENTS</span>
          <h2 className="catgrid-title">DISCOVER THE COLLECTIONS</h2>
        </motion.div>
      </div>

      <div className="catgrid-grid-wrap">
        <div className="catgrid-grid">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              className="catgrid-item"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={cat.link} className="catgrid-link">
                <div className="catgrid-img-wrap">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="catgrid-img"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="catgrid-overlay" />
                </div>
                
                <div className="catgrid-info">
                  <span className="catgrid-eyebrow">{cat.eyebrow}</span>
                  <h3 className="catgrid-name">{cat.title}</h3>
                  <span className="catgrid-cta">{cat.subtitle} →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .catgrid-section {
          padding: var(--space-20) 0;
          background-color: var(--color-bg);
        }
        .catgrid-header {
          text-align: center;
          margin-bottom: var(--space-12);
        }
        .catgrid-tag {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-accent);
          font-weight: 600;
          display: block;
          margin-bottom: 8px;
        }
        .catgrid-title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 3.2vw, 2.6rem);
          color: var(--color-ink);
          font-weight: 400;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .catgrid-grid-wrap {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 var(--container-gutter);
        }
        .catgrid-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .catgrid-item {
          position: relative;
          background-color: var(--color-surface);
          overflow: hidden;
        }
        .catgrid-link {
          display: block;
          position: relative;
          text-decoration: none;
        }
        .catgrid-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4/5;
          overflow: hidden;
        }
        .catgrid-img {
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .catgrid-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(28, 28, 26, 0.55) 0%, rgba(28, 28, 26, 0.1) 40%, transparent 100%);
          opacity: 0.75;
          transition: opacity 0.5s ease;
        }
        .catgrid-item:hover .catgrid-img {
          transform: scale(1.04);
        }
        .catgrid-item:hover .catgrid-overlay {
          opacity: 0.9;
        }
        .catgrid-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 32px 28px;
          color: #FAF8F5;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .catgrid-item:hover .catgrid-info {
          transform: translateY(-4px);
        }
        .catgrid-eyebrow {
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #DDD6C8;
          margin-bottom: 4px;
        }
        .catgrid-name {
          font-family: var(--font-display);
          font-size: clamp(22px, 2vw, 30px);
          font-weight: 400;
          letter-spacing: 0.02em;
          color: #FAF8F5;
          margin: 0 0 10px 0;
        }
        .catgrid-cta {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-accent);
          font-weight: 600;
          transition: transform 0.3s ease;
        }
        @media (max-width: 768px) {
          .catgrid-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .catgrid-img-wrap {
            aspect-ratio: 4/5;
          }
          .catgrid-info {
            padding: 24px 20px;
          }
        }
      `}} />
    </section>
  );
}
