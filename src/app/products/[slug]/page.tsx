import React from 'react';
import ProductGallery from '../../../components/product/ProductGallery';
import ProductInfo from '../../../components/product/ProductInfo';
import ProductAccordion from '../../../components/product/ProductAccordion';
import RelatedProducts from '../../../components/product/RelatedProducts';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  // In a real app, you would fetch product data server-side here using params.slug
  const mockProduct = {
    _id: '123',
    slug: params.slug,
    name: 'LUXURY SILK ENSEMBLE',
    price: 499900,
    originalPrice: 650000,
    category: 'ethnic-wear',
    color: 'Ivory / Gold',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80'
    ]
  };

  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', paddingTop: '100px' }}>
      
      {/* Breadcrumb */}
      <div className="container" style={{ marginBottom: '32px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        <span style={{ color: 'var(--warm-grey)' }}>HOME / {mockProduct.category.replace('-', ' ')} / </span>
        <span style={{ color: 'var(--espresso)', fontWeight: 600 }}>{mockProduct.name}</span>
      </div>

      {/* Product Main Area */}
      <div className="container" style={{ display: 'flex', gap: '64px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '80px' }}>
        
        {/* Left: Gallery */}
        <div style={{ flex: '1 1 500px', minWidth: '320px' }}>
          <ProductGallery images={mockProduct.images} />
        </div>

        {/* Right: Info */}
        <div style={{ flex: '1 1 400px', minWidth: '320px', position: 'sticky', top: '100px' }}>
          <ProductInfo product={mockProduct} />
          
          <div style={{ marginTop: '40px' }}>
            <ProductAccordion />
          </div>
        </div>

      </div>

      {/* Related Products */}
      <RelatedProducts category={mockProduct.category} />

    </div>
  );
}
