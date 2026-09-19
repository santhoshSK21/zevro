import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BrandStory() {
  return (
    <section className="section bg-dark">
      <div className="container">
        <div className="brand-story-grid">
          
          <div className="brand-story-image-wrap">
            <Image 
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80" 
              alt="Crafted with intention" 
              fill 
              className="brand-story-img"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="brand-story-text-col">
            <span className="label-caps" style={{ color: 'var(--color-accent)', marginBottom: '8px', display: 'block' }}>
              OUR PHILOSOPHY
            </span>
            <h2 className="brand-story-headline">
              CRAFTED WITH INTENTION
            </h2>
            <div className="gold-rule" style={{ marginBottom: '28px' }} />
            
            <div className="brand-story-paragraphs">
              <p>
                ZEVRO was born from a simple belief: luxury is not just about price, but about the quiet confidence it instills in the wearer. 
              </p>
              <p>
                We merge traditional Indian artisanal craftsmanship with clean, contemporary silhouettes, creating pieces that honor heritage while embracing modern luxury.
              </p>
            </div>

            <p className="brand-story-quote">
              — WEAR TO INSPIRE
            </p>

            <div>
              <Link href="/about" className="btn btn-outline-light">
                READ THE STORY →
              </Link>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .brand-story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .brand-story-image-wrap {
          position: relative;
          aspect-ratio: 4/5;
          width: 100%;
          overflow: hidden;
          background-color: #262622;
        }
        .brand-story-img {
          object-fit: cover;
          filter: contrast(1.02);
        }
        .brand-story-text-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 520px;
        }
        .brand-story-headline {
          font-family: var(--font-display);
          font-size: clamp(28px, 3.2vw, 42px);
          font-weight: 400;
          color: #FAF8F5;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .brand-story-paragraphs {
          color: rgba(245, 241, 232, 0.82);
          display: flex;
          flex-direction: column;
          gap: 16px;
          font-size: 15px;
          line-height: 1.75;
          margin-bottom: 28px;
        }
        .brand-story-quote {
          font-family: var(--font-display);
          font-size: 18px;
          font-style: italic;
          color: #B49A68;
          margin-bottom: 36px;
        }
        @media (max-width: 860px) {
          .brand-story-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}} />
    </section>
  );
}
