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
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.filter(p => p.isFeatured).slice(0, 6));
        }
      })
      .catch(console.error);
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
