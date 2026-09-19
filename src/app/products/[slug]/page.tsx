'use client';

import React, { useState, useEffect } from 'react';
import ProductGallery from '../../../components/product/ProductGallery';
import ProductInfo from '../../../components/product/ProductInfo';
import ProductAccordion from '../../../components/product/ProductAccordion';
import RelatedProducts from '../../../components/product/RelatedProducts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { productsToInsert } from '../../../lib/mockData';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const productDoc = productsToInsert.find(p => p.slug === slug);
    if (!productDoc) {
      setNotFound(true);
      return;
    }
    const firstVariantImages = productDoc.variants?.[0]?.images || [];
    setProduct({
      _id: productDoc._id?.toString() || productDoc.slug,
      slug: productDoc.slug,
      name: productDoc.name,
      price: productDoc.price,
      originalPrice: productDoc.originalPrice,
      category: productDoc.category,
      description: productDoc.description,
      material: productDoc.material,
      careInstructions: productDoc.careInstructions,
      avgRating: productDoc.avgRating,
      reviewCount: productDoc.reviewCount,
      reviews: productDoc.reviews,
      variants: productDoc.variants,
    });
    setGalleryImages(firstVariantImages);
  }, [slug]);

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', backgroundColor: 'var(--color-bg)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--color-ink)' }}>404</h1>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-muted)' }}>This product could not be found.</p>
        <Link href="/products" style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.1em', borderBottom: '1px solid currentColor', paddingBottom: '2px', color: 'var(--color-ink)' }}>
          BACK TO ALL PRODUCTS
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-muted)' }}>Loading…</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '80px' }}>

      {/* Breadcrumb */}
      <div className="container" style={{ marginBottom: '24px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-ui)' }}>
        <Link href="/" style={{ color: 'var(--color-ink-muted)', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 8px', color: 'var(--color-ink-muted)' }}>/</span>
        <Link href={`/category/${product.category}`} style={{ color: 'var(--color-ink-muted)', textDecoration: 'none' }}>{product.category.replace(/-/g, ' ')}</Link>
        <span style={{ margin: '0 8px', color: 'var(--color-ink-muted)' }}>/</span>
        <span style={{ color: 'var(--color-ink)' }}>{product.name}</span>
      </div>

      {/* Product Main Area */}
      <div className="container" style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '80px' }}>

        {/* Left: Gallery */}
        <div style={{ flex: '1 1 480px', minWidth: '300px' }}>
          <ProductGallery images={galleryImages} />
        </div>

        {/* Right: Info */}
        <div style={{ flex: '1 1 380px', minWidth: '300px' }}>
          <ProductInfo
            product={product}
            onColorChange={(images) => setGalleryImages(images)}
          />
          <div style={{ marginTop: '32px' }}>
            <ProductAccordion product={product} />
          </div>
        </div>

      </div>

      {/* Related Products */}
      <RelatedProducts category={product.category} />

    </div>
  );
}

