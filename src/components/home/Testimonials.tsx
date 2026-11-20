'use client';

import React, { useState, useEffect } from 'react';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const reviews = [
    {
      text: "The drape of the ivory Mulberry silk anarkali is pure poetry. I wore it for our family gala in Mumbai and the compliments were endless. You feel the generational craftsmanship in every stitch.",
      author: "Priya Singhania",
      city: "Mumbai",
      role: "Art Curator",
      initials: "PS",
    },
    {
      text: "ZEVRO bridges traditional Indian textile heritage with crisp contemporary silhouettes better than any international couture house. The velvet jacket has become my signature evening piece.",
      author: "Dr. Ananya Roy",
      city: "New Delhi",
      role: "Architectural Designer",
      initials: "AR",
    },
    {
      text: "Opening the ZEVRO parcel is an exquisite ceremony in itself. The gold wax seal, hand-pressed linen garment bag, and personalized note reflect authentic bespoke luxury.",
      author: "Meera Krishnan",
      city: "Bengaluru",
      role: "Creative Director",
      initials: "MK",
    },
    {
      text: "The Indo-Western drape set ordered for our reception in Mayfair arrived impeccably fitted. Exceptional concierge service and peerless artisanal embroidery.",
      author: "Neha Malhotra",
      city: "London",
      role: "Venture Partner",
      initials: "NM",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <section className="testimonials-section">
      <div className="container-sm">
        {/* Header */}
        <div className="testimonials-header">
          <div className="test-tag-row">
            <span className="test-star">✦</span>
            <span className="test-eyebrow">PATRON DIARIES</span>
            <span className="test-star">✦</span>
          </div>
          <h2 className="test-title">
            VOICES OF <span className="serif-italic">Distinction</span>
          </h2>
        </div>

        {/* Testimonial Card Stage */}
        <div className="test-stage">
          {reviews.map((r, i) => (
            <div
              key={i}
              className={`test-card ${activeIndex === i ? 'is-active' : ''}`}
            >
              <div className="test-stars">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
              <p className="test-quote">
                “{r.text}”
              </p>
              <div className="test-author-row">
                <div className="test-avatar">{r.initials}</div>
                <div className="test-meta">
                  <span className="test-author-name">{r.author}</span>
                  <span className="test-author-role">
                    {r.role} • {r.city}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Dots */}
        <div className="test-dots-row">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`test-dot ${activeIndex === i ? 'is-active' : ''}`}
              aria-label={`View review ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .testimonials-section {
          background-color: var(--color-surface);
          border-top: 1px solid var(--color-stone);
          border-bottom: 1px solid var(--color-stone);
          padding: clamp(48px, 6vw, 76px) 0;
          text-align: center;
          position: relative;
        }
        .testimonials-header {
          margin-bottom: clamp(24px, 4vw, 36px);
        }
        .test-tag-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .test-star {
          color: var(--color-accent);
          font-size: 11px;
        }
        .test-eyebrow {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--color-accent);
          font-weight: 600;
        }
        .test-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 3.6vw, 2.8rem);
          color: var(--color-ink);
          font-weight: 400;
          letter-spacing: -0.015em;
          margin: 0;
        }
        .test-stage {
          position: relative;
          min-height: 230px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .test-card {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0 16px;
        }
        .test-card.is-active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .test-stars {
          color: var(--color-accent);
          font-size: 16px;
          letter-spacing: 5px;
          margin-bottom: 18px;
        }
        .test-quote {
          font-family: var(--font-display);
          font-size: clamp(17px, 2.4vw, 23px);
          font-style: italic;
          color: var(--color-ink);
          line-height: 1.65;
          margin-bottom: 24px;
          max-width: 780px;
        }
        .test-author-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .test-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #141412;
          color: #C5A869;
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-accent);
        }
        .test-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }
        .test-author-name {
          font-family: var(--font-ui);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-ink);
          text-transform: uppercase;
        }
        .test-author-role {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-ink-muted);
        }
        .test-dots-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
        }
        .test-dot {
          width: 24px;
          height: 3px;
          background: var(--color-stone);
          border: none;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .test-dot.is-active {
          background: var(--color-ink);
          width: 36px;
        }
      `}} />
    </section>
  );
}
