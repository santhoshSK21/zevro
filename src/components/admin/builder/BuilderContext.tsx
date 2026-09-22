'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BuilderComponent, BuilderState, ComponentType } from './types';
import { arrayMove } from '@dnd-kit/sortable';

interface BuilderContextType extends BuilderState {
  addComponent: (type: ComponentType, index?: number) => void;
  removeComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  updateComponentProps: (id: string, newProps: Record<string, any>) => void;
  moveComponent: (oldIndex: number, newIndex: number) => void;
  setSelectedId: (id: string | null) => void;
  deviceView: 'desktop' | 'tablet' | 'mobile';
  setDeviceView: (v: 'desktop' | 'tablet' | 'mobile') => void;
  resetToDefault: () => void;
}

const DEFAULT_BLOCKS: BuilderComponent[] = [
  {
    id: 'hero-1',
    type: 'hero',
    props: {
      headline: 'THE ROYAL FESTIVE EDIT',
      subheadline: 'Bespoke Haute Couture, Handcrafted Pure Silks, and Modern Luxury Co-ords.',
      buttonText: 'EXPLORE COLLECTION',
      buttonLink: '/products?category=ethnic-wear',
      badgeText: 'AUTUMN / WINTER 2026',
      imageUrl: '/images/hero/hero-desktop.jpg'
    }
  },
  {
    id: 'trust-1',
    type: 'trust-bar',
    props: {
      item1: 'Complimentary Pan-India Shipping above ₹999',
      item2: 'Artisanal Handcrafted Perfection',
      item3: '256-Bit Encrypted Secure Checkout',
      item4: 'Hassle-Free 7-Day Returns'
    }
  },
  {
    id: 'product-grid-1',
    type: 'product-grid',
    props: {
      title: 'ICONIC COUTURE CURATIONS',
      subtitle: 'Most coveted handcrafted silhouettes of the season',
      limit: 4,
      category: 'all'
    }
  },
  {
    id: 'editorial-1',
    type: 'editorial-banner',
    props: {
      tag: 'THE ATELIER STORY',
      title: 'Where Regal Indian Heritage Meets Contemporary Modern Craft',
      description: 'Each ZEVRO piece is spun with pure mulberry silks, intricate zari filaments, and master embroidery.',
      buttonText: 'READ THE EDITORIAL',
      buttonLink: '/category/western-wear'
    }
  },
  {
    id: 'newsletter-1',
    type: 'newsletter',
    props: {
      headline: 'JOIN THE ZEVRO PRIVÉ CLUB',
      subheadline: 'Receive private invitations to runway drops and exclusive concierge previews.',
      buttonText: 'REQUEST ACCESS'
    }
  }
];

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [components, setComponents] = useState<BuilderComponent[]>(DEFAULT_BLOCKS);
  const [selectedId, setSelectedId] = useState<string | null>('hero-1');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Load layout from API on mount
  useEffect(() => {
    async function loadSavedLayout() {
      try {
        const res = await fetch('/api/admin/page?slug=home');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.blocks) && data.blocks.length > 0) {
            setComponents(data.blocks);
            setSelectedId(data.blocks[0]?.id || null);
          }
        }
      } catch (e) {
        // Use default blocks if error
      }
    }
    loadSavedLayout();
  }, []);

  const addComponent = useCallback((type: ComponentType, index?: number) => {
    let props: Record<string, any> = {};

    switch (type) {
      case 'hero':
        props = {
          headline: 'NEW RUNWAY COLLECTION',
          subheadline: 'Discover the latest avant-garde silhouettes.',
          buttonText: 'SHOP NOW',
          buttonLink: '/products',
          badgeText: 'SEASON EXCLUSIVE',
          imageUrl: ''
        };
        break;
      case 'product-grid':
        props = {
          title: 'FEATURED CURATIONS',
          subtitle: 'Hand-picked luxury garments for the discerning connoisseur',
          limit: 4,
          category: 'all'
        };
        break;
      case 'category-grid':
        props = {
          title: 'EXPLORE BY SILHOUETTE',
          subtitle: 'Browse through our bespoke departments'
        };
        break;
      case 'editorial-banner':
        props = {
          tag: 'ARTISANAL MASTERY',
          title: 'Crafted in Limited Numbers for Timeless Elegance',
          description: 'Sourced from the finest weaving clusters across India.',
          buttonText: 'DISCOVER CRAFT',
          buttonLink: '/category/ethnic-wear'
        };
        break;
      case 'trust-bar':
        props = {
          item1: 'Complimentary Pan-India Shipping above ₹999',
          item2: 'Artisanal Handcrafted Perfection',
          item3: '256-Bit Encrypted Secure Checkout',
          item4: 'Hassle-Free 7-Day Returns'
        };
        break;
      case 'newsletter':
        props = {
          headline: 'THE BESPOKE CIRCLE',
          subheadline: 'Be the first to access limited runway collections.',
          buttonText: 'SUBSCRIBE'
        };
        break;
      case 'text':
        props = {
          text: 'At ZEVRO, our craft is a testament to the seamless harmony of timeless tradition and contemporary luxury.',
          align: 'center',
          fontSize: '18px'
        };
        break;
      case 'spacer':
        props = { height: 60 };
        break;
    }

    const newComponent: BuilderComponent = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      props,
    };

    setComponents((prev) => {
      if (typeof index === 'number') {
        const updated = [...prev];
        updated.splice(index, 0, newComponent);
        return updated;
      }
      return [...prev, newComponent];
    });
    
    setSelectedId(newComponent.id);
  }, []);

  const removeComponent = useCallback((id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const duplicateComponent = useCallback((id: string) => {
    setComponents((prev) => {
      const targetIndex = prev.findIndex((c) => c.id === id);
      if (targetIndex === -1) return prev;
      const target = prev[targetIndex];
      const clone: BuilderComponent = {
        id: `${target.type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: target.type,
        props: JSON.parse(JSON.stringify(target.props))
      };
      const updated = [...prev];
      updated.splice(targetIndex + 1, 0, clone);
      return updated;
    });
  }, []);

  const updateComponentProps = useCallback((id: string, newProps: Record<string, any>) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c))
    );
  }, []);

  const moveComponent = useCallback((oldIndex: number, newIndex: number) => {
    setComponents((prev) => arrayMove(prev, oldIndex, newIndex));
  }, []);

  const resetToDefault = useCallback(() => {
    setComponents(DEFAULT_BLOCKS);
    setSelectedId('hero-1');
  }, []);

  return (
    <BuilderContext.Provider
      value={{
        components,
        selectedId,
        addComponent,
        removeComponent,
        duplicateComponent,
        updateComponentProps,
        moveComponent,
        setSelectedId,
        deviceView,
        setDeviceView,
        resetToDefault
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}
