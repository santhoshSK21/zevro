import React from 'react';
import ProductGallery from '../../../components/product/ProductGallery';
import ProductInfo from '../../../components/product/ProductInfo';
import ProductAccordion from '../../../components/product/ProductAccordion';
import RelatedProducts from '../../../components/product/RelatedProducts';
import dbConnect from '../../../lib/mongodb';
import { Product } from '../../../models/Product';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await dbConnect();
  
  // Use param explicitly via await to comply with Next.js 15+ async params
  const { slug } = await params;
  
  const productDoc = await Product.findOne({ slug }).lean();
  
  if (!productDoc) {
    notFound();
  }

  const mockProduct = {
    _id: productDoc._id?.toString() || '123',
    slug: productDoc.slug,
    name: productDoc.name,
    price: productDoc.price,
    originalPrice: productDoc.originalPrice,
    category: productDoc.category,
    color: productDoc.variants?.[0]?.colorName || 'Standard',
    images: productDoc.variants?.[0]?.images || [],
    description: productDoc.description,
    sizes: productDoc.variants?.[0]?.sizes?.map((s: any) => ({ size: s.size, stock: s.stock })) || [],
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
