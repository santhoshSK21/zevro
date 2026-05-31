'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from '../product/ProductCard';

export default function BestsellerSlider() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // In real app: fetch /api/products?isBestseller=true
    // Using dummy data to avoid fetch error without DB
    setProducts([
      { sku: '1', slug: 'p1', name: 'Zevro Gold Tunic', price: 299900, originalPrice: 399900, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500', category: 'ethnic-wear' },
      { sku: '2', slug: 'p2', name: 'Silk Blend Saree', price: 499900, originalPrice: 599900, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500', category: 'ethnic-wear' },
      { sku: '3', slug: 'p3', name: 'Ivory Maxi Dress', price: 199900, originalPrice: 249900, image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500', category: 'western-wear' },
      { sku: '4', slug: 'p4', name: 'Bronze Velvet Kurti', price: 159900, originalPrice: 199900, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500', category: 'ethnic-wear' },
      { sku: '5', slug: 'p5', name: 'Classic Handbag', price: 349900, originalPrice: 400000, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', category: 'accessories' },
    ]);
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="section bg-primary">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 className="section-title">BESTSELLERS</h2>
          <div className="gold-rule" style={{ margin: '20px auto' }} />
        </div>

        <div style={{ position: 'relative', padding: '0 40px' }} className="bestseller-slider">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{ nextEl: '.bs-next', prevEl: '.bs-prev' }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 }
            }}
          >
            {products.map((p) => (
              <SwiperSlide key={p.sku}>
                <ProductCard product={p} />
              </SwiperSlide>
            ))}
          </Swiper>
          
          <button className="bs-prev" style={{ position: 'absolute', left: 0, top: '40%', fontSize: '24px', color: 'var(--espresso)', zIndex: 10 }}>←</button>
          <button className="bs-next" style={{ position: 'absolute', right: 0, top: '40%', fontSize: '24px', color: 'var(--espresso)', zIndex: 10 }}>→</button>
        </div>
      </div>
    </section>
  );
}
