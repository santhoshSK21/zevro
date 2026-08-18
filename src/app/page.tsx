import React from 'react';
import HeroSection from '../components/home/HeroSection';
import TrustBar from '../components/home/TrustBar';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProducts from '../components/home/FeaturedProducts';
import EditorialBanner from '../components/home/EditorialBanner';
import BestsellerSlider from '../components/home/BestsellerSlider';
import LookbookStrip from '../components/home/LookbookStrip';
import BrandStory from '../components/home/BrandStory';
import Testimonials from '../components/home/Testimonials';
import NewsletterSection from '../components/home/NewsletterSection';

import dbConnect from '../lib/mongodb';
import { Page, IPage } from '../models/Page';

// Dynamic Block Renderer based on Builder schema
const DynamicBlock = ({ block }: { block: any }) => {
  switch (block.type) {
    case 'hero':
      return (
        <div className="relative w-full h-[80vh] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${block.props.imageUrl})` }}>
           <div className="absolute inset-0 bg-black bg-opacity-30"></div>
           <div className="relative z-10 text-center text-white p-4">
             <h1 className="text-5xl md:text-7xl font-display mb-4 uppercase tracking-wider">{block.props.headline}</h1>
             <p className="text-lg md:text-xl font-body max-w-2xl mx-auto">{block.props.subheadline}</p>
           </div>
        </div>
      );
    case 'product-grid':
      // Currently just uses the existing FeaturedProducts component but we could pass down limit/title
      return (
        <div className="my-16">
          <h2 className="text-3xl text-center font-display mb-8">{block.props.title}</h2>
          <FeaturedProducts /> 
        </div>
      );
    case 'text':
      return (
        <div className="container mx-auto my-16 px-4" style={{ textAlign: block.props.align || 'left' }}>
          <p className="text-lg md:text-xl font-body text-gray-800 max-w-3xl mx-auto leading-relaxed whitespace-pre-wrap">
            {block.props.text}
          </p>
        </div>
      );
    case 'spacer':
      return <div style={{ height: `${block.props.height || 50}px` }}></div>;
    default:
      return null;
  }
};

export default async function Home() {
  await dbConnect();
  
  // Try to fetch dynamic 'home' page layout built in the Admin Panel
  let homePage: IPage | null = null;
  try {
    homePage = await Page.findOne({ slug: 'home' }).lean();
  } catch (error) {
    console.error("Failed to fetch dynamic home page layout", error);
  }

  // If a published dynamic page exists and has blocks, render it
  if (homePage && homePage.status === 'published' && homePage.blocks && homePage.blocks.length > 0) {
    return (
      <div className="dynamic-storefront">
        {homePage.blocks.map((block) => (
          <DynamicBlock key={block.id} block={block} />
        ))}
      </div>
    );
  }

  // Fallback to the beautiful Zara-like static layout if no dynamic layout exists
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CategoryGrid />
    </>
  );
}
