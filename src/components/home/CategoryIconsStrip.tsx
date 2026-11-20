'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

const CATEGORIES = [
  {
    title: 'Western Wear',
    sub: 'Couture Silhouettes',
    tag: 'Up to 30% Off',
    img: '/cat_western_wear.png',
    href: '/category/western-wear',
    badgeClass: 'tag-sale',
  },
  {
    title: 'Ethnic Wear',
    sub: 'Heritage Handloom',
    tag: 'Zari Silks',
    img: '/cat_ethnic_wear.png',
    href: '/category/ethnic-wear',
    badgeClass: 'tag-craft',
  },
  {
    title: 'Indo-Western',
    sub: 'The Fusion Edit',
    tag: 'Cape Sets',
    img: '/cat_indo_western.png',
    href: '/category/indo-western',
    badgeClass: 'tag-new',
  },
  {
    title: 'Accessories',
    sub: 'Fine Jewels & Bags',
    tag: 'Polki & Pearls',
    img: '/cat_accessories.png',
    href: '/category/accessories',
    badgeClass: 'tag-craft',
  },
  {
    title: 'New In Drop',
    sub: 'AW 2026 Runways',
    tag: '✦ Just In',
    img: '/pdp_hero_1.png',
    href: '/category/new-in',
    badgeClass: 'tag-highlight',
  },
  {
    title: 'Private Vault',
    sub: 'Limited Archive',
    tag: 'Special Deals',
    img: '/pdp_hero_2.png',
    href: '/products',
    badgeClass: 'tag-sale',
  },
];

export default function CategoryIconsStrip() {
  return (
    <section className="cat-strip-wrapper" aria-label="Quick category discovery">
      <div className="container">
        <div className="cat-strip-scroll">
          {CATEGORIES.map((cat, idx) => (
            <Link key={cat.title} href={cat.href} className="cat-bubble-card">
              <div className="cat-bubble-ring">
                <div className="cat-bubble-avatar">
                  <Image
                    src={cat.img}
                    alt={cat.title}
                    fill
                    className="cat-bubble-img"
                    sizes="84px"
                    loading={idx < 4 ? 'eager' : 'lazy'}
                  />
                  <div className="cat-bubble-overlay" />
                </div>
                <span className={`cat-bubble-badge ${cat.badgeClass}`}>
                  {cat.tag}
                </span>
              </div>
              <div className="cat-bubble-info">
                <span className="cat-bubble-title">{cat.title}</span>
                <span className="cat-bubble-sub">{cat.sub}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .cat-strip-wrapper {
          background-color: var(--color-surface, #FAF7F2);
          border-bottom: 1px solid var(--color-stone, #DFD8CC);
          padding: 14px 0 16px;
          position: relative;
          z-index: 20;
        }

        .cat-strip-scroll {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 4px 0;
        }

        .cat-strip-scroll::-webkit-scrollbar {
          display: none;
        }

        .cat-bubble-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          text-decoration: none;
          min-width: 110px;
          flex: 1;
          cursor: pointer;
          transition: transform 0.25s ease;
        }

        .cat-bubble-card:hover {
          transform: translateY(-3px);
        }

        .cat-bubble-ring {
          position: relative;
          width: 76px;
          height: 76px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, var(--color-accent, #C5A869) 0%, rgba(197, 168, 105, 0.2) 50%, var(--color-accent, #C5A869) 100%);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .cat-bubble-card:hover .cat-bubble-ring {
          box-shadow: 0 8px 20px rgba(197, 168, 105, 0.35);
          transform: scale(1.05);
        }

        .cat-bubble-avatar {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background: var(--color-bg, #FAF7F2);
        }

        .cat-bubble-img {
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .cat-bubble-card:hover .cat-bubble-img {
          transform: scale(1.12);
        }

        .cat-bubble-overlay {
          position: absolute;
          inset: 0;
          background: rgba(20, 20, 18, 0.12);
          transition: background 0.3s ease;
        }

        .cat-bubble-card:hover .cat-bubble-overlay {
          background: rgba(20, 20, 18, 0);
        }

        .cat-bubble-badge {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          font-family: var(--font-ui);
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          white-space: nowrap;
          padding: 2px 7px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        }

        .tag-sale {
          background: #B91C1C;
          color: #FFFFFF;
        }

        .tag-craft {
          background: var(--color-dark, #141412);
          color: var(--color-accent, #C5A869);
          border: 1px solid var(--color-accent, #C5A869);
        }

        .tag-new {
          background: #15803D;
          color: #FFFFFF;
        }

        .tag-highlight {
          background: var(--color-accent, #C5A869);
          color: var(--color-dark, #141412);
        }

        .cat-bubble-info {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cat-bubble-title {
          font-family: var(--font-ui);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--color-ink, #141412);
          transition: color 0.2s ease;
        }

        .cat-bubble-card:hover .cat-bubble-title {
          color: var(--color-accent, #C5A869);
        }

        .cat-bubble-sub {
          font-family: var(--font-body);
          font-size: 10.5px;
          color: var(--color-ink-muted, #6E6A62);
          margin-top: 1px;
        }

        @media (max-width: 860px) {
          .cat-strip-scroll {
            justify-content: flex-start;
            gap: 14px;
          }
          .cat-bubble-card {
            min-width: 90px;
            flex-shrink: 0;
          }
          .cat-bubble-ring {
            width: 66px;
            height: 66px;
          }
        }
      `}} />
    </section>
  );
}

