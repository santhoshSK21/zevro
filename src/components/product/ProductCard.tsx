'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

interface ProductCardProps {
  product: any;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const primaryImage = product.image || product.variants?.[0]?.images?.[0] || '';
  const secondaryImage = product.variants?.[0]?.images?.[1] || '';
  const hasSecondary = secondaryImage && secondaryImage !== primaryImage;

  return (
    <motion.div
      className="pcard"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
    >
      <div className="pcard-image-wrap">
        <Link href={`/products/${product.slug}`} style={{ display: 'block', position: 'absolute', inset: 0 }}>
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="pcard-img-primary"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="pcard-placeholder">
              <span className="label-caps">No Image</span>
            </div>
          )}

          {hasSecondary && (
            <Image
              src={secondaryImage}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="pcard-img-secondary"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </Link>
      </div>

      <div className="pcard-info">
        <Link href={`/products/${product.slug}`}>
          <h3 className="pcard-name">{product.name}</h3>
          <div className="pcard-price-row">
            <span className="pcard-price">₹{(product.price / 100).toLocaleString('en-IN')}</span>
            {product.originalPrice > product.price && (
              <span className="pcard-mrp">
                ₹{(product.originalPrice / 100).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .pcard {
          position: relative;
          cursor: pointer;
        }
        .pcard-image-wrap {
          position: relative;
          aspect-ratio: 3/4;
          width: 100%;
          overflow: hidden;
          background: var(--color-surface);
        }
        .pcard-img-primary {
          z-index: 2;
          transition: opacity 0.4s ease-out;
        }
        .pcard:hover .pcard-img-primary {
          opacity: ${hasSecondary ? '0' : '0.9'};
        }
        .pcard-img-secondary {
          z-index: 1;
        }
        .pcard-placeholder {
          position: absolute;
          inset: 0;
          background: var(--color-surface);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pcard-info {
          padding-top: var(--space-3);
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .pcard-name {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-ink);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
          font-weight: 400;
        }
        .pcard-price-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .pcard-price {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-ink);
        }
        .pcard-mrp {
          font-family: var(--font-body);
          font-size: 10px;
          color: var(--color-ink-muted);
          text-decoration: line-through;
        }
      `}} />
    </motion.div>
  );
}
