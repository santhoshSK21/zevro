'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SubcategoryItem {
  label: string;
  href: string;
  tag?: string;
}

interface MenuData {
  title: string;
  tagline: string;
  image: string;
  featuredTitle: string;
  featuredSubtitle: string;
  featuredHref: string;
  columns: {
    heading: string;
    items: SubcategoryItem[];
  }[];
  trending: string[];
}

const MENUS: Record<string, MenuData> = {
  'NEW IN': {
    title: 'New In Season',
    tagline: 'Fresh Runway Debuts & Exclusive Drops',
    image: '/cat_western_wear.png',
    featuredTitle: 'Spring Haute Couture Debut',
    featuredSubtitle: 'Hand-tailored mulberry silks and gilded zari partywear.',
    featuredHref: '/category/new-in',
    columns: [
      {
        heading: 'LATEST RELEASES',
        items: [
          { label: 'Fresh Arrivals This Week', href: '/category/new-in', tag: 'JUST IN' },
          { label: 'Runway Silhouettes', href: '/category/new-in?sub=runway', tag: 'NEW' },
          { label: 'Editorial Signature Edits', href: '/category/new-in?sub=editorial' },
          { label: 'Limited Capsule Edition', href: '/category/new-in?sub=capsule', tag: 'LIMITED' },
          { label: 'Festive Preview', href: '/category/new-in?sub=festive' },
        ],
      },
      {
        heading: 'CURATED HIGHLIGHTS',
        items: [
          { label: 'Modern Draped Sarees', href: '/category/ethnic-wear?sub=sarees' },
          { label: 'Velvet Evening Blazers', href: '/category/western-wear?sub=blazers' },
          { label: 'Asymmetric Cape Ensembles', href: '/category/indo-western?sub=cape-suits' },
          { label: 'Artisanal Polki Jewelry', href: '/category/accessories?sub=jewellery' },
        ],
      },
    ],
    trending: ['Mulberry Silk Drapes', 'Velvet Tuxedos', 'Pre-Draped Fusion Sets', 'Kundan Chokers'],
  },
  'WESTERN WEAR': {
    title: 'Western Wear',
    tagline: 'Architectural Cuts & Fluid Tailoring',
    image: '/cat_western_wear.png',
    featuredTitle: 'Obsidian Velvet Tuxedo',
    featuredSubtitle: 'Sharp silhouettes tailored for evening galas.',
    featuredHref: '/category/western-wear',
    columns: [
      {
        heading: 'CURATED APPAREL',
        items: [
          { label: 'Dresses & Gowns', href: '/category/western-wear?sub=dresses', tag: 'POPULAR' },
          { label: 'Tops, Shirts & Tees', href: '/category/western-wear?sub=tops' },
          { label: 'Co-ord & Pant Sets', href: '/category/western-wear?sub=co-ords', tag: 'TRENDING' },
          { label: 'Tailored Jumpsuits', href: '/category/western-wear?sub=jumpsuits' },
          { label: 'Trousers & Skirts', href: '/category/western-wear?sub=trousers' },
          { label: 'Structured Blazers', href: '/category/western-wear?sub=blazers' },
        ],
      },
      {
        heading: 'BY SILHOUETTE',
        items: [
          { label: 'Architectural Pleats', href: '/category/western-wear?sub=pleats' },
          { label: 'Minimalist Monoliths', href: '/category/western-wear?sub=monolith' },
          { label: 'Silk Slip Silhouettes', href: '/category/western-wear?sub=slip' },
          { label: 'Statement Trench Coats', href: '/category/western-wear?sub=trench' },
        ],
      },
    ],
    trending: ['Mulberry Silk Gowns', 'Velvet Blazers', 'Pleated Coordinates', 'Oversized Silk Shirts'],
  },
  'ETHNIC WEAR': {
    title: 'Ethnic Wear',
    tagline: 'Generational Handloom Silks & Zari',
    image: '/cat_ethnic_wear.png',
    featuredTitle: 'Royal Banarasi Silk Lehenga',
    featuredSubtitle: 'Handwoven pure gold zari heirloom drape.',
    featuredHref: '/category/ethnic-wear',
    columns: [
      {
        heading: 'HERITAGE ENSEMBLES',
        items: [
          { label: 'Handloom Sarees', href: '/category/ethnic-wear?sub=sarees', tag: 'HEIRLOOM' },
          { label: 'Anarkali Suits', href: '/category/ethnic-wear?sub=anarkalis', tag: 'BESTSELLER' },
          { label: 'Bridal & Festive Lehengas', href: '/category/ethnic-wear?sub=lehengas' },
          { label: 'Classic Salwar Suits', href: '/category/ethnic-wear?sub=suits' },
          { label: 'Artisanal Kurtis', href: '/category/ethnic-wear?sub=kurtis' },
          { label: 'Chanderi Dupattas', href: '/category/ethnic-wear?sub=dupattas' },
        ],
      },
      {
        heading: 'TEXTILE ARCHIVE',
        items: [
          { label: 'Pure Banarasi Katan Silk', href: '/category/ethnic-wear?sub=banarasi' },
          { label: 'Chanderi Zari Weaves', href: '/category/ethnic-wear?sub=chanderi' },
          { label: 'Raw Tussar Silk Craft', href: '/category/ethnic-wear?sub=tussar' },
          { label: 'Gota Patti Embroidery', href: '/category/ethnic-wear?sub=gota' },
        ],
      },
    ],
    trending: ['Gilded Silk Sarees', 'Heavy Zari Anarkalis', 'Tissue Drapes', 'Velvet Kurtas'],
  },
  'INDO-WESTERN': {
    title: 'Indo-Western',
    tagline: 'Sartorial Innovation Where East Meets Contemporary Luxury',
    image: '/cat_indo_western.png',
    featuredTitle: 'Draped Emerald Fusion Cape',
    featuredSubtitle: 'Modern fluidity with hand-embroidered borders.',
    featuredHref: '/category/indo-western',
    columns: [
      {
        heading: 'FUSION SILHOUETTES',
        items: [
          { label: 'Draped Cape Sets', href: '/category/indo-western?sub=cape-suits', tag: 'HOT' },
          { label: 'Fusion Drape Sarees', href: '/category/indo-western?sub=fusion-sets' },
          { label: 'Indo-Western Gowns', href: '/category/indo-western?sub=indo-gowns', tag: 'GALA' },
          { label: 'Dhoti & Peplum Sets', href: '/category/indo-western?sub=dhoti-sets' },
          { label: 'Corset & Cowl Ensembles', href: '/category/indo-western?sub=corsets' },
        ],
      },
      {
        heading: 'OCCASION CURATION',
        items: [
          { label: 'Cocktail & Sangeet Nights', href: '/category/indo-western?sub=cocktail' },
          { label: 'Modern Destination Wear', href: '/category/indo-western?sub=resort' },
          { label: 'Contemporary Reception', href: '/category/indo-western?sub=reception' },
        ],
      },
    ],
    trending: ['Asymmetric Capes', 'Satin Fusion Sarees', 'Structured Bustiers', 'Pre-Draped Silks'],
  },
  'ACCESSORIES': {
    title: 'Fine Accessories',
    tagline: 'Hand-Crafted Jewellery, Silk Stoles & Bags',
    image: '/cat_accessories.png',
    featuredTitle: 'Heritage Polki & Emerald Choker',
    featuredSubtitle: 'Gold-plated artisanal uncut stone necklace.',
    featuredHref: '/category/accessories',
    columns: [
      {
        heading: 'FINE ACCENTS',
        items: [
          { label: 'Artisanal Jewellery', href: '/category/accessories?sub=jewellery', tag: 'GOLD' },
          { label: 'Bespoke Bags & Clutches', href: '/category/accessories?sub=bags' },
          { label: 'Handcrafted Footwear', href: '/category/accessories?sub=footwear' },
          { label: 'Belts & Cinchers', href: '/category/accessories?sub=belts' },
          { label: 'Pure Silk Stoles', href: '/category/accessories?sub=scarves' },
        ],
      },
      {
        heading: 'JEWELLERY ATELIER',
        items: [
          { label: 'Kundan & Pearl Chokers', href: '/category/accessories?sub=kundan' },
          { label: 'Temple Filigree Earrings', href: '/category/accessories?sub=filigree' },
          { label: 'Sculpted Brass Cuffs', href: '/category/accessories?sub=cuffs' },
        ],
      },
    ],
    trending: ['Uncut Polki Chokers', 'Zari Embroidered Potlis', 'Kolhapuri Mules', 'Silk Stoles'],
  },
};

