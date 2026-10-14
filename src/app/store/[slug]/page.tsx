'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Mail,
  Truck,
  RotateCcw,
  Sparkles,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpDown,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

interface SellerProfile {
  _id?: string;
  storeName: string;
  slug: string;
  description: string;
  logo?: string;
  banner?: string;
  contactEmail: string;
  city?: string;
  state?: string;
  isVerified: boolean;
  metrics: {
    rating: number;
    ratingCount: number;
    totalSales: number;
  };
  memberSince: string;
}

interface ProductCardData {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  images: string[];
  ratings?: { average: number; count: number };
  isFeatured?: boolean;
  isBestseller?: boolean;
}

export default function StorefrontPage() {
  const params = useParams();
  const rawSlug = params?.slug as string;
  const slug = rawSlug ? decodeURIComponent(rawSlug) : 'zevro-atelier';

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  useEffect(() => {
    let isMounted = true;
    async function loadStore() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/store/${encodeURIComponent(slug)}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('This brand store does not exist or has been moved.');
          } else {
            setError('Unable to load store information right now.');
          }
          return;
        }
        const data = await res.json();
        if (isMounted) {
          setSeller(data.seller);
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Failed to load storefront:', err);
        if (isMounted) setError('Network error loading storefront.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (slug) loadStore();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Extract distinct categories from catalog
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [products]);

  // Filtered & Sorted Catalog
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'ALL') {
      list = list.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', backgroundColor: '#FDFBF7', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #E8E2D6',
              borderTopColor: '#B49A68',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: '#68645C', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
            Opening Brand Storefront...
          </p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', minHeight: '60vh', backgroundColor: '#FDFBF7' }}>
        <div
          style={{
            maxWidth: '520px',
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            borderRadius: '16px',
            padding: '48px 36px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ fontSize: '42px', marginBottom: '16px' }}>🏛️</div>
          <h2
            style={{
              fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
              fontSize: '26px',
              color: '#1C1C1A',
              marginBottom: '12px',
            }}
          >
            Store Not Found
          </h2>
          <p style={{ color: '#68645C', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            {error || 'The brand store you are looking for is currently unavailable or may have updated its profile URL.'}
          </p>
          <Link
            href="/products"
            style={{
              display: 'inline-block',
              backgroundColor: '#1C1C1A',
              color: '#FAF8F5',
              padding: '12px 28px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.04em',
            }}
          >
            Explore All Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#FBF9F4' }}>

      {/* Breadcrumb Navigation */}
      <div style={{ backgroundColor: '#F5F1E8', borderBottom: '1px solid #E8E2D6', padding: '12px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <Link href="/" style={{ color: '#68645C', textDecoration: 'none' }}>
            Home
          </Link>
          <ChevronRight size={12} color="#A8A29E" />
          <Link href="/products" style={{ color: '#68645C', textDecoration: 'none' }}>
            Marketplace
          </Link>
          <ChevronRight size={12} color="#A8A29E" />
          <span style={{ fontWeight: 600, color: '#1C1C1A' }}>{seller.storeName}</span>
        </div>
      </div>

      {/* Amazon-Style Store Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1C1C1A 0%, #2D2C28 100%)',
          color: '#FAF8F5',
          padding: '48px 24px',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid #3F3D37',
        }}
      >
        {/* Subtle decorative gold circle */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(180, 154, 104, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            {/* Left: Brand Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '280px' }}>
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #B49A68 0%, #947846 100%)',
                  color: '#FAF8F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 700,
                  fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  flexShrink: 0,
                }}
              >
                {seller.storeName.charAt(0).toUpperCase()}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h1
                    style={{
                      fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
                      fontSize: '30px',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      margin: 0,
                    }}
                  >
                    {seller.storeName}
                  </h1>
                  {seller.isVerified && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(180, 154, 104, 0.25)',
                        border: '1px solid #B49A68',
                        color: '#E4D5B7',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                      }}
                    >
                      <ShieldCheck size={13} color="#E4D5B7" /> Verified Partner
                    </span>
                  )}
                </div>

                <p
                  style={{
                    color: '#C7C2B6',
                    fontSize: '13px',
                    margin: '8px 0 0',
                    maxWidth: '620px',
                    lineHeight: 1.5,
                  }}
                >
                  {seller.description}
                </p>

                {/* Sub-meta (Rating, City, Member Since) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                    marginTop: '12px',
                    fontSize: '12px',
                    color: '#A8A29E',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#E4D5B7' }}>
                    <Star size={14} fill="#B49A68" stroke="#B49A68" />
                    <strong style={{ color: '#FAF8F5' }}>{seller.metrics.rating.toFixed(1)}</strong>
                    <span>({seller.metrics.ratingCount} reviews)</span>
                  </div>

                  {seller.city && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} />
                      <span>{seller.city}{seller.state ? `, ${seller.state}` : ''}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} />
                    <span>Member since {seller.memberSince}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Inquire / Contact */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={`mailto:${seller.contactEmail}?subject=Inquiry regarding ${encodeURIComponent(seller.storeName)} collection`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FAF8F5',
                  color: '#1C1C1A',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                <Mail size={14} />
                <span>Contact Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Guarantees Strip */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E2D6', padding: '16px 24px' }}>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={18} color="#B49A68" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#1C1C1A' }}>Zevro Express Logistics</div>
              <div style={{ fontSize: '11px', color: '#68645C' }}>Dispatched directly from artisan atelier</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} color="#2E7D32" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#1C1C1A' }}>100% Authentic Quality</div>
              <div style={{ fontSize: '11px', color: '#68645C' }}>Hand-inspected prior to packaging</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RotateCcw size={18} color="#B49A68" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#1C1C1A' }}>7-Day Doorstep Exchange</div>
              <div style={{ fontSize: '11px', color: '#68645C' }}>Hassle-free size & color swaps</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="#B49A68" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#1C1C1A' }}>Artisanal Heritage</div>
              <div style={{ fontSize: '11px', color: '#68645C' }}>Supporting master craft weavers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Section */}
      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '36px 24px', flex: 1 }}>
        {/* Controls Bar: Search + Category Pills + Sort */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            marginBottom: '32px',
          }}
        >
          {/* Top row: search & sort */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
              <Search
                size={16}
                color="#68645C"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder={`Search in ${seller.storeName}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DDD6C8',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#1C1C1A',
                  outline: 'none',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#68645C',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Selector & Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '13px', color: '#68645C' }}>
                Showing <strong>{filteredProducts.length}</strong> creations
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', border: '1px solid #DDD6C8' }}>
                <ArrowUpDown size={13} color="#68645C" />
                <span style={{ fontSize: '11px', color: '#68645C', fontWeight: 600 }}>SORT:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#1C1C1A',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Product Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '24px',
                      fontSize: '12px',
                      fontWeight: isActive ? 600 : 500,
                      cursor: 'pointer',
                      border: isActive ? '1px solid #1C1C1A' : '1px solid #DDD6C8',
                      backgroundColor: isActive ? '#1C1C1A' : '#FFFFFF',
                      color: isActive ? '#FAF8F5' : '#68645C',
                      transition: 'all 0.15s ease',
                      textTransform: 'capitalize',
                    }}
                  >
                    {cat === 'ALL' ? 'All Collections' : cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E8E2D6',
            }}
          >
            <ShoppingBag size={40} color="#B49A68" style={{ margin: '0 auto 16px' }} />
            <h3
              style={{
                fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
                fontSize: '20px',
                color: '#1C1C1A',
                marginBottom: '8px',
              }}
            >
              No items match your selection
            </h3>
            <p style={{ color: '#68645C', fontSize: '13px', marginBottom: '20px' }}>
              Try searching for a different keyword or switch to All Collections.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              style={{
                backgroundColor: '#1C1C1A',
                color: '#FAF8F5',
                padding: '9px 20px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredProducts.map((p) => {
              const image = p.images?.[0] || '/pdp_hero_1.png';
              const discount =
                p.originalPrice > p.price
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 0;

              return (
                <Link
                  key={p._id}
                  href={`/products/${p.slug}`}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E8E2D6',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative',
                  }}
                  className="store-product-card"
                >
                  {/* Image Container */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '125%', // 4:5 aspect ratio
                      backgroundColor: '#F5F1E8',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
                      className="store-card-img"
                    />

                    {/* Top Badges */}
                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {discount > 0 && (
                        <span
                          style={{
                            backgroundColor: '#2E7D32',
                            color: '#FFFFFF',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '3px 7px',
                            borderRadius: '4px',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {discount}% OFF
                        </span>
                      )}
                      {p.isFeatured && (
                        <span
                          style={{
                            backgroundColor: '#B49A68',
                            color: '#FAF8F5',
                            fontSize: '9px',
                            fontWeight: 700,
                            padding: '3px 7px',
                            borderRadius: '4px',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div
                      style={{
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#B49A68',
                        fontWeight: 600,
                        marginBottom: '4px',
                      }}
                    >
                      {p.category || 'Atelier'}
                    </div>

                    <h4
                      style={{
                        fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#1C1C1A',
                        lineHeight: 1.35,
                        margin: '0 0 8px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '40px',
                      }}
                    >
                      {p.name}
                    </h4>

                    {/* Price & Rating */}
                    <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1A' }}>
                          ₹{(p.price / 100).toLocaleString('en-IN')}
                        </span>
                        {p.originalPrice > p.price && (
                          <span style={{ fontSize: '12px', color: '#A8A29E', textDecoration: 'line-through' }}>
                            ₹{(p.originalPrice / 100).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {p.ratings && p.ratings.average > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#68645C', fontWeight: 600 }}>
                          <Star size={11} fill="#B49A68" stroke="#B49A68" />
                          <span>{p.ratings.average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .store-product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .store-product-card:hover .store-card-img {
          transform: scale(1.04);
        }
      `}} />
    </div>
  );
}
