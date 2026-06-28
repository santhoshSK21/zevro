'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const MENUS: Record<string, any> = {
  'WESTERN WEAR': {
    col1: {
      title: 'CLOTHING',
      links: [
        { label: 'Tops & Tees', href: '/category/western-wear?sub=tops' },
        { label: 'Dresses', href: '/category/western-wear?sub=dresses' },
        { label: 'Co-ord Sets', href: '/category/western-wear?sub=co-ords' },
        { label: 'Jumpsuits', href: '/category/western-wear?sub=jumpsuits' },
        { label: 'Trousers', href: '/category/western-wear?sub=trousers' },
        { label: 'Blazers', href: '/category/western-wear?sub=blazers' },
      ]
    },
    col2: {
      title: 'TRENDING',
      links: [
        { label: 'New Arrivals', href: '/category/western-wear?offers=new' },
        { label: 'Bestsellers', href: '/category/western-wear?offers=bestseller' },
        { label: 'Under ₹999', href: '/category/western-wear?maxPrice=999' },
        { label: 'Under ₹1,999', href: '/category/western-wear?maxPrice=1999' },
        { label: 'Sale', href: '/category/western-wear?offers=discount' },
      ]
    },
    featured: {
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
      title: 'THE WESTERN EDIT',
      caption: 'New Season Essentials',
      href: '/category/western-wear'
    }
  },
  'ETHNIC WEAR': {
    col1: {
      title: 'CLOTHING',
      links: [
        { label: 'Sarees', href: '/category/ethnic-wear?sub=sarees' },
        { label: 'Salwar Suits', href: '/category/ethnic-wear?sub=suits' },
        { label: 'Anarkalis', href: '/category/ethnic-wear?sub=anarkalis' },
        { label: 'Lehengas', href: '/category/ethnic-wear?sub=lehengas' },
        { label: 'Kurtis', href: '/category/ethnic-wear?sub=kurtis' },
        { label: 'Dupattas', href: '/category/ethnic-wear?sub=dupattas' },
      ]
    },
    col2: {
      title: 'OCCASION',
      links: [
        { label: 'Festive', href: '/category/ethnic-wear?occasion=festive' },
        { label: 'Wedding', href: '/category/ethnic-wear?occasion=wedding' },
        { label: 'Casual', href: '/category/ethnic-wear?occasion=casual' },
        { label: 'Office Wear', href: '/category/ethnic-wear?occasion=office' },
        { label: 'Party Wear', href: '/category/ethnic-wear?occasion=party' },
      ]
    },
    featured: {
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
      title: 'FESTIVE EDIT',
      caption: 'Heritage Reimagined',
      href: '/category/ethnic-wear'
    }
  },
  'INDO-WESTERN': {
    col1: {
      title: 'CLOTHING',
      links: [
        { label: 'Fusion Sets', href: '/category/indo-western?sub=fusion-sets' },
        { label: 'Indo Gowns', href: '/category/indo-western?sub=indo-gowns' },
        { label: 'Dhoti Sets', href: '/category/indo-western?sub=dhoti-sets' },
      ]
    },
    col2: {
      title: 'TRENDING',
      links: [
        { label: 'New Arrivals', href: '/category/indo-western?offers=new' },
        { label: 'Bestsellers', href: '/category/indo-western?offers=bestseller' },
      ]
    },
    featured: {
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
      title: 'FUSION EDIT',
      caption: 'East Meets West',
      href: '/category/indo-western'
    }
  },
  'ACCESSORIES': {
    col1: {
      title: 'SHOP BY TYPE',
      links: [
        { label: 'Bags', href: '/category/accessories?sub=bags' },
        { label: 'Jewellery', href: '/category/accessories?sub=jewellery' },
        { label: 'Footwear', href: '/category/accessories?sub=footwear' },
      ]
    },
    col2: {
      title: 'CURATIONS',
      links: [
        { label: 'Wedding Collection', href: '/category/accessories?occasion=wedding' },
        { label: 'Everyday Essentials', href: '/category/accessories?occasion=casual' },
      ]
    },
    featured: {
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
      title: 'ACCESSORY EDIT',
      caption: 'The Final Detail',
      href: '/category/accessories'
    }
  }
};

export default function MegaMenu({ category, close }: { category: string, close: () => void }) {
  const data = MENUS[category];
  const prefersReducedMotion = useReducedMotion();

  if (!data) return null;

  return (
    <div className="mega-editorial">
      {/* Left column — display-serif category title */}
      <div className="mega-col-title">
        <h2 className="display-serif mega-category-name">
          {category.split(' ').map((word, i) => (
            <span key={i}>{i === 0 ? word : <em> {word}</em>}</span>
          ))}
        </h2>
      </div>

      {/* Middle column 1 */}
      <div className="mega-col">
        <h4 className="label-caps mega-col-heading">{data.col1.title}</h4>
        <ul className="mega-link-list">
          {data.col1.links.map((link: any, i: number) => (
            <motion.li
              key={link.label}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={link.href} onClick={close} className="link-underline mega-link">
                {link.label}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Middle column 2 */}
      <div className="mega-col">
        <h4 className="label-caps mega-col-heading">{data.col2.title}</h4>
        <ul className="mega-link-list">
          {data.col2.links.map((link: any, i: number) => (
            <motion.li
              key={link.label}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (data.col1.links.length + i) * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={link.href} onClick={close} className="link-underline mega-link">
                {link.label}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Right column — featured editorial image */}
      <div className="mega-featured">
        <Link href={data.featured.href} onClick={close} className="mega-featured-link">
          <div className="mega-featured-img-wrap">
            <Image
              src={data.featured.image}
              alt={data.featured.title}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <p className="label-caps mega-featured-caption">{data.featured.caption}</p>
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .mega-editorial {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1.5fr;
          column-gap: var(--space-16);
          padding: var(--space-12) var(--container-gutter);
          max-width: var(--container-max);
          margin: 0 auto;
        }
        .mega-col-title {
          display: flex;
          align-items: flex-start;
          padding-top: var(--space-2);
        }
        .mega-category-name {
          font-size: var(--text-2xl);
          color: var(--color-ink-muted);
          font-style: italic;
          line-height: 1.15;
        }
        .mega-col-heading {
          margin-bottom: var(--space-6);
        }
        .mega-link-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .mega-link {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--color-ink);
          transition: color 0.3s;
        }
        .mega-link:hover {
          color: var(--color-ink-muted);
        }
        .mega-featured-link {
          display: block;
        }
        .mega-featured-img-wrap {
          position: relative;
          aspect-ratio: 4/5;
          overflow: hidden;
          margin-bottom: var(--space-3);
        }
        .mega-featured-img-wrap img {
          transition: transform 0.9s var(--ease-out-expo);
        }
        .mega-featured-link:hover .mega-featured-img-wrap img {
          transform: scale(1.04);
        }
        .mega-featured-caption {
          text-align: center;
        }
      `}} />
    </div>
  );
}
