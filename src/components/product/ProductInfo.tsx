'use client';

import React, { useState } from 'react';
import SizeSelector from './SizeSelector';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useRouter } from 'next/navigation';
import { useUiStore } from '../../store/uiStore';
import { Heart, ShoppingBag, Zap, ShieldCheck, Truck, RefreshCw, CheckCircle2, Ruler, Sparkles } from 'lucide-react';

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
    <div className="pinfo-rating-row">
      <div className="pinfo-stars">
        {[1, 2, 3, 4, 5].map(n => (
          <svg
            key={n}
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={n <= full ? '#C5A869' : n === full + 1 && half ? 'url(#pinfo-half)' : 'none'}
            stroke="#C5A869"
            strokeWidth="1.5"
          >
            <defs>
              <linearGradient id="pinfo-half">
                <stop offset="50%" stopColor="#C5A869" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        ))}
      </div>
      <span className="pinfo-rating-score">{rating}</span>
      <span className="pinfo-review-count">({count} verified reviews)</span>
    </div>
  );
}

export default function ProductInfo({ product, onColorChange }: ProductInfoProps) {
  const variants: Variant[] = product.variants || [];
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryMsg, setDeliveryMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const { addItem, openDrawer } = useCartStore();
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const router = useRouter();

  const productId = product._id?.toString() || product.slug;
  const isSaved = isWishlisted(productId);

  const activeVariant = variants[activeVariantIdx] || {
    colorName: 'Standard',
    colorHex: '#000',
    images: [],
    sizes: []
  };

  const sizes = activeVariant.sizes.map((s: any) => ({
    size: s.size,
    inStock: s.stock > 0
  }));

  const handleColorSelect = (idx: number) => {
    setActiveVariantIdx(idx);
    setSelectedSize(null);
    if (onColorChange && variants[idx]?.images) {
      onColorChange(variants[idx].images);
    }
  };

  const buildCartItem = () => ({
    productId,
    variantId: `${product.slug}-${activeVariant.colorName}`,
    sku: `${product.slug}-${activeVariant.colorName}-${selectedSize || 'Standard'}`,
    name: product.name,
    image: activeVariant.images?.[0] || product.images?.[0] || '',
    color: activeVariant.colorName,
    size: selectedSize!,
    quantity,
    price: product.price,
    originalPrice: product.originalPrice,
  });

  const handleAddToCart = () => {
    if (!selectedSize) {
      useUiStore.getState().addToast('Please select a size first', 'error');
      return;
    }
    addItem(buildCartItem());
    useUiStore.getState().addToast(`Added "${product.name}" (${selectedSize}) to bag`);
    openDrawer();
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      useUiStore.getState().addToast('Please select a size first', 'error');
      return;
    }
    addItem(buildCartItem());
    router.push('/checkout');
  };

  const handleToggleWishlist = () => {
    toggleWishlist(productId);
    if (!isSaved) {
      useUiStore.getState().addToast('Saved to your wishlist');
    } else {
      useUiStore.getState().addToast('Removed from wishlist');
    }
  };

  const checkDelivery = () => {
    if (pincode.length !== 6) {
      setDeliveryMsg({ text: 'Please enter a valid 6-digit Indian postal code.', success: false });
      return;
    }
    const days = Math.floor(Math.random() * 2) + 3;
    const date = new Date();
    date.setDate(date.getDate() + days);
    const formattedDate = date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    setDeliveryMsg({
      text: `Complimentary Express Delivery by ${formattedDate}`,
      success: true
    });
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const savingsAmount = hasDiscount ? (product.originalPrice - product.price) / 100 : 0;

  return (
    <>
      <div className="pinfo-root">
        {/* Department & Stock Badge */}
        <div className="pinfo-top-meta">
          <span className="pinfo-category-tag">
            {(product.category || '').replace(/-/g, ' ').toUpperCase()}
          </span>
          <span className="pinfo-stock-badge">
            <span className="stock-pulse-dot" />
            READY FOR DISPATCH
          </span>
        </div>

        {/* Product Title */}
        <h1 className="pinfo-name">{product.name}</h1>

        {/* Ratings and Reviews */}
        {product.avgRating ? (
          <StarRating rating={product.avgRating} count={product.reviewCount || 12} />
        ) : (
          <div className="pinfo-rating-row">
            <div className="pinfo-stars">
              {[1, 2, 3, 4, 5].map(n => (
                <svg key={n} width="13" height="13" viewBox="0 0 24 24" fill="#C5A869" stroke="#C5A869" strokeWidth="1.5">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              ))}
            </div>
            <span className="pinfo-rating-score">4.9</span>
            <span className="pinfo-review-count">(Atelier Signature Quality)</span>
          </div>
        )}

        {/* Pricing Architecture */}
        <div className="pinfo-price-card">
          <div className="pinfo-price-row">
            <span className="pinfo-selling-price">
              ₹{(product.price / 100).toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <>
                <span className="pinfo-original-price">
                  ₹{(product.originalPrice / 100).toLocaleString('en-IN')}
                </span>
                <span className="pinfo-savings-pill">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {hasDiscount && (
            <p className="pinfo-savings-text">
              ✦ You save <strong>₹{savingsAmount.toLocaleString('en-IN')}</strong> on this handcrafted piece
            </p>
          )}

          <div className="pinfo-tax-guarantee">
            <span>Inclusive of all taxes & duties</span>
            <span>•</span>
            <span className="free-shipping-tag">Complimentary Express Shipping</span>
          </div>
        </div>

        {/* Description Snippet */}
        {product.description && (
          <p className="pinfo-desc">{product.description}</p>
        )}

        {/* Color Palette Switcher */}
        {variants.length > 1 && (
          <div className="pinfo-section">
            <div className="pinfo-label-row">
              <span className="pinfo-label">
                ATELIER COLOR: <strong>{activeVariant.colorName}</strong>
              </span>
            </div>
            <div className="pinfo-swatches">
              {variants.map((v, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleColorSelect(idx)}
                  className={`pinfo-swatch ${idx === activeVariantIdx ? 'pinfo-swatch--active' : ''}`}
                  style={{ backgroundColor: v.colorHex || '#141412' }}
                  title={v.colorName}
                  aria-label={`Select shade ${v.colorName}`}
                >
                  {idx === activeVariantIdx && <span className="swatch-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        <div className="pinfo-section">
          <div className="size-header-bar">
            <span className="pinfo-label">
              SELECT SIZE: <strong>{selectedSize || 'PLEASE CHOOSE'}</strong>
            </span>
            <button
              type="button"
              onClick={() => setShowSizeGuide(true)}
              className="pinfo-size-guide-btn"
            >
              <Ruler size={13} />
              <span>SIZE GUIDE</span>
            </button>
          </div>
          <SizeSelector sizes={sizes} selected={selectedSize} onChange={setSelectedSize} />
        </div>

        {/* Quantity Stepper */}
        <div className="pinfo-section pinfo-qty-section">
          <span className="pinfo-label">QUANTITY</span>
          <div className="pinfo-qty-row">
            <div className="pinfo-qty-stepper">
              <button
                type="button"
                className="pinfo-qty-btn"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="pinfo-qty-num">{quantity}</span>
              <button
                type="button"
                className="pinfo-qty-btn"
                onClick={() => setQuantity(q => Math.min(10, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <span className="pinfo-stock-note">
              Limited artisanal production run
            </span>
          </div>
        </div>

        {/* Desktop Primary Action Buttons */}
        <div className="pinfo-desktop-actions">
          <button
            type="button"
            onClick={handleAddToCart}
            className="pinfo-main-add-btn"
            id="add-to-cart-btn"
          >
            <ShoppingBag size={17} />
            <span>ADD TO BAG</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="pinfo-main-buy-btn"
            id="buy-now-btn"
          >
            <Zap size={17} />
            <span>BUY NOW</span>
          </button>

          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`pinfo-main-wish-btn ${isSaved ? 'is-saved' : ''}`}
            aria-label="Toggle wishlist"
            title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart size={20} fill={isSaved ? '#C5A869' : 'none'} color={isSaved ? '#C5A869' : 'currentColor'} />
          </button>
        </div>

        {/* Postal Delivery Estimation */}
        <div className="pinfo-delivery-card">
          <div className="delivery-card-header">
            <Truck size={16} className="text-gold" />
            <span className="pinfo-label" style={{ margin: 0 }}>CHECK ESTIMATED DELIVERY</span>
          </div>
          <div className="pinfo-delivery-row">
            <input
              type="text"
              placeholder="Enter 6-digit pincode"
              value={pincode}
              onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="pinfo-pincode-input"
              maxLength={6}
              aria-label="Delivery pincode"
            />
            <button type="button" onClick={checkDelivery} className="pinfo-check-btn">
              CHECK
            </button>
          </div>

          {deliveryMsg && (
            <div className={`pinfo-delivery-msg ${deliveryMsg.success ? 'msg-success' : 'msg-error'}`}>
              {deliveryMsg.success ? <CheckCircle2 size={14} /> : <span>✕</span>}
              <span>{deliveryMsg.text}</span>
            </div>
          )}
        </div>

        {/* Verified Merchant & Atelier Guarantee Card */}
        <div className="pinfo-merchant-card">
          <div className="merchant-card-row">
            <div className="merchant-card-avatar">🏛️</div>
            <div className="merchant-card-details">
              <div className="merchant-card-soldby">
                Curated by{' '}
                <span className="merchant-store-highlight">
                  {product.sellerStoreName || 'ZEVRO Signature Atelier'}
                </span>
              </div>
              <div className="merchant-card-fulfilled">
                Fulfilled directly via <strong>ZEVRO Priority Logistics</strong>
              </div>
            </div>
            <span className="merchant-verified-seal">
              ✓ Verified Atelier
            </span>
          </div>
          <div className="merchant-card-guarantees">
            <span><Sparkles size={12} className="text-gold" /> 100% Authentic Handcrafted Piece</span>
            <span><RefreshCw size={12} className="text-gold" /> 7-Day Concierge Doorstep Exchange</span>
          </div>
        </div>

        {/* Brand Perks Strip */}
        <div className="pinfo-perks">
          <div className="pinfo-perk">
            <Truck size={16} className="text-gold" />
            <span>Complimentary worldwide express on orders above ₹999</span>
          </div>
          <div className="pinfo-perk">
            <RefreshCw size={16} className="text-gold" />
            <span>7-day hassle-free returns with doorstep pickup</span>
          </div>
          <div className="pinfo-perk">
            <ShieldCheck size={16} className="text-gold" />
            <span>End-to-end 256-bit encrypted checkout</span>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Floating Purchase Bar (Offset above Mobile Bottom Nav) */}
      <div className="pinfo-mobile-sticky-bar">
        <div className="mobile-bar-summary">
          <span className="mobile-bar-price">
            ₹{(product.price / 100).toLocaleString('en-IN')}
          </span>
          <span className="mobile-bar-size">
            {selectedSize ? `Size: ${selectedSize}` : 'Select Size'}
          </span>
        </div>

        <div className="mobile-bar-actions">
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`mobile-bar-wish ${isSaved ? 'is-saved' : ''}`}
            aria-label="Wishlist"
          >
            <Heart size={18} fill={isSaved ? '#C5A869' : 'none'} color={isSaved ? '#C5A869' : 'currentColor'} />
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="mobile-bar-add"
          >
            ADD TO BAG
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="mobile-bar-buy"
          >
            BUY NOW
          </button>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="size-guide-modal-backdrop" onClick={() => setShowSizeGuide(false)}>
          <div className="size-guide-modal-card" onClick={e => e.stopPropagation()}>
            <div className="size-guide-header">
              <h3 className="size-guide-title">ZEVRO ATELIER SIZE MATRIX</h3>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="size-guide-close-btn"
                aria-label="Close size guide"
              >
                ✕
              </button>
            </div>
            <p className="size-guide-desc">
              All dimensions are measured in inches. Garments are hand-tailored with a modern luxury drape.
            </p>
            <div className="size-guide-table-wrap">
              <table className="size-guide-table">
                <thead>
                  <tr>
                    <th>SIZE</th>
                    <th>BUST</th>
                    <th>WAIST</th>
                    <th>HIP</th>
                    <th>LENGTH</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>XS</strong></td>
                    <td>32"</td>
                    <td>26"</td>
                    <td>36"</td>
                    <td>42"</td>
                  </tr>
                  <tr>
                    <td><strong>S</strong></td>
                    <td>34"</td>
                    <td>28"</td>
                    <td>38"</td>
                    <td>42.5"</td>
                  </tr>
                  <tr>
                    <td><strong>M</strong></td>
                    <td>36"</td>
                    <td>30"</td>
                    <td>40"</td>
                    <td>43"</td>
                  </tr>
                  <tr>
                    <td><strong>L</strong></td>
                    <td>38"</td>
                    <td>32"</td>
                    <td>42"</td>
                    <td>43.5"</td>
                  </tr>
                  <tr>
                    <td><strong>XL</strong></td>
                    <td>40"</td>
                    <td>34"</td>
                    <td>44"</td>
                    <td>44"</td>
                  </tr>
                  <tr>
                    <td><strong>XXL</strong></td>
                    <td>42"</td>
                    <td>36"</td>
                    <td>46"</td>
                    <td>44"</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="size-guide-footer">
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="size-guide-confirm-btn"
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .pinfo-root {
          padding-bottom: 40px;
        }
        .pinfo-top-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .pinfo-category-tag {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--color-accent);
          font-weight: 700;
        }
        .pinfo-stock-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.08em;
          color: #2E7D32;
          background: rgba(46, 125, 50, 0.08);
          border: 1px solid rgba(46, 125, 50, 0.2);
          padding: 3px 8px;
          border-radius: 12px;
          font-weight: 600;
        }
        .stock-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2E7D32;
        }
        .pinfo-name {
          font-family: var(--font-display);
          font-size: clamp(22px, 2.6vw, 32px);
          font-weight: 400;
          color: var(--color-ink);
          letter-spacing: -0.01em;
          line-height: 1.2;
          margin: 0 0 12px 0;
        }
        .pinfo-rating-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .pinfo-stars {
          display: flex;
          gap: 2px;
        }
        .pinfo-rating-score {
          font-family: var(--font-ui);
          font-size: 12px;
          font-weight: 700;
          color: var(--color-ink);
        }
        .pinfo-review-count {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--color-ink-muted);
        }
        .pinfo-price-card {
          background: var(--color-surface);
          border: 1px solid var(--color-stone);
          border-radius: 6px;
          padding: 16px 20px;
          margin-bottom: 24px;
        }
        .pinfo-price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }
        .pinfo-selling-price {
          font-family: var(--font-display);
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 600;
          color: var(--color-ink);
        }
        .pinfo-original-price {
          font-family: var(--font-body);
          font-size: 16px;
          color: var(--color-ink-muted);
          text-decoration: line-through;
        }
        .pinfo-savings-pill {
          background: #2E7D32;
          color: #FFFFFF;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .pinfo-savings-text {
          font-family: var(--font-body);
          font-size: 12px;
          color: #2E7D32;
          margin: 8px 0 0 0;
        }
        .pinfo-tax-guarantee {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-ui);
          font-size: 11px;
          color: var(--color-ink-muted);
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px dashed var(--color-stone);
          flex-wrap: wrap;
        }
        .free-shipping-tag {
          color: var(--color-accent);
          font-weight: 600;
        }
        .pinfo-desc {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-ink-muted);
          line-height: 1.7;
          margin-bottom: 24px;
        }
        .pinfo-section {
          margin-bottom: 24px;
        }
        .pinfo-label-row, .size-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .pinfo-label {
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink);
        }
        .pinfo-size-guide-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: none;
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.08em;
          color: var(--color-accent);
          font-weight: 600;
          cursor: pointer;
          border-bottom: 1px solid currentColor;
          padding-bottom: 1px;
        }
        .pinfo-swatches {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .pinfo-swatch {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid #FFFFFF;
          box-shadow: 0 0 0 1px var(--color-stone);
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .pinfo-swatch:hover {
          transform: scale(1.1);
        }
        .pinfo-swatch--active {
          box-shadow: 0 0 0 2px var(--color-ink);
        }
        .swatch-check {
          color: #FFFFFF;
          font-size: 12px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.6);
        }
        .pinfo-qty-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 8px;
        }
        .pinfo-qty-stepper {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--color-stone);
          border-radius: 4px;
          background: var(--color-surface);
        }
        .pinfo-qty-btn {
          width: 36px;
          height: 36px;
          background: transparent;
          border: none;
          color: var(--color-ink);
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .pinfo-qty-btn:hover {
          background: var(--color-stone-light);
        }
        .pinfo-qty-num {
          width: 40px;
          text-align: center;
          font-family: var(--font-ui);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-ink);
        }
        .pinfo-stock-note {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--color-ink-muted);
          font-style: italic;
        }
        .pinfo-desktop-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }
        .pinfo-main-add-btn {
          flex: 2;
          height: 50px;
          background: #141412;
          color: #FAF7F2;
          border: none;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: var(--font-ui);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .pinfo-main-add-btn:hover {
          background: var(--color-accent);
          color: #141412;
          box-shadow: 0 8px 24px rgba(197, 168, 105, 0.3);
        }
        .pinfo-main-buy-btn {
          flex: 2;
          height: 50px;
          background: var(--color-accent);
          color: #141412;
          border: none;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: var(--font-ui);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .pinfo-main-buy-btn:hover {
          background: #B39556;
          box-shadow: 0 8px 24px rgba(197, 168, 105, 0.4);
        }
        .pinfo-main-wish-btn {
          width: 50px;
          height: 50px;
          border: 1px solid var(--color-stone);
          background: var(--color-surface);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-ink);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .pinfo-main-wish-btn:hover,
        .pinfo-main-wish-btn.is-saved {
          border-color: var(--color-accent);
          background: #FFF;
        }
        .pinfo-delivery-card {
          background: var(--color-surface);
          border: 1px solid var(--color-stone);
          border-radius: 6px;
          padding: 16px 20px;
          margin-bottom: 24px;
        }
        .delivery-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .text-gold {
          color: var(--color-accent);
        }
        .pinfo-delivery-row {
          display: flex;
          gap: 10px;
        }
        .pinfo-pincode-input {
          flex: 1;
          height: 42px;
          border: 1px solid var(--color-stone);
          border-radius: 4px;
          padding: 0 14px;
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-ink);
          background: #FFFFFF;
          outline: none;
        }
        .pinfo-pincode-input:focus {
          border-color: var(--color-accent);
        }
        .pinfo-check-btn {
          height: 42px;
          padding: 0 20px;
          background: #141412;
          color: #FAF7F2;
          border: none;
          border-radius: 4px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
        }
        .pinfo-check-btn:hover {
          background: var(--color-accent);
          color: #141412;
        }
        .pinfo-delivery-msg {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 12px;
          margin-top: 10px;
        }
        .msg-success {
          color: #2E7D32;
        }
        .msg-error {
          color: #D32F2F;
        }
        .pinfo-merchant-card {
          background: var(--color-surface);
          border: 1px solid var(--color-stone);
          border-radius: 6px;
          padding: 16px 18px;
          margin-bottom: 24px;
        }
        .merchant-card-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .merchant-card-avatar {
          font-size: 22px;
        }
        .merchant-card-details {
          flex: 1;
        }
        .merchant-card-soldby {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-ink);
        }
        .merchant-store-highlight {
          font-weight: 700;
        }
        .merchant-card-fulfilled {
          font-size: 11px;
          color: var(--color-ink-muted);
          margin-top: 2px;
        }
        .merchant-verified-seal {
          font-family: var(--font-ui);
          font-size: 10px;
          font-weight: 700;
          color: #2E7D32;
          background: rgba(46, 125, 50, 0.08);
          border: 1px solid rgba(46, 125, 50, 0.25);
          padding: 3px 8px;
          border-radius: 12px;
        }
        .merchant-card-guarantees {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px dashed var(--color-stone);
          font-size: 11px;
          color: var(--color-ink-muted);
          flex-wrap: wrap;
        }
        .merchant-card-guarantees span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .pinfo-perks {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px 0;
          border-top: 1px solid var(--color-stone);
        }
        .pinfo-perk {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--color-ink-muted);
        }
        /* Mobile Sticky Floating Purchase Bar */
        .pinfo-mobile-sticky-bar {
          display: none;
        }
        @media (max-width: 900px) {
          .pinfo-mobile-sticky-bar {
            display: flex;
            position: fixed;
            bottom: calc(56px + env(safe-area-inset-bottom, 0px));
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(250, 248, 245, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-top: 1px solid var(--color-stone);
            padding: 10px 16px;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
          }
          .mobile-bar-summary {
            display: flex;
            flex-direction: column;
          }
          .mobile-bar-price {
            font-family: var(--font-display);
            font-size: 16px;
            font-weight: 700;
            color: var(--color-ink);
          }
          .mobile-bar-size {
            font-family: var(--font-ui);
            font-size: 10px;
            letter-spacing: 0.05em;
            color: var(--color-ink-muted);
          }
          .mobile-bar-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .mobile-bar-wish {
            width: 40px;
            height: 40px;
            border-radius: 4px;
            border: 1px solid var(--color-stone);
            background: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--color-ink);
          }
          .mobile-bar-add {
            padding: 10px 16px;
            background: #141412;
            color: #FAF7F2;
            border: none;
            border-radius: 4px;
            font-family: var(--font-ui);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.08em;
            cursor: pointer;
          }
          .mobile-bar-buy {
            padding: 10px 16px;
            background: var(--color-accent);
            color: #141412;
            border: none;
            border-radius: 4px;
            font-family: var(--font-ui);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.08em;
            cursor: pointer;
          }
        }
        /* Size Guide Modal */
        .size-guide-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 3000;
          background: rgba(20, 20, 18, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .size-guide-modal-card {
          background: #FFFFFF;
          border-radius: 6px;
          padding: 24px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 16px 48px rgba(0,0,0,0.2);
        }
        .size-guide-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--color-stone);
        }
        .size-guide-title {
          font-family: var(--font-ui);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--color-ink);
          margin: 0;
        }
        .size-guide-close-btn {
          background: transparent;
          border: none;
          font-size: 16px;
          color: var(--color-ink-muted);
          cursor: pointer;
        }
        .size-guide-desc {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--color-ink-muted);
          margin: 0 0 16px 0;
          line-height: 1.5;
        }
        .size-guide-table-wrap {
          overflow-x: auto;
          margin-bottom: 20px;
        }
        .size-guide-table {
          width: 100%;
          border-collapse: collapse;
          text-align: center;
          font-size: 12px;
        }
        .size-guide-table th {
          background: var(--color-surface);
          padding: 8px;
          font-family: var(--font-ui);
          font-weight: 700;
          letter-spacing: 0.08em;
          border: 1px solid var(--color-stone);
        }
        .size-guide-table td {
          padding: 8px;
          border: 1px solid var(--color-stone);
          font-family: var(--font-body);
        }
        .size-guide-footer {
          text-align: right;
        }
        .size-guide-confirm-btn {
          padding: 8px 24px;
          background: #141412;
          color: #FAF7F2;
          border: none;
          border-radius: 4px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
        }
      `}} />
    </>
  );
}
