'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from '../product/ProductCard';

const BESTSELLER_FALLBACKS = [
  {
    _id: 'bs-1',
    sku: 'ZEV-BS-01',
    name: 'Gilded Zari Raw Silk Anarkali Set',
    slug: 'gilded-zari-raw-silk-anarkali-set',
    category: 'ethnic-wear',
    price: 2850000,
    originalPrice: 3400000,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      'https://images.unsplash.com/photo-1583391733958-d69818b2c451?w=800&q=80',
    ],
    isBestseller: true,
  },
  {
    _id: 'bs-2',
    sku: 'ZEV-BS-02',
    name: 'Architectural Obsidian Velvet Tuxedo',
    slug: 'architectural-obsidian-velvet-tuxedo',
    category: 'western-wear',
    price: 2200000,
    originalPrice: 2800000,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
      'https://images.unsplash.com/photo-1485230895905-ef4a5009a632?w=800&q=80',
    ],
    isBestseller: true,
  },
  {
    _id: 'bs-3',
    sku: 'ZEV-BS-03',
    name: 'Draped Emerald Satin Fusion Saree',
    slug: 'draped-emerald-satin-fusion-saree',
    category: 'indo-western',
    price: 1950000,
    originalPrice: 2400000,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0c739ba73a16?w=800&q=80',
      'https://images.unsplash.com/photo-1621084288075-80252119eb49?w=800&q=80',
    ],
    isBestseller: true,
  },
  {
    _id: 'bs-4',
    sku: 'ZEV-BS-04',
    name: 'Heritage Polki & Emerald Choker',
    slug: 'heritage-polki-emerald-choker',
    category: 'accessories',
    price: 1120000,
    originalPrice: 1400000,
    images: [
      'https://images.unsplash.com/photo-1599643478524-fb66f70362f6?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    ],
    isBestseller: true,
  },
  {
    _id: 'bs-5',
    sku: 'ZEV-BS-05',
    name: 'Ivory Mulberry Silk Pleated Gown',
    slug: 'ivory-mulberry-silk-pleated-gown',
    category: 'western-wear',
    price: 2450000,
    originalPrice: 3100000,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
    ],
    isBestseller: true,
  },
  {
    _id: 'bs-6',
    sku: 'ZEV-BS-06',
    name: 'Crimson Royal Banarasi Lehenga',
    slug: 'crimson-royal-banarasi-lehenga',
    category: 'ethnic-wear',
    price: 4200000,
    originalPrice: 5200000,
    images: [
      'https://images.unsplash.com/photo-1617261314958-3759a224f8d5?w=800&q=80',
      'https://images.unsplash.com/photo-1605763240000-7e93b172d754?w=800&q=80',
    ],
    isBestseller: true,
  },
];

export default function BestsellerSlider() {
  const [products, setProducts] = useState<any[]>(BESTSELLER_FALLBACKS);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const list: any[] = Array.isArray(data) ? data : data?.products || [];
        if (list.length > 0) {
          const featured = list.filter((p) => p.isFeatured || p.isBestseller);
          setProducts(featured.length >= 4 ? featured : list.slice(0, 6));
        }
      })
      .catch(() => {
        // Keep fallback
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="section bg-primary bestseller-section">
      <div className="container">
        {/* Header */}
        <div className="bestseller-header">
          <div className="bestseller-header-left">
            <div className="bestseller-tag-row">
              <span className="bestseller-star">✦</span>
              <span className="bestseller-eyebrow">TIMELESS ICONS</span>
              <span className="bestseller-star">✦</span>
            </div>
            <h2 className="section-title">
              THE MOST <span className="serif-italic">Coveted</span>
            </h2>
            <p className="section-subtitle">
              Garments celebrated for exceptional drape, craft, and understated grandeur.
            </p>
          </div>

          <div className="bestseller-controls">
            <button className="bs-prev-btn" aria-label="Previous Slide">
              ←
            </button>
            <button className="bs-next-btn" aria-label="Next Slide">
              →
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="bestseller-slider-wrap">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{ nextEl: '.bs-next-btn', prevEl: '.bs-prev-btn' }}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 1.3, spaceBetween: 14 },
              540: { slidesPerView: 2, spaceBetween: 16 },
              900: { slidesPerView: 3, spaceBetween: 24 },
              1200: { slidesPerView: 4, spaceBetween: 28 },
            }}
          >
            {products.map((p, index) => (
              <SwiperSlide key={p.sku || p._id || index}>
                <ProductCard product={p} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .bestseller-section {
          border-top: 1px solid var(--color-stone-light);
          padding: clamp(24px, 3.5vw, 40px) 0;
        }
        .bestseller-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: clamp(28px, 4vw, 40px);
          gap: 20px;
        }
        .bestseller-tag-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .bestseller-star {
          color: var(--color-accent);
          font-size: 11px;
        }
        .bestseller-eyebrow {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--color-accent);
          font-weight: 600;
        }
        .bestseller-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .bs-prev-btn, .bs-next-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--color-stone);
          background: var(--color-surface);
          color: var(--color-ink);
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s var(--ease-luxury);
        }
        .bs-prev-btn:hover, .bs-next-btn:hover {
          background: #141412;
          color: #FAF7F2;
          border-color: #141412;
          transform: translateY(-2px);
        }
        .bestseller-slider-wrap {
          position: relative;
          width: 100%;
        }
        @media (max-width: 640px) {
          .bestseller-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .bestseller-controls {
            align-self: flex-end;
          }
        }
      `}} />
    </section>
  );
}
