import React from 'react';
import ProductListLayout from '../../../components/product/ProductListLayout';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryTitle = category.replace(/-/g, ' ').toUpperCase();

  return (
    <ProductListLayout 
      initialCategory={category}
      eyebrow="Shop By Category"
      title={categoryTitle}
      description="Tradition in a modern light. Explore our curated signature selection."
    />
  );
}
