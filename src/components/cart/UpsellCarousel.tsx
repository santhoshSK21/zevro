'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '../../store/cartStore';
import { Plus, Check, Sparkles } from 'lucide-react';

export default function UpsellCarousel() {
  const [products, setProducts] = useState<any[]>([]);
  const { addItem, items } = useCartStore();
  const [addedSkus, setAddedSkus] = useState<string[]>([]);

  useEffect(() => {
    // Fetch live products from store API or fallback to curated accessories
    async function loadUpsellProducts() {
      try {
        const res = await fetch('/api/products?limit=6');
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          // Filter out items already in cart
          const cartProductIds = items.map(i => i.productId);
          const available = data.products.filter((p: any) => !cartProductIds.includes(p._id?.toString()));
          setProducts(available.slice(0, 4));
          return;
        }
      } catch (e) {}

      // Curated fallbacks with reliable images
      setProducts([
        {
          _id: 'upsell-1',
          sku: 'upsell-dupatta-01',
          slug: 'embroidered-raw-silk-kurta',
          name: 'Handcrafted Silk Dupatta',
          price: 189000,
          originalPrice: 249000,
          images: ['https://res.cloudinary.com/ewajspeh/image/upload/v1790010265/zevro_products/yrvoocxavlzfgdokjlu7.png']
        },
        {
          _id: 'upsell-2',
          sku: 'upsell-earrings-02',
          slug: 'raw-silk-bandhgala-jacket',
          name: 'Gold Filigree Drop Earrings',
          price: 99000,
          originalPrice: 149000,
          images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80']
        },
        {
          _id: 'upsell-3',
          sku: 'upsell-clutch-03',
          slug: 'zardozi-velvet-sherwani',
          name: 'Embroidered Velvet Potli',
          price: 149000,
          originalPrice: 199000,
          images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80']
        }
      ]);
    }

    loadUpsellProducts();
  }, [items]);

  if (products.length === 0) return null;

  const handleQuickAdd = (product: any) => {
    const primaryImg = product.images?.[0] || product.image || '/pdp_hero_1.png';
    const sku = product.variants?.[0]?.sizes?.[0]?.sku || product.sku || `${product._id}-quick`;
    
    addItem({
      productId: product._id?.toString() || product.sku,
      variantId: product.variants?.[0]?._id?.toString() || product.slug,
      sku,
      name: product.name,
      image: primaryImg,
      color: product.variants?.[0]?.color?.name || 'Classic',
      size: product.variants?.[0]?.sizes?.[0]?.size || 'One Size',
      quantity: 1,
      price: product.price,
      originalPrice: product.originalPrice || product.price
    });

    setAddedSkus(prev => [...prev, sku]);
    setTimeout(() => {
      setAddedSkus(prev => prev.filter(s => s !== sku));
    }, 2000);
  };

  return (
    <div className="upsell-section">
      <div className="upsell-header">
        <div className="upsell-eyebrow">
          <Sparkles size={13} className="text-gold" />
          <span>CURATED PAIRINGS</span>
        </div>
        <h3 className="upsell-title">Complete Your Look</h3>
        <p className="upsell-desc">Stylist-recommended accessories and layers to accompany your selection.</p>
      </div>

      <div className="upsell-grid">
        {products.map(p => {
          const img = p.images?.[0] || p.image || '/pdp_hero_1.png';
          const sku = p.variants?.[0]?.sizes?.[0]?.sku || p.sku || `${p._id}-quick`;
          const isAdded = addedSkus.includes(sku);

          return (
            <div key={p._id || p.sku} className="upsell-card">
              <Link href={`/products/${p.slug || p._id}`} className="upsell-img-wrap">
                <Image
                  src={img}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 160px, 200px"
                  className="upsell-img"
                />
              </Link>

              <div className="upsell-details">
                <Link href={`/products/${p.slug || p._id}`} className="upsell-name">
                  {p.name}
                </Link>
                
                <div className="upsell-pricing">
                  <span className="upsell-price">₹{(p.price / 100).toLocaleString('en-IN')}</span>
                  {p.originalPrice > p.price && (
                    <span className="upsell-mrp">₹{(p.originalPrice / 100).toLocaleString('en-IN')}</span>
                  )}
                </div>

                <button
                  onClick={() => handleQuickAdd(p)}
                  className={`upsell-add-btn ${isAdded ? 'added' : ''}`}
                >
                  {isAdded ? (
                    <>
                      <Check size={13} />
                      <span>ADDED</span>
                    </>
                  ) : (
                    <>
                      <Plus size={13} />
                      <span>ADD TO BAG</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .upsell-section {
          margin-top: 40px;
          padding-top: 32px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }
        .upsell-header {
          margin-bottom: 24px;
        }
        .upsell-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #C5A880;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .upsell-title {
          font-family: var(--font-display, serif);
          font-size: 20px;
          letter-spacing: 0.06em;
          color: #121210;
          margin: 0 0 4px 0;
          font-weight: 600;
        }
        .upsell-desc {
          font-size: 12px;
          color: #777;
          margin: 0;
        }

        /* Upsell Grid */
        .upsell-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
          width: 100%;
        }
        @media (max-width: 600px) {
          .upsell-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        .upsell-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .upsell-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        }
        .upsell-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          background: #F4F1EC;
          overflow: hidden;
          display: block;
        }
        .upsell-img {
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .upsell-card:hover .upsell-img {
          transform: scale(1.04);
        }

        .upsell-details {
          padding: 12px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .upsell-name {
          font-size: 12px;
          font-weight: 500;
          color: #121210;
          text-decoration: none;
          line-height: 1.4;
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 34px;
        }
        .upsell-name:hover {
          color: #C5A880;
        }
        .upsell-pricing {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .upsell-price {
          font-size: 13px;
          font-weight: 700;
          color: #121210;
          font-family: var(--font-ui, sans-serif);
        }
        .upsell-mrp {
          font-size: 11px;
          color: #999;
          text-decoration: line-through;
        }

        .upsell-add-btn {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 8px;
          border-radius: 4px;
          background: #121210;
          color: #FAF8F5;
          border: none;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .upsell-add-btn:hover {
          background: #C5A880;
          color: #121210;
        }
        .upsell-add-btn.added {
          background: #16A34A;
          color: #FFFFFF;
        }
      `}} />
    </div>
  );
}

