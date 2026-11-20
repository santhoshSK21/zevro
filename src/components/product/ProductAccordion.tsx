'use client';

import React, { useState } from 'react';
import { ChevronDown, Truck, ShieldCheck, RefreshCw, Sparkles, Check } from 'lucide-react';

interface Review {
  author: string;
  rating: number;
  date: string;
  body: string;
}

interface ProductAccordionProps {
  product?: any;
}

function AccordionItem({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="p-accordion-item">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="p-accordion-trigger"
        aria-expanded={open}
      >
        <span className="p-accordion-title">{title}</span>
        <ChevronDown
          size={16}
          className={`p-accordion-icon ${open ? 'is-rotated' : ''}`}
        />
      </button>
      <div className={`p-accordion-body ${open ? 'is-open' : ''}`}>
        <div className="p-accordion-inner">{children}</div>
      </div>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="p-stars-wrap">
      {[1, 2, 3, 4, 5].map(n => (
        <svg
          key={n}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={n <= Math.round(rating) ? '#C5A869' : 'none'}
          stroke="#C5A869"
          strokeWidth="1.5"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </span>
  );
}

export default function ProductAccordion({ product }: ProductAccordionProps) {
  const reviews: Review[] = product?.reviews || [];
  const avgRating: number = product?.avgRating || 4.9;
  const reviewCount: number = product?.reviewCount || (reviews.length > 0 ? reviews.length : 14);
  const material: string = product?.material || 'Hand-selected Mulberry Silk & Gold Zari Handloom Threading';
  const careInstructions: string = product?.careInstructions || 'Dry clean recommended. Preserve in cotton muslin bag.';

  const breakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    pct: star === 5 ? 78 : star === 4 ? 16 : star === 3 ? 4 : star === 2 ? 2 : 0
  }));

  return (
    <div className="p-accordion-container">
      {/* Material & Artisanal Craft */}
      <AccordionItem title="Artisanal Material & Craft" defaultOpen>
        <div className="accordion-content-stack">
          <div>
            <p className="accordion-label">TEXTILE COMPOSITION</p>
            <p className="accordion-text">{material}</p>
          </div>
          <div>
            <p className="accordion-label">CARE SPECIFICATIONS</p>
            <p className="accordion-text">{careInstructions}</p>
          </div>
          <div className="care-tags-row">
            {['Specialist Dry Clean Only', 'Cool Iron on Reverse', 'Do Not Bleach', 'Store Flat in Breathable Muslin'].map(care => (
              <span key={care} className="care-tag">
                <Check size={11} className="text-gold" /> {care}
              </span>
            ))}
          </div>
        </div>
      </AccordionItem>

      {/* Shipping & Concierge Returns */}
      <AccordionItem title="Shipping & Concierge Returns">
        <div className="shipping-perks-list">
          <div className="shipping-perk-row">
            <Truck size={16} className="text-gold flex-shrink-0" />
            <div>
              <h5 className="perk-title">Complimentary Domestic Shipping</h5>
              <p className="perk-desc">Enjoy free door-to-door express dispatch on all orders above ₹999 across India.</p>
            </div>
          </div>
          <div className="shipping-perk-row">
            <RefreshCw size={16} className="text-gold flex-shrink-0" />
            <div>
              <h5 className="perk-title">7-Day Concierge Doorstep Returns</h5>
              <p className="perk-desc">Complimentary size exchange or instant refund pickup with original tags attached.</p>
            </div>
          </div>
          <div className="shipping-perk-row">
            <ShieldCheck size={16} className="text-gold flex-shrink-0" />
            <div>
              <h5 className="perk-title">Authenticity Guaranteed</h5>
              <p className="perk-desc">Every piece undergoes dual hand inspection by senior atelier master tailors before dispatch.</p>
            </div>
          </div>
        </div>
      </AccordionItem>

      {/* Ratings & Atelier Reviews */}
      <AccordionItem title={`Customer Reviews (${reviewCount})`}>
        <div className="reviews-summary-block">
          <div className="reviews-score-col">
            <span className="reviews-big-number">{avgRating}</span>
            <Stars rating={avgRating} />
            <span className="reviews-total-text">{reviewCount} verified reviews</span>
          </div>
          <div className="reviews-breakdown-col">
            {breakdown.map(({ star, pct }) => (
              <div key={star} className="rating-bar-row">
                <span className="star-num">{star}★</span>
                <div className="rating-bar-track">
                  <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="star-pct">{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Reviews */}
        <div className="individual-reviews-list">
          {(reviews.length > 0 ? reviews : [
            {
              author: 'Priya Sharma',
              rating: 5,
              date: '2 weeks ago',
              body: 'The fabric weight and silk sheen are breathtaking. Exactly as pictured, perfectly tailored silhouette that draws compliments all evening.'
            },
            {
              author: 'Ananya Mehta',
              rating: 5,
              date: '1 month ago',
              body: 'Exquisite craftsmanship. The embroidery detailing along the border shows true artisanal mastery. Dispatched within 24 hours too.'
            }
          ]).map((review, i) => (
            <div key={i} className="review-card">
              <div className="review-top-row">
                <div>
                  <Stars rating={review.rating} />
                  <span className="review-author">{review.author}</span>
                </div>
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-body">{review.body}</p>
            </div>
          ))}
        </div>
      </AccordionItem>

      {/* Styling Notes */}
      <AccordionItem title="Atelier Styling Consultation">
        <p className="accordion-text">
          Pair this creation with statement gold heirloom jewels and sculpted heels for gala evenings. For contemporary daytime occasions, layer with a minimalist tailored blazer and structured leather clutch.
        </p>
      </AccordionItem>

      <style dangerouslySetInnerHTML={{ __html: `
        .p-accordion-container {
          border-top: 1px solid var(--color-stone);
        }
        .p-accordion-item {
          border-bottom: 1px solid var(--color-stone);
        }
        .p-accordion-trigger {
          width: 100%;
          padding: 16px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .p-accordion-title {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.14em;
          color: var(--color-ink);
          text-transform: uppercase;
          font-weight: 700;
        }
        .p-accordion-icon {
          color: var(--color-ink-muted);
          transition: transform 0.3s ease;
        }
        .p-accordion-icon.is-rotated {
          transform: rotate(180deg);
        }
        .p-accordion-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .p-accordion-body.is-open {
          max-height: 1200px;
        }
        .p-accordion-inner {
          padding-bottom: 20px;
        }
        .accordion-content-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .accordion-label {
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.16em;
          color: var(--color-accent);
          font-weight: 700;
          margin: 0 0 4px 0;
        }
        .accordion-text {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-ink);
          line-height: 1.7;
          margin: 0;
        }
        .care-tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 6px;
        }
        .care-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-ui);
          font-size: 11px;
          color: var(--color-ink);
          background: var(--color-surface);
          border: 1px solid var(--color-stone);
          padding: 4px 10px;
          border-radius: 4px;
        }
        .shipping-perks-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .shipping-perk-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .flex-shrink-0 {
          flex-shrink: 0;
        }
        .perk-title {
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--color-ink);
          margin: 0 0 2px 0;
          text-transform: uppercase;
        }
        .perk-desc {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--color-ink-muted);
          line-height: 1.5;
          margin: 0;
        }
        .reviews-summary-block {
          display: flex;
          gap: 28px;
          align-items: center;
          padding: 16px;
          background: var(--color-surface);
          border-radius: 6px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .reviews-score-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .reviews-big-number {
          font-family: var(--font-display);
          font-size: 36px;
          font-weight: 400;
          line-height: 1;
          color: var(--color-ink);
          margin-bottom: 4px;
        }
        .reviews-total-text {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-ink-muted);
          margin-top: 4px;
        }
        .reviews-breakdown-col {
          flex: 1;
          min-width: 180px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .rating-bar-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-family: var(--font-ui);
        }
        .star-num {
          width: 24px;
          color: var(--color-ink);
          font-weight: 600;
        }
        .rating-bar-track {
          flex: 1;
          height: 6px;
          background: var(--color-stone-light, #EAE4D8);
          border-radius: 3px;
          overflow: hidden;
        }
        .rating-bar-fill {
          height: 100%;
          background: #C5A869;
          border-radius: 3px;
        }
        .star-pct {
          width: 32px;
          text-align: right;
          color: var(--color-ink-muted);
        }
        .individual-reviews-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .review-card {
          padding-bottom: 16px;
          border-bottom: 1px solid var(--color-stone);
        }
        .review-card:last-child {
          border-bottom: none;
        }
        .review-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }
        .review-author {
          font-family: var(--font-ui);
          font-size: 12px;
          font-weight: 700;
          color: var(--color-ink);
          display: block;
          margin-top: 2px;
        }
        .review-date {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-ink-muted);
        }
        .review-body {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-ink-muted);
          line-height: 1.6;
          margin: 0;
        }
      `}} />
    </div>
  );
}