export default function MegaMenu({ category, close }: { category: string; close: () => void }) {
  const data = MENUS[category];

  if (!data) return null;

  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');

  return (
    <div 
      className="cat-flyout-card" 
      onMouseEnter={(e) => e.stopPropagation()} 
      onMouseLeave={close}
    >
      {/* Compact Header */}
      <div className="cat-flyout-header">
        <div className="cat-flyout-title-wrap">
          <span className="cat-flyout-sparkle">✦</span>
          <span className="cat-flyout-title">{data.title}</span>
        </div>
        <Link
          href={`/category/${categorySlug}`}
          onClick={close}
          className="cat-flyout-all-link"
        >
          ALL
        </Link>
      </div>

      {/* Single Column Subcategories List */}
      <div className="cat-flyout-body">
        {data.columns.map((col, idx) => (
          <div key={idx} className="cat-flyout-group">
            {col.heading && (
              <div className="cat-flyout-group-heading">{col.heading}</div>
            )}
            <ul className="cat-flyout-list">
              {col.items.map((item) => (
                <li key={item.label} className="cat-flyout-item">
                  <Link
                    href={item.href}
                    onClick={close}
                    className="cat-flyout-link"
                  >
                    <span className="cat-flyout-bullet" />
                    <span className="cat-flyout-label">{item.label}</span>
                    {item.tag && (
                      <span className="cat-flyout-tag">{item.tag}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Action Strip */}
      <div className="cat-flyout-footer">
        <Link
          href={`/category/${categorySlug}`}
          onClick={close}
          className="cat-flyout-explore-btn"
        >
          <span>Explore Entire Collection</span>
          <ArrowRight size={11} className="cat-flyout-arrow" />
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .cat-flyout-card {
          width: 250px;
          background-color: var(--color-surface, #FAF7F2);
          border: 1px solid var(--color-stone, #DFD8CC);
          border-top: 2px solid var(--color-accent, #C5A869);
          border-radius: var(--radius-md, 8px);
          box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.16), 0 0 0 1px color-mix(in srgb, var(--color-accent, #C5A869) 22%, transparent);
          padding: 8px 0 6px;
          animation: flyoutSlide 0.16s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          user-select: none;
        }

        .cat-flyout-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 14px 8px;
          margin-bottom: 4px;
          border-bottom: 1px solid var(--color-stone, #DFD8CC);
        }

        .cat-flyout-title-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cat-flyout-sparkle {
          color: var(--color-accent, #C5A869);
          font-size: 10px;
        }

        .cat-flyout-title {
          font-family: var(--font-display, serif);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-ink, #141412);
          letter-spacing: 0.02em;
        }

        .cat-flyout-all-link {
          font-family: var(--font-ui, sans-serif);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-accent, #C5A869);
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .cat-flyout-all-link:hover {
          color: var(--color-ink, #141412);
        }

        .cat-flyout-body {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 380px;
          overflow-y: auto;
          scrollbar-width: thin;
        }

        .cat-flyout-group {
          display: flex;
          flex-direction: column;
        }

        .cat-flyout-group-heading {
          font-family: var(--font-ui, sans-serif);
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-accent, #C5A869);
          padding: 4px 14px 2px;
          opacity: 0.9;
        }

        .cat-flyout-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
        }

        .cat-flyout-item {
          margin: 0;
        }

        .cat-flyout-link {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 14px;
          text-decoration: none;
          color: var(--color-ink, #141412);
          font-family: var(--font-body, sans-serif);
          font-size: 12px;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .cat-flyout-bullet {
          width: 3.5px;
          height: 3.5px;
          border-radius: 50%;
          background: var(--color-accent, #C5A869);
          opacity: 0.4;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .cat-flyout-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cat-flyout-link:hover {
          background: color-mix(in srgb, var(--color-accent, #C5A869) 14%, transparent);
          color: var(--color-accent, #C5A869);
          padding-left: 17px;
        }

        .cat-flyout-link:hover .cat-flyout-bullet {
          opacity: 1;
          transform: scale(1.4);
          background: var(--color-accent, #C5A869);
        }

        .cat-flyout-tag {
          font-family: var(--font-ui, sans-serif);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 1px 5px;
          border-radius: 4px;
          background: color-mix(in srgb, var(--color-accent, #C5A869) 18%, transparent);
          color: var(--color-accent, #C5A869);
          border: 1px solid color-mix(in srgb, var(--color-accent, #C5A869) 35%, transparent);
          flex-shrink: 0;
        }

        .cat-flyout-footer {
          margin-top: 6px;
          padding: 6px 14px 2px;
          border-top: 1px solid var(--color-stone, #DFD8CC);
        }

        .cat-flyout-explore-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 8px;
          border-radius: 4px;
          background: color-mix(in srgb, var(--color-accent, #C5A869) 10%, transparent);
          font-family: var(--font-ui, sans-serif);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-accent, #C5A869);
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .cat-flyout-explore-btn:hover {
          background: var(--color-accent, #C5A869);
          color: var(--color-dark, #141412);
        }

        .cat-flyout-arrow {
          transition: transform 0.2s ease;
        }

        .cat-flyout-explore-btn:hover .cat-flyout-arrow {
          transform: translateX(3px);
        }

        @keyframes flyoutSlide {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  );
}
