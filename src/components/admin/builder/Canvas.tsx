'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilder } from './BuilderContext';
import { BuilderComponent } from './types';
import { 
  Trash2, 
  Copy, 
  GripVertical, 
  Sparkles, 
  ShoppingBag, 
  ShieldCheck, 
  BookOpen, 
  Grid3X3, 
  Mail, 
  Type,
  Layers
} from 'lucide-react';

// Visual preview rendering for blocks inside the builder canvas
function BlockPreview({ component }: { component: BuilderComponent }) {
  const { props, type } = component;

  switch (type) {
    case 'hero':
      return (
        <div style={{ padding: '48px 32px', backgroundColor: '#141412', color: '#FAF8F5', borderRadius: '4px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(197,168,128,0.15) 0%, rgba(0,0,0,0.85) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600 }}>
              {props.badgeText || 'AUTUMN / WINTER 2026'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '28px', margin: '12px 0', letterSpacing: '0.05em', color: '#FFFFFF' }}>
              {props.headline || 'THE ROYAL FESTIVE EDIT'}
            </h2>
            <p style={{ fontSize: '13px', color: '#B5AFA8', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.5 }}>
              {props.subheadline || 'Bespoke Haute Couture, Handcrafted Pure Silks'}
            </p>
            <button style={{ backgroundColor: '#C5A880', color: '#0F172A', padding: '10px 24px', border: 'none', borderRadius: '2px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {props.buttonText || 'EXPLORE COLLECTION'}
            </button>
          </div>
        </div>
      );

    case 'trust-bar':
      return (
        <div style={{ padding: '20px 24px', backgroundColor: '#F5F1E8', borderTop: '1px solid #DDD6C8', borderBottom: '1px solid #DDD6C8', borderRadius: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1C1C1A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>COMPLIMENTARY SHIPPING</div>
              <div style={{ fontSize: '11px', color: '#68645C' }}>{props.item1 || 'Orders above ₹999'}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1C1C1A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ARTISANAL LUXURY</div>
              <div style={{ fontSize: '11px', color: '#68645C' }}>{props.item2 || 'Handcrafted silks'}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1C1C1A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>SECURE GATEWAY</div>
              <div style={{ fontSize: '11px', color: '#68645C' }}>{props.item3 || '256-bit SSL encrypted'}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1C1C1A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>7-DAY RETURNS</div>
              <div style={{ fontSize: '11px', color: '#68645C' }}>{props.item4 || 'Hassle-free exchange'}</div>
            </div>
          </div>
        </div>
      );

    case 'product-grid':
      return (
        <div style={{ padding: '32px 24px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600 }}>CURATED SELECTION</span>
            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '22px', color: '#0F172A', margin: '4px 0' }}>
              {props.title || 'ICONIC COUTURE CURATIONS'}
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
              {props.subtitle || 'Most coveted handcrafted silhouettes'}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            {[1, 2, 3, 4].slice(0, props.limit || 4).map((n) => (
              <div key={n} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '4px' }}>
                <div style={{ width: '100%', aspectRatio: '3/4', backgroundColor: '#EDE8DE', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '11px', marginBottom: '8px' }}>
                  Product #{n}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#0F172A', textTransform: 'uppercase' }}>Silk Couture Piece</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#C5A880' }}>₹4,999</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'editorial-banner':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#0F172A', color: '#FAF8F5', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', letterSpacing: '0.16em', color: '#C5A880', fontWeight: 600, textTransform: 'uppercase' }}>
              {props.tag || 'THE ATELIER STORY'}
            </span>
            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '20px', color: '#FFFFFF', margin: '10px 0', lineHeight: 1.3 }}>
              {props.title || 'Where Regal Indian Heritage Meets Contemporary Modern Craft'}
            </h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 20px 0', lineHeight: 1.6 }}>
              {props.description || 'Each ZEVRO piece is spun with pure mulberry silks and master embroidery.'}
            </p>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#C5A880', letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid #C5A880', paddingBottom: '2px' }}>
                {props.buttonText || 'DISCOVER CRAFT'} →
              </span>
            </div>
          </div>
          <div style={{ backgroundColor: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '12px' }}>
            [ Editorial Atelier Imagery ]
          </div>
        </div>
      );

    case 'category-grid':
      return (
        <div style={{ padding: '28px 20px', backgroundColor: '#FAF9F6', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '20px', color: '#0F172A', margin: 0 }}>
              {props.title || 'EXPLORE BY SILHOUETTE'}
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {['Western Wear', 'Ethnic Wear', 'Indo-Western', 'Accessories'].map((cat) => (
              <div key={cat} style={{ padding: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', textAlign: 'center', borderRadius: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0F172A' }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'newsletter':
      return (
        <div style={{ padding: '36px 24px', backgroundColor: '#1E293B', color: '#FFFFFF', borderRadius: '4px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '22px', color: '#C5A880', margin: '0 0 6px 0' }}>
            {props.headline || 'JOIN THE ZEVRO PRIVÉ CLUB'}
          </h3>
          <p style={{ fontSize: '12px', color: '#94A3B8', maxWidth: '380px', margin: '0 auto 18px' }}>
            {props.subheadline || 'Receive private invitations to runway drops and exclusive concierge previews.'}
          </p>
          <div style={{ display: 'inline-flex', maxWidth: '360px', width: '100%', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Enter your VIP email" 
              disabled 
              style={{ flex: 1, padding: '10px 12px', background: '#0F172A', border: '1px solid #334155', borderRadius: '4px', color: '#FFF', fontSize: '12px' }} 
            />
            <button style={{ backgroundColor: '#C5A880', color: '#0F172A', border: 'none', borderRadius: '4px', padding: '0 16px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
              {props.buttonText || 'JOIN'}
            </button>
          </div>
        </div>
      );

    case 'text':
      return (
        <div style={{ padding: '24px 32px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '4px', textAlign: props.align || 'center' }}>
          <p style={{ fontFamily: 'var(--font-display, serif)', fontSize: props.fontSize || '16px', color: '#0F172A', lineHeight: 1.6, margin: 0 }}>
            "{props.text || 'At ZEVRO, our craft is a testament to the seamless harmony of timeless tradition and contemporary luxury.'}"
          </p>
        </div>
      );

    case 'spacer':
      return (
        <div style={{ height: `${props.height || 50}px`, backgroundColor: 'transparent', border: '1px dashed #CBD5E1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '11px' }}>
          Vertical Breathing Spacer ({props.height || 50}px)
        </div>
      );

    default:
      return <div style={{ padding: '16px', backgroundColor: '#FFF' }}>Unknown Component Type</div>;
  }
}

function SortableItem({ id, component }: { id: string; component: BuilderComponent }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  
  const { selectedId, setSelectedId, removeComponent, duplicateComponent } = useBuilder();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.4 : 1,
  };

  const isSelected = selectedId === id;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'relative',
        marginBottom: '16px',
        border: isSelected ? '2px solid #C5A880' : '2px solid transparent',
        borderRadius: '6px',
        boxShadow: isSelected ? '0 0 0 4px rgba(197, 168, 128, 0.2)' : 'none',
        transition: 'all 0.15s ease',
        cursor: 'pointer'
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(id);
      }}
    >
      {/* Floating Actions Toolbar */}
      <div 
        style={{
          position: 'absolute',
          top: '-14px',
          right: '12px',
          display: isSelected ? 'flex' : 'none',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#0F172A',
          padding: '4px 8px',
          borderRadius: '4px',
          zIndex: 50,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          title="Drag to re-order"
          style={{ display: 'flex', alignItems: 'center', color: '#C5A880', cursor: 'grab', padding: '2px' }}
        >
          <GripVertical size={15} />
        </div>

        {/* Duplicate Button */}
        <button
          type="button"
          onClick={() => duplicateComponent(id)}
          title="Duplicate Block"
          style={{ background: 'transparent', border: 'none', color: '#E2E8F0', cursor: 'pointer', padding: '2px' }}
        >
          <Copy size={13} />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => removeComponent(id)}
          title="Delete Block"
          style={{ background: 'transparent', border: 'none', color: '#F87171', cursor: 'pointer', padding: '2px' }}
        >
          <Trash2 size={13} />
        </button>
      </div>

      <BlockPreview component={component} />
    </div>
  );
}

export function Canvas() {
  const { components, setSelectedId, deviceView } = useBuilder();
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
    data: {
      type: 'canvas',
    },
  });

  const canvasWidth = deviceView === 'mobile' ? '390px' : deviceView === 'tablet' ? '768px' : '100%';

  return (
    <div 
      style={{
        flex: 1,
        backgroundColor: '#E2E8F0',
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        height: '100%'
      }}
      onClick={() => setSelectedId(null)}
    >
      <div
        ref={setNodeRef}
        style={{
          width: '100%',
          maxWidth: canvasWidth,
          minHeight: '700px',
          backgroundColor: isOver ? '#F1F5F9' : '#FFFFFF',
          borderRadius: '6px',
          padding: '20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          transition: 'max-width 0.3s ease, background-color 0.2s ease',
          height: 'fit-content'
        }}
      >
        {components.length === 0 ? (
          <div style={{ height: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #CBD5E1', borderRadius: '8px', color: '#64748B' }}>
            <Layers size={36} color="#94A3B8" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', margin: '0 0 4px 0' }}>Your Homepage Canvas is Empty</p>
            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Click components on the left sidebar to start building.</p>
          </div>
        ) : (
          <SortableContext
            items={components.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {components.map((component) => (
              <SortableItem key={component.id} id={component.id} component={component} />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}
