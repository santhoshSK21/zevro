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

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategoryGrid />
      <FeaturedProducts />
      <EditorialBanner />
      <BestsellerSlider />
      <LookbookStrip />
      <BrandStory />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
