'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function PromoSpotlight() {
  const spotlights = [
    {
      badge: 'HEIRLOOM SILKS',
      title: 'The Royal Banarasi Edit',
      subtitle: 'Pure gold zari handloom weaves curated for weddings and grand galas.',
      ctaText: 'EXPLORE SILKS',
      ctaHref: '/category/ethnic-wear',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80',
      offer: 'COMPLIMENTARY BLOUSE TAILORING',
    },
    {
      badge: 'AUTUMN / WINTER 2026',
      title: 'Architectural Obsidian Velvet',
      subtitle: 'Sculpted tuxedos and tailored blazers crafted with unapologetic modern poise.',
      ctaText: 'EXPLORE TAILORING',
      ctaHref: '/category/western-wear',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=80',
      offer: 'LIMITED ATELIER PRODUCTION',
    },
  ];

  return (
    <section className="promo-spotlight-section">
      <div className="container">
        <div className="promo-spotlight-grid">
          {spotlights.map((item, idx) => (
            <div key={idx} className="spotlight-card">
              <div className="spotlight-img-wrap">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="spotlight-img"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="spotlight-overlay" />
              </div>

              <div className="spotlight-content">
                <div className="spotlight-tag-row">
                  <Sparkles size={11} className="text-gold" />
                  <span className="spotlight-badge">{item.badge}</span>
                </div>

                <h3 className="spotlight-title">{item.title}</h3>
                <p className="spotlight-sub">{item.subtitle}</p>

                <div className="spotlight-action-row">
                  <Link href={item.ctaHref} className="spotlight-cta-btn">
                    <span>{item.ctaText}</span>
                    <ArrowRight size={13} />
                  </Link>
                  <span className="spotlight-perk">{item.offer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .promo-spotlight-section {
          padding: clamp(24px, 3.5vw, 40px) 0;
          background-color: var(--color-bg, #FAF7F2);
        }

        .promo-spotlight-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(16px, 2.5vw, 24px);
        }

        .spotlight-card {
          position: relative;
          border-radius: var(--radius-sm, 6px);
          overflow: hidden;
          background: #141412;
          min-height: 280px;
          display: flex;
          align-items: flex-end;
          border: 1px solid var(--color-stone, #DFD8CC);
          box-shadow: 0 10px 30px rgba(20, 20, 18, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .spotlight-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(20, 20, 18, 0.16);
        }

        .spotlight-img-wrap {
          position: absolute;
          inset: 0;
        }

        .spotlight-img {
          object-fit: cover;
          transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .spotlight-card:hover .spotlight-img {
          transform: scale(1.06);
        }

        .spotlight-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(20, 20, 18, 0.2) 0%, rgba(20, 20, 18, 0.5) 40%, rgba(20, 20, 18, 0.92) 100%);
        }

        .spotlight-content {
          position: relative;
          z-index: 2;
          padding: clamp(20px, 3vw, 28px);
          width: 100%;
        }

        .spotlight-tag-row {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .text-gold {
          color: var(--color-accent, #C5A869);
        }

        .spotlight-badge {
          font-family: var(--font-ui);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-accent, #C5A869);
        }

        .spotlight-title {
          font-family: var(--font-display);
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 400;
          color: #FFFFFF;
          margin: 0 0 6px 0;
          line-height: 1.2;
        }

        .spotlight-sub {
          font-family: var(--font-body);
          font-size: 12.5px;
          color: #D6D0C5;
          margin: 0 0 16px 0;
          line-height: 1.5;
          max-width: 440px;
        }

        .spotlight-action-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .spotlight-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          color: #141412;
          padding: 8px 18px;
          border-radius: var(--radius-full, 9999px);
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .spotlight-card:hover .spotlight-cta-btn {
          background: var(--color-accent, #C5A869);
          color: var(--color-dark, #141412);
        }

        .spotlight-perk {
          font-family: var(--font-ui);
          font-size: 10px;
          color: var(--color-accent, #C5A869);
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .promo-spotlight-grid {
            grid-template-columns: 1fr;
          }
          .spotlight-card {
            min-height: 240px;
          }
        }
      `}} />
    </section>
  );
}

