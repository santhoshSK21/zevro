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
    // Mock check for out of stock since we mocked 'M' as out of stock
    if (selectedSize === 'M') {
      alert("This size is out of stock. Please sign up to be notified.");
      return;
    }

    addItem({
      productId: product._id || product.slug,
      variantId: product.slug,
      sku: `${product.sku}-${selectedSize}`,
      name: product.name,
      image: product.image || product.images?.[0] || '',
      color: product.color || 'Default Color',
      size: selectedSize,
      quantity: 1,
      price: product.price,
      originalPrice: product.originalPrice
    });
  };

  return (
    <div>
      <p style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
        {product.category?.replace('-', ' ')}
      </p>
      
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--espresso)', marginBottom: '16px' }}>
        {product.name}
      </h1>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '24px' }}>₹{(product.price / 100).toLocaleString('en-IN')}</span>
        {product.originalPrice > product.price && (
          <>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', color: 'var(--warm-grey)', textDecoration: 'line-through' }}>
              ₹{(product.originalPrice / 100).toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--success)', border: '1px solid var(--success)', padding: '2px 8px', borderRadius: '4px' }}>
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </span>
          </>
        )}
      </div>

      <p style={{ color: 'var(--warm-grey)', lineHeight: 1.8, marginBottom: '32px' }}>
        {product.description || 'Experience the perfect blend of modern elegance and timeless tradition with this exquisite piece.'}
      </p>

      <div style={{ marginBottom: '32px' }}>
        <SizeSelector 
          sizes={(product.sizes || ['XS', 'S', 'M', 'L', 'XL']).map((size: string, index: number) => ({
            size,
            inStock: index !== 2 // Mocking 'M' as out of stock for demonstration
          }))} 
          selected={selectedSize} 
          onChange={setSelectedSize} 
        />
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
        <button onClick={handleAddToCart} className="btn btn-primary" style={{ flex: 1, padding: '16px' }}>ADD TO CART</button>
        <button className="btn btn-outline-gold" style={{ padding: '16px', width: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ❤
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--linen)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: 'var(--warm-grey)' }}>
        <p style={{ display: 'flex', gap: '8px' }}><span>🚚</span> Free standard shipping on orders above ₹999</p>
        <p style={{ display: 'flex', gap: '8px' }}><span>↩</span> 7-day hassle-free returns</p>
        <p style={{ display: 'flex', gap: '8px' }}><span>🛡</span> Secure checkout</p>
      </div>
    </div>
  );
}
