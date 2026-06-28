'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function CategoryGrid() {
  const prefersReducedMotion = useReducedMotion();

  const categories = [
    {
      eyebrow: 'Explore',
      title: 'Western Wear',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
      link: '/products?category=western-wear',
    },
    {
      eyebrow: 'Discover',
      title: 'Ethnic Wear',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      link: '/products?category=ethnic-wear',
    },
    {
      eyebrow: 'Curated',
      title: 'Indo-Western',
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
      link: '/products?category=indo-western',
    },
    {
      eyebrow: 'The Edit',
      title: 'Accessories',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      link: '/products?category=accessories',
    },
  ];

  return (
    <section className="catgrid-section">
      <div className="container">
        <motion.div
          className="catgrid-header"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="label-caps">Shop by Category</p>
          <h2 className="display-serif catgrid-title">Find Your <em>Style</em></h2>
        </motion.div>
      </div>
      <div className="catgrid-grid">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            className={`catgrid-item ${i % 2 === 0 ? 'catgrid-tall' : 'catgrid-short'}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href={cat.link} className="catgrid-link">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                style={{ objectFit: 'cover' }}
                className="catgrid-img"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="catgrid-overlay" />
              <div className="catgrid-text">
                <span className="label-caps catgrid-eyebrow">{cat.eyebrow}</span>
                <h3 className="display-serif catgrid-name">{cat.title}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .catgrid-section {
          padding: var(--space-24) 0;
        }
        .catgrid-header {
          text-align: center;
          margin-bottom: var(--space-12);
        }
        .catgrid-title {
          font-size: var(--text-3xl);
          color: var(--color-ink);
          margin-top: var(--space-3);
        }
        .catgrid-title em {
          font-style: italic;
          font-weight: 300;
        }
        .catgrid-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-2);
          padding: 0 var(--space-2);
        }
        .catgrid-item {
          position: relative;
          overflow: hidden;
        }
        .catgrid-tall {
          aspect-ratio: 3/4;
        }
        .catgrid-short {
          aspect-ratio: 4/5;
        }
        .catgrid-link {
          display: block;
          position: relative;
          width: 100%;
          height: 100%;
        }
        .catgrid-img {
          transition: transform 0.9s var(--ease-out-expo);
        }
        .catgrid-item:hover .catgrid-img {
          transform: scale(1.04);
        }
        .catgrid-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(13,13,13,0.05) 0%, rgba(13,13,13,0.50) 100%);
          z-index: 2;
          transition: background 0.6s var(--ease-in-out);
        }
        .catgrid-item:hover .catgrid-overlay {
          background: linear-gradient(to bottom, rgba(13,13,13,0.10) 0%, rgba(13,13,13,0.60) 100%);
        }
        .catgrid-text {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 3;
          padding: var(--space-8);
          color: var(--color-white);
        }
        .catgrid-eyebrow {
          color: var(--color-white);
          opacity: 0.7;
          margin-bottom: var(--space-2);
          display: block;
        }
        .catgrid-name {
          font-size: var(--text-2xl);
          color: var(--color-white);
        }
        @media (max-width: 768px) {
          .catgrid-grid {
            grid-template-columns: 1fr;
          }
          .catgrid-tall,
          .catgrid-short {
            aspect-ratio: 3/4;
          }
        }
      `}} />
    </section>
  );
}
