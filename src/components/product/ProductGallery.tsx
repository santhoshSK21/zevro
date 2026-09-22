'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [hovered, setHovered] = useState(false);

  const safeImages = images && images.length > 0 ? images : ['/pdp_hero_1.png'];

  const prev = useCallback(() => setActive(a => (a - 1 + safeImages.length) % safeImages.length), [safeImages.length]);
  const next = useCallback(() => setActive(a => (a + 1) % safeImages.length), [safeImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') { setLightboxOpen(false); setZoom(1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, prev, next]);

  // Reset active index when images change (color switch)
  useEffect(() => { setActive(0); }, [images]);

  return (
    <>
      <div className="pgallery-root">
        {/* Thumbnail strip */}
        <div className="pgallery-thumbs">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`pgallery-thumb ${i === active ? 'pgallery-thumb--active' : ''}`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img} alt={`Thumbnail ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="80px" />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div
          className={`pgallery-main ${hovered ? 'pgallery-main--zoom' : ''}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => { setLightboxOpen(true); setZoom(1); }}
          role="button"
          aria-label="Click to zoom"
        >
          <Image
            src={safeImages[active]}
            alt={`Product view ${active + 1}`}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            loading="eager"
          />
          <div className="pgallery-zoom-hint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
            <span>Click to zoom</span>
          </div>

          {/* Prev / Next arrows */}
          {safeImages.length > 1 && (
            <>
              <button className="pgallery-arrow pgallery-arrow--left" onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous image">‹</button>
              <button className="pgallery-arrow pgallery-arrow--right" onClick={e => { e.stopPropagation(); next(); }} aria-label="Next image">›</button>
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="pgallery-lightbox" onClick={() => { setLightboxOpen(false); setZoom(1); }}>
          <div className="pgallery-lb-content" onClick={e => e.stopPropagation()}>
            {/* Controls */}
            <div className="pgallery-lb-controls">
              <button className="pgallery-lb-btn" onClick={() => setZoom(z => Math.min(z + 0.5, 3))} aria-label="Zoom in">＋</button>
              <button className="pgallery-lb-btn" onClick={() => setZoom(z => Math.max(z - 0.5, 1))} aria-label="Zoom out">－</button>
              <button className="pgallery-lb-btn" onClick={() => { setLightboxOpen(false); setZoom(1); }} aria-label="Close">✕</button>
            </div>
            <div className="pgallery-lb-img-wrap" style={{ cursor: zoom > 1 ? 'grab' : 'zoom-in' }}>
              <img
                src={safeImages[active]}
                alt="Zoomed product view"
                style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease', maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
              />
            </div>
            {/* Lightbox arrows */}
            {safeImages.length > 1 && (
              <div className="pgallery-lb-nav">
                <button className="pgallery-lb-nav-btn" onClick={prev}>‹</button>
                <span className="pgallery-lb-counter">{active + 1} / {safeImages.length}</span>
                <button className="pgallery-lb-nav-btn" onClick={next}>›</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .pgallery-root {
          display: flex;
          gap: 12px;
          position: sticky;
          top: 80px;
        }
        .pgallery-thumbs {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0;
        }
        .pgallery-thumb {
          position: relative;
          width: 72px;
          height: 96px;
          border: 1.5px solid transparent;
          cursor: pointer;
          overflow: hidden;
          background: var(--color-surface);
          flex-shrink: 0;
          transition: border-color 0.2s;
        }
        .pgallery-thumb--active {
          border-color: var(--color-ink);
        }
        .pgallery-main {
          position: relative;
          flex: 1;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: var(--color-surface);
          cursor: zoom-in;
        }
        .pgallery-main--zoom img {
          transform: scale(1.06) !important;
        }
        .pgallery-zoom-hint {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(4px);
          padding: 6px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          letter-spacing: 0.08em;
          font-family: var(--font-ui);
          color: var(--color-ink);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .pgallery-main:hover .pgallery-zoom-hint {
          opacity: 1;
        }
        .pgallery-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(4px);
          border: none;
          width: 40px;
          height: 40px;
          font-size: 22px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-ink);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .pgallery-main:hover .pgallery-arrow { opacity: 1; }
        .pgallery-arrow--left { left: 8px; }
        .pgallery-arrow--right { right: 8px; }
        /* Lightbox */
        .pgallery-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.92);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pgallery-lb-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 24px;
          max-width: 90vw;
        }
        .pgallery-lb-controls {
          display: flex;
          gap: 8px;
          align-self: flex-end;
        }
        .pgallery-lb-btn {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          width: 40px;
          height: 40px;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .pgallery-lb-btn:hover { background: rgba(255,255,255,0.3); }
        .pgallery-lb-img-wrap {
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pgallery-lb-nav {
          display: flex;
          align-items: center;
          gap: 24px;
          color: white;
        }
        .pgallery-lb-nav-btn {
          background: none;
          border: none;
          color: white;
          font-size: 32px;
          cursor: pointer;
          padding: 8px;
        }
        .pgallery-lb-counter {
          font-family: var(--font-ui);
          font-size: 12px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.7);
        }
        @media (max-width: 768px) {
          .pgallery-root { flex-direction: column-reverse; }
          .pgallery-thumbs { flex-direction: row; overflow-x: auto; }
          .pgallery-thumb { width: 56px; height: 72px; }
          .pgallery-main { aspect-ratio: 3/4; }
        }
      `}} />
    </>
  );
}

