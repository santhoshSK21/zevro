'use client';

import React, { useState } from 'react';
import SizeSelector from './SizeSelector';
import { useCartStore } from '../../store/cartStore';
import { useRouter } from 'next/navigation';

interface Variant {
  colorName: string;
  colorHex: string;
  images: string[];
  sizes: { size: string; stock: number }[];
}

interface ProductInfoProps {
  product: any;
  onColorChange?: (images: string[]) => void;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1,2,3,4,5].map(n => (
          <svg key={n} width="14" height="14" viewBox="0 0 24 24" fill={n <= full ? 'var(--color-ink)' : n === full + 1 && half ? 'url(#half)' : 'none'} stroke="var(--color-ink)" strokeWidth="1.5">
            <defs>
              <linearGradient id="half"><stop offset="50%" stopColor="var(--color-ink)"/><stop offset="50%" stopColor="transparent"/></linearGradient>
            </defs>
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
        ))}
      </div>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--color-ink-muted)' }}>{rating} ({count} reviews)</span>
    </div>
  );
}

export default function ProductInfo({ product, onColorChange }: ProductInfoProps) {
  const variants: Variant[] = product.variants || [];
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryMsg, setDeliveryMsg] = useState('');
  const [wishlist, setWishlist] = useState(false);
  const { addItem, openDrawer } = useCartStore();
  const router = useRouter();

  const activeVariant = variants[activeVariantIdx] || { colorName: 'Standard', colorHex: '#000', images: [], sizes: [] };
  const sizes = activeVariant.sizes.map((s: any) => ({ size: s.size, inStock: s.stock > 0 }));

  const handleColorSelect = (idx: number) => {
    setActiveVariantIdx(idx);
    setSelectedSize(null);
    if (onColorChange && variants[idx]?.images) {
      onColorChange(variants[idx].images);
    }
  };

  const buildCartItem = () => ({
    productId: product._id || product.slug,
    variantId: `${product.slug}-${activeVariant.colorName}`,
    sku: `${product.slug}-${activeVariant.colorName}-${selectedSize}`,
    name: product.name,
    image: activeVariant.images?.[0] || product.images?.[0] || '',
    color: activeVariant.colorName,
    size: selectedSize!,
    quantity,
    price: product.price,
    originalPrice: product.originalPrice,
  });

  const handleAddToCart = () => {
    if (!selectedSize) { alert('Please select a size.'); return; }
    addItem(buildCartItem());
    openDrawer();
  };

  const handleBuyNow = () => {
    if (!selectedSize) { alert('Please select a size.'); return; }
    addItem(buildCartItem());
    router.push('/checkout');
  };

  const checkDelivery = () => {
    if (pincode.length !== 6) { setDeliveryMsg('Please enter a valid 6-digit pincode.'); return; }
    const days = Math.floor(Math.random() * 3) + 3;
    const date = new Date();
    date.setDate(date.getDate() + days);
    setDeliveryMsg(`✓ Estimated delivery by ${date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}`);
  };

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <div className="pinfo-root">
        {/* Brand / Category */}
        <p className="pinfo-category">{(product.category || '').replace(/-/g, ' ').toUpperCase()}</p>

        {/* Name */}
        <h1 className="pinfo-name">{product.name}</h1>

        {/* Ratings */}
        {product.avgRating && <StarRating rating={product.avgRating} count={product.reviewCount || 0} />}

        {/* Price */}
        <div className="pinfo-price-row">
          <span className="pinfo-price">₹{(product.price / 100).toLocaleString('en-IN')}</span>
          {product.originalPrice > product.price && (
            <>
              <span className="pinfo-mrp">₹{(product.originalPrice / 100).toLocaleString('en-IN')}</span>
              <span className="pinfo-badge">{discount}% OFF</span>
            </>
          )}
        </div>
        <p className="pinfo-tax">Inclusive of all taxes. Free shipping above ₹999.</p>

        {/* Description */}
        <p className="pinfo-desc">{product.description}</p>

        {/* Color Swatches */}
        {variants.length > 1 && (
          <div className="pinfo-section">
            <div className="pinfo-label-row">
              <span className="pinfo-label">COLOUR</span>
              <span className="pinfo-label-value">{activeVariant.colorName}</span>
            </div>
            <div className="pinfo-swatches">
              {variants.map((v, idx) => (
                <button
                  key={idx}
                  onClick={() => handleColorSelect(idx)}
                  className={`pinfo-swatch ${idx === activeVariantIdx ? 'pinfo-swatch--active' : ''}`}
                  style={{ backgroundColor: v.colorHex }}
                  title={v.colorName}
                  aria-label={`Select colour ${v.colorName}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size Selector */}
        <div className="pinfo-section">
          <SizeSelector sizes={sizes} selected={selectedSize} onChange={setSelectedSize} />
        </div>

        {/* Quantity */}
        <div className="pinfo-section">
          <span className="pinfo-label">QUANTITY</span>
          <div className="pinfo-qty">
            <button className="pinfo-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
            <span className="pinfo-qty-num">{quantity}</span>
            <button className="pinfo-qty-btn" onClick={() => setQuantity(q => Math.min(10, q + 1))} aria-label="Increase quantity">+</button>
          </div>
        </div>

        {/* Delivery Check */}
        <div className="pinfo-section pinfo-delivery">
          <span className="pinfo-label">CHECK DELIVERY</span>
          <div className="pinfo-delivery-row">
            <input
              type="text"
              placeholder="Enter pincode"
              value={pincode}
              onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="pinfo-pincode-input"
              maxLength={6}
              aria-label="Delivery pincode"
            />
            <button onClick={checkDelivery} className="pinfo-check-btn">CHECK</button>
          </div>
          {deliveryMsg && <p className="pinfo-delivery-msg">{deliveryMsg}</p>}
        </div>

        {/* Delivery perks */}
        <div className="pinfo-perks">
          <div className="pinfo-perk">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <span>Free delivery above ₹999</span>
          </div>
          <div className="pinfo-perk">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.4"/></svg>
            <span>7-day hassle-free returns</span>
          </div>
          <div className="pinfo-perk">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <span>Secure payment</span>
          </div>
        </div>
      </div>

      {/* Sticky CTA Bar */}
      <div className="pinfo-sticky-bar">
        <button onClick={() => setWishlist(w => !w)} className="pinfo-wishlist-btn" aria-label="Add to wishlist">
          <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlist ? 'var(--color-ink)' : 'none'} stroke="var(--color-ink)" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button onClick={handleAddToCart} className="pinfo-add-btn" id="add-to-cart-btn">ADD TO BAG</button>
        <button onClick={handleBuyNow} className="pinfo-buy-btn" id="buy-now-btn">BUY NOW</button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .pinfo-root {
          padding-bottom: 100px;
        }
        .pinfo-category {
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.15em;
          color: var(--color-ink-muted);
          margin-bottom: 8px;
        }
        .pinfo-name {
          font-family: var(--font-body);
          font-size: 20px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-ink);
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .pinfo-price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 4px;
        }
        .pinfo-price {
          font-family: var(--font-body);
          font-size: 22px;
          font-weight: 500;
          color: var(--color-ink);
        }
        .pinfo-mrp {
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--color-ink-muted);
          text-decoration: line-through;
        }
        .pinfo-badge {
          background: #2A7A2A;
          color: white;
          font-size: 10px;
          font-family: var(--font-ui);
          letter-spacing: 0.06em;
          padding: 3px 8px;
          border-radius: 2px;
        }
        .pinfo-tax {
          font-size: 10px;
          color: var(--color-ink-muted);
          font-family: var(--font-body);
          margin-bottom: 20px;
        }
        .pinfo-desc {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-ink-muted);
          line-height: 1.8;
          margin-bottom: 28px;
        }
        .pinfo-section {
          margin-bottom: 28px;
        }
        .pinfo-label-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 12px;
        }
        .pinfo-label {
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.15em;
          color: var(--color-ink);
          display: block;
          margin-bottom: 12px;
        }
        .pinfo-label-value {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--color-ink-muted);
        }
        /* Color swatches */
        .pinfo-swatches {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .pinfo-swatch {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s;
          outline: 1px solid rgba(0,0,0,0.15);
        }
        .pinfo-swatch:hover { transform: scale(1.12); }
        .pinfo-swatch--active {
          border-color: var(--color-ink) !important;
          outline: 2px solid var(--color-ink);
          outline-offset: 2px;
        }
        /* Quantity */
        .pinfo-qty {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--color-stone);
          margin-top: 4px;
        }
        .pinfo-qty-btn {
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: var(--color-ink);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .pinfo-qty-btn:hover { background: var(--color-surface); }
        .pinfo-qty-num {
          width: 48px;
          text-align: center;
          font-family: var(--font-body);
          font-size: 14px;
          border-left: 1px solid var(--color-stone);
          border-right: 1px solid var(--color-stone);
          height: 40px;
          line-height: 40px;
        }
        /* Delivery */
        .pinfo-delivery-row {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .pinfo-pincode-input {
          flex: 1;
          border: 1px solid var(--color-stone);
          padding: 10px 14px;
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-ink);
          background: transparent;
          outline: none;
          max-width: 160px;
        }
        .pinfo-pincode-input:focus { border-color: var(--color-ink); }
        .pinfo-check-btn {
          padding: 10px 20px;
          border: 1px solid var(--color-ink);
          background: transparent;
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          color: var(--color-ink);
        }
        .pinfo-check-btn:hover { background: var(--color-ink); color: var(--color-white); }
        .pinfo-delivery-msg {
          margin-top: 8px;
          font-size: 12px;
          font-family: var(--font-body);
          color: #2A7A2A;
        }
        /* Perks */
        .pinfo-perks {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px 0;
          border-top: 1px solid var(--color-stone);
          margin-top: 8px;
        }
        .pinfo-perk {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--color-ink-muted);
        }
        /* Sticky Bar */
        .pinfo-sticky-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--color-bg);
          border-top: 1px solid var(--color-stone);
          padding: 12px var(--container-gutter);
          z-index: 500;
          display: flex;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 -4px 24px rgba(0,0,0,0.06);
        }
        .pinfo-wishlist-btn {
          width: 52px;
          height: 52px;
          border: 1px solid var(--color-stone);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .pinfo-wishlist-btn:hover { background: var(--color-surface); }
        .pinfo-add-btn {
          flex: 1;
          max-width: 280px;
          height: 52px;
          background: var(--color-ink);
          color: var(--color-white);
          border: none;
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .pinfo-add-btn:hover { opacity: 0.85; }
        .pinfo-buy-btn {
          flex: 1;
          max-width: 280px;
          height: 52px;
          background: transparent;
          color: var(--color-ink);
          border: 1px solid var(--color-ink);
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .pinfo-buy-btn:hover { background: var(--color-ink); color: var(--color-white); }
        @media (max-width: 480px) {
          .pinfo-sticky-bar { padding: 10px 16px; }
          .pinfo-add-btn, .pinfo-buy-btn { font-size: 10px; }
        }
      `}} />
    </>
  );
}

