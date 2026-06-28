'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { BuilderComponent, BuilderState } from './types';
import { arrayMove } from '@dnd-kit/sortable';

interface BuilderContextType extends BuilderState {
  addComponent: (type: BuilderComponent['type'], index?: number) => void;
  removeComponent: (id: string) => void;
  updateComponentProps: (id: string, newProps: Record<string, any>) => void;
  moveComponent: (oldIndex: number, newIndex: number) => void;
  setSelectedId: (id: string | null) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [components, setComponents] = useState<BuilderComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addComponent = useCallback((type: BuilderComponent['type'], index?: number) => {
    // Basic defaults for new components
    let props = {};
    if (type === 'hero') {
      props = { headline: 'New Hero Banner', subheadline: 'Add your description here', imageUrl: '' };
    } else if (type === 'text') {
      props = { text: 'New text block', align: 'left' };
    } else if (type === 'spacer') {
      props = { height: 50 };
    } else if (type === 'product-grid') {
      props = { title: 'Featured Products', limit: 4 };
    }

    const newComponent: BuilderComponent = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      props,
    };

    setComponents((prev) => {
      if (typeof index === 'number') {
        const newComponents = [...prev];
        newComponents.splice(index, 0, newComponent);
        return newComponents;
      }
      return [...prev, newComponent];
    });
    
    setSelectedId(newComponent.id);
  }, []);

  const removeComponent = useCallback((id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const updateComponentProps = useCallback((id: string, newProps: Record<string, any>) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c))
    );
  }, []);

  const moveComponent = useCallback((oldIndex: number, newIndex: number) => {
    setComponents((prev) => arrayMove(prev, oldIndex, newIndex));
  }, []);

  return (
    <BuilderContext.Provider
      value={{
        components,
        selectedId,
        addComponent,
        removeComponent,
        updateComponentProps,
        moveComponent,
        setSelectedId,
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
