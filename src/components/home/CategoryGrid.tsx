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
      image: '/cat_western_wear.png',
      link: '/products?category=western-wear',
    },
    {
      eyebrow: 'Discover',
      title: 'Ethnic Wear',
      image: '/cat_ethnic_wear.png',
      link: '/products?category=ethnic-wear',
    },
    {
      eyebrow: 'Curated',
      title: 'Indo-Western',
      image: '/cat_indo_western.png',
      link: '/products?category=indo-western',
    },
    {
      eyebrow: 'The Edit',
      title: 'Accessories',
      image: '/cat_accessories.png',
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
          <h2 className="display-serif catgrid-title">CURATED FOR EVERY YOU</h2>
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
              <div className="catgrid-img-wrap">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="catgrid-img"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="catgrid-text">
                <h3 className="catgrid-name">{cat.title}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .catgrid-section {
          padding: var(--space-16) 0;
        }
        .catgrid-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }
        .catgrid-title {
          font-size: var(--text-2xl);
          color: var(--color-ink);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
        }
        .catgrid-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background-color: var(--color-stone);
          border-top: 1px solid var(--color-stone);
          border-bottom: 1px solid var(--color-stone);
        }
        .catgrid-item {
          background-color: var(--color-bg);
          position: relative;
        }
        .catgrid-img-wrap {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .catgrid-tall .catgrid-img-wrap {
          aspect-ratio: 3/4;
        }
        .catgrid-short .catgrid-img-wrap {
          aspect-ratio: 4/5;
        }
        .catgrid-link {
          display: flex;
          flex-direction: column;
          text-decoration: none;
        }
        .catgrid-img {
          transition: opacity 0.4s ease-out;
        }
        .catgrid-item:hover .catgrid-img {
          opacity: 0.9;
        }
        .catgrid-text {
          padding: var(--space-4) var(--space-4) var(--space-8) var(--space-4);
          text-align: center;
        }
        .catgrid-name {
          font-family: var(--font-body);
          font-size: var(--text-xs);
          color: var(--color-ink);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
        }
        @media (max-width: 768px) {
          .catgrid-grid {
            grid-template-columns: 1fr;
          }
          .catgrid-tall .catgrid-img-wrap,
          .catgrid-short .catgrid-img-wrap {
            aspect-ratio: 3/4;
          }
        }
      `}} />
    </section>
  );
}
