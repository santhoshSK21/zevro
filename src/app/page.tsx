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

// Ensure the homepage always serves fresh layout changes published via the Visual Builder
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dynamic Block Renderer based on Builder schema
const DynamicBlock = ({ block }: { block: any }) => {
  const props = block?.props || {};

  switch (block.type) {
    case 'hero':
      return (
        <HeroSection
          headline={props.headline}
          subheadline={props.subheadline}
          buttonText={props.buttonText}
          buttonLink={props.buttonLink}
          badgeText={props.badgeText}
          imageUrl={props.imageUrl}
        />
      );

    case 'category-grid':
      return (
        <CategoryGrid
          title={props.title}
          subtitle={props.subtitle}
        />
      );

    case 'trust-bar':
      return (
        <TrustBar
          item1={props.item1}
          item2={props.item2}
          item3={props.item3}
          item4={props.item4}
        />
      );

    case 'product-grid':
      return (
        <FeaturedProducts
          title={props.title}
          subtitle={props.subtitle}
          limit={props.limit}
          category={props.category}
        />
      );

    case 'editorial-banner':
      return (
        <EditorialBanner
          tag={props.tag}
          title={props.title}
          description={props.description}
          buttonText={props.buttonText}
          buttonLink={props.buttonLink}
          imageUrl={props.imageUrl}
        />
      );

    case 'brand-story':
      return <BrandStory />;

    case 'bestsellers':
      return <BestsellerSlider />;

    case 'lookbook':
      return <LookbookStrip />;

    case 'testimonials':
      return <Testimonials />;

    case 'newsletter':
      return (
        <NewsletterSection
          headline={props.headline}
          subheadline={props.subheadline}
          buttonText={props.buttonText}
        />
      );

    case 'text':
      return (
        <section
          style={{
            padding: '64px 24px',
            backgroundColor: 'var(--color-bg, #F5F1E8)',
            textAlign: props.align || 'center',
            borderTop: '1px solid var(--color-stone, #E8E2D6)',
            borderBottom: '1px solid var(--color-stone, #E8E2D6)',
          }}
        >
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <p
              style={{
                fontFamily: 'var(--font-display, serif)',
                fontSize: props.fontSize || '22px',
                color: 'var(--color-ink, #1C1C1A)',
                lineHeight: 1.65,
                fontStyle: 'italic',
                letterSpacing: '0.02em',
                margin: 0,
              }}
            >
              "{props.text || 'At ZEVRO, our craft is a testament to the seamless harmony of timeless tradition and contemporary luxury.'}"
            </p>
          </div>
        </section>
      );

    case 'spacer':
      return <div style={{ height: `${props.height || 50}px` }} />;

    default:
      return null;
  }
};

export default async function Home() {
  let homePage: IPage | null = null;
  try {
    await dbConnect();
    homePage = await Page.findOne({ slug: 'home' }).lean();
  } catch (error) {
    // Database decoupled fallback
  }

  // If a published dynamic page exists and has blocks, render it
  if (homePage && homePage.status === 'published' && Array.isArray(homePage.blocks) && homePage.blocks.length > 0) {
    return (
      <div className="dynamic-storefront">
        {homePage.blocks.map((block) => (
          <DynamicBlock key={block.id || `${block.type}-${Math.random()}`} block={block} />
        ))}
      </div>
    );
  }

  // Fallback to the signature luxury static layout if no dynamic layout exists
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <EditorialBanner />
      <BrandStory />
      <TrustBar />
    </>
  );
}
