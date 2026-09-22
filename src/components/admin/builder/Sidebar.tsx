'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ComponentType } from './types';
import { 
  Sparkles, 
  ShoppingBag, 
  Grid3X3, 
  BookOpen, 
  ShieldCheck, 
  Mail, 
  Type, 
  Maximize2,
  Plus,
  GripVertical
} from 'lucide-react';
import { useBuilder } from './BuilderContext';

interface SidebarItemProps {
  type: ComponentType;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

export function SidebarItem({ type, label, desc, icon }: SidebarItemProps) {
  const { addComponent } = useBuilder();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `sidebar-${type}`,
    data: {
      type: 'sidebarItem',
      componentType: type,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 9999,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        marginBottom: '10px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '6px',
        cursor: 'grab',
        transition: 'all 0.15s ease',
        ...style
      }}
      className="builder-sidebar-card"
    >
      <div 
        {...listeners} 
        {...attributes} 
        style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}
      >
        <div style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{label}</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>{desc}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          addComponent(type);
        }}
        title="Add to canvas"
        style={{
          background: 'transparent',
          border: '1px solid #CBD5E1',
          borderRadius: '4px',
          padding: '4px',
          color: '#0F172A',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '8px'
        }}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export function Sidebar() {
  const items: SidebarItemProps[] = [
    { type: 'hero', label: 'Hero Runway Banner', desc: 'Main headline with CTA button', icon: <Sparkles size={16} /> },
    { type: 'trust-bar', label: 'Trust & Guarantees Bar', desc: 'Shipping & returns highlight', icon: <ShieldCheck size={16} /> },
    { type: 'product-grid', label: 'Curated Products Grid', desc: 'Showcase bestselling items', icon: <ShoppingBag size={16} /> },
    { type: 'editorial-banner', label: 'Editorial Atelier Story', desc: 'Split image & narrative banner', icon: <BookOpen size={16} /> },
    { type: 'category-grid', label: 'Silhouette Categories', desc: 'Browse by wear department', icon: <Grid3X3 size={16} /> },
    { type: 'newsletter', label: 'VIP Privé Club', desc: 'Newsletter lead capture', icon: <Mail size={16} /> },
    { type: 'text', label: 'Typography Statement', desc: 'Brand quote or paragraph', icon: <Type size={16} /> },
    { type: 'spacer', label: 'Section Gap Divider', desc: 'Add custom breathing room', icon: <Maximize2 size={16} /> },
  ];

  return (
    <div style={{ width: '280px', backgroundColor: '#F8FAFC', borderRight: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: '14px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', letterSpacing: '0.04em', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
          Layout Blocks
        </h2>
        <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>
          Click (+) or drag to add onto canvas
        </p>
      </div>

      <div style={{ flex: 1 }}>
        {items.map((item) => (
          <SidebarItem key={item.type} {...item} />
        ))}
      </div>
    </div>
  );
}
