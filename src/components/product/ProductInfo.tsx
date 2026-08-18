'use client';

import React, { useState } from 'react';
import SizeSelector from './SizeSelector';
import { useCartStore } from '../../store/cartStore';

interface ProductInfoProps {
  product: any;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    if (selectedSize === 'M') {
      alert("This size is out of stock. Please sign up to be notified.");
      return;
    }

    addItem({
      productId: product._id || product.slug,
      variantId: product.slug,
      sku: `${product.slug}-${selectedSize}`,
      name: product.name,
      image: product.image || product.images?.[0] || '',
      color: product.color || 'Standard',
      size: selectedSize,
      quantity: 1,
      price: product.price,
      originalPrice: product.originalPrice
    });
  };

  return (
    <div style={{ paddingBottom: '120px', paddingTop: '24px' }}>
      <h1 style={{ fontFamily: 'var(--font-body)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', color: 'var(--color-ink)', marginBottom: '8px', fontWeight: 400 }}>
        {product.name}
      </h1>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '32px' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-ink)' }}>₹{(product.price / 100).toLocaleString('en-IN')}</span>
        {product.originalPrice > product.price && (
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--color-ink-muted)', textDecoration: 'line-through' }}>
            ₹{(product.originalPrice / 100).toLocaleString('en-IN')}
          </span>
        )}
      </div>

      <p style={{ color: 'var(--color-ink)', lineHeight: 1.8, fontSize: '12px', marginBottom: '40px', fontFamily: 'var(--font-body)' }}>
        {product.description || 'Experience the perfect blend of modern elegance and timeless tradition with this exquisite piece.'}
      </p>

      <div style={{ marginBottom: '40px' }}>
        <SizeSelector 
          sizes={(product.sizes || ['XS', 'S', 'M', 'L', 'XL']).map((size: string, index: number) => ({
            size,
            inStock: index !== 2
          }))} 
          selected={selectedSize} 
          onChange={setSelectedSize} 
        />
      </div>

      <div style={{ paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-body)' }}>
        <p>Free standard shipping on orders above ₹999</p>
        <p>7-day hassle-free returns</p>
      </div>

      {/* Sticky Add to Bag Bar */}
      <div style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, 
        backgroundColor: 'var(--color-bg)', 
        borderTop: '1px solid var(--color-stone)',
        padding: '16px var(--container-gutter)',
        zIndex: 100,
        display: 'flex', justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '400px', width: '100%', display: 'flex', gap: '1px', backgroundColor: 'var(--color-stone)', padding: '1px' }}>
          <button onClick={handleAddToCart} className="btn" style={{ flex: 1, backgroundColor: 'var(--color-ink)', color: 'var(--color-white)', fontFamily: 'var(--font-body)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', border: 'none', padding: '16px' }}>ADD TO BAG</button>
          <button className="btn" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-ink)', border: 'none', padding: '0 24px', fontSize: '16px' }}>♡</button>
        </div>
      </div>
      
    </div>
  );
}
