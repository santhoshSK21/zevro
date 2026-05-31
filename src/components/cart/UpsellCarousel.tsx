'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import ProductCard from '../product/ProductCard';

export default function UpsellCarousel() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Dummy related products
    setProducts([
      { sku: 'u1', slug: 'u1', name: 'Matching Dupatta', price: 99900, originalPrice: 149900, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500' },
      { sku: 'u2', slug: 'u2', name: 'Gold Drop Earrings', price: 59900, originalPrice: 89900, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500' },
      { sku: 'u3', slug: 'u3', name: 'Embroidered Clutch', price: 129900, originalPrice: 159900, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500' },
    ]);
  }, []);

  if (products.length === 0) return null;

  return (
    <div style={{ marginTop: '64px', borderTop: '1px solid var(--linen)', paddingTop: '40px' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '0.1em', marginBottom: '32px' }}>
        COMPLETE YOUR LOOK
      </h3>
      
      <Swiper
        modules={[Autoplay]}
        spaceBetween={24}
        slidesPerView={1.5}
        breakpoints={{
          640: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3 }
        }}
      >
        {products.map(p => (
          <SwiperSlide key={p.sku}>
            <ProductCard product={p} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
