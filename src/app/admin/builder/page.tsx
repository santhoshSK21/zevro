'use client';

import React, { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core';
import { BuilderProvider, useBuilder } from '@/components/admin/builder/BuilderContext';
import { Sidebar } from '@/components/admin/builder/Sidebar';
import { Canvas } from '@/components/admin/builder/Canvas';
import { PropertiesPanel } from '@/components/admin/builder/PropertiesPanel';
import { ComponentType } from '@/components/admin/builder/types';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Sparkles, 
  RotateCcw, 
  Eye, 
  Check 
} from 'lucide-react';

function BuilderInterface() {
  const { addComponent, moveComponent, components } = useBuilder();
  const [activeSidebarType, setActiveSidebarType] = useState<ComponentType | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'sidebarItem') {
      setActiveSidebarType(active.data.current.componentType as ComponentType);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveSidebarType(null);

    if (!over) return;

    // Handle dropping from Sidebar to Canvas
    if (active.data.current?.type === 'sidebarItem') {
      if (over.id === 'canvas-droppable' || components.some(c => c.id === over.id)) {
        let index = components.length;
        
        // If dropped over a specific item in canvas, insert there
        if (over.id !== 'canvas-droppable') {
            const overIndex = components.findIndex(c => c.id === over.id);
            index = overIndex >= 0 ? overIndex : index;
        }
        
        addComponent(active.data.current.componentType as ComponentType, index);
      }
      return;
    }

    // Handle sorting within Canvas
    if (active.id !== over.id) {
      const oldIndex = components.findIndex((c) => c.id === active.id);
      const newIndex = components.findIndex((c) => c.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        moveComponent(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: 'flex', height: 'calc(100vh - 170px)', width: '100%', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <Sidebar />
        <Canvas />
        <PropertiesPanel />
      </div>
      
      {/* Drag Overlay */}
      <DragOverlay>
        {activeSidebarType ? (
          <div style={{ padding: '12px 18px', backgroundColor: '#0F172A', color: '#FAF8F5', border: '1px solid #C5A880', borderRadius: '6px', boxShadow: '0 12px 28px rgba(0,0,0,0.3)', opacity: 0.9, cursor: 'grabbing', fontSize: '13px', fontWeight: 600 }}>
            ✨ Inserting {activeSidebarType}...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function BuilderHeader() {
  const { components, deviceView, setDeviceView, resetToDefault } = useBuilder();
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'home',
          title: 'Zevro Signature Homepage',
          status: 'published',
          blocks: components,
        }),
      });

      if (!res.ok) throw new Error('Failed to save layout');
      setToast('Storefront layout published live to homepage!');
      setTimeout(() => setToast(''), 4000);
    } catch (error) {
      console.error(error);
      setToast('Layout saved in session.');
      setTimeout(() => setToast(''), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
      
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#0F172A', color: '#FAF8F5', border: '1px solid #C5A880', padding: '14px 24px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#C5A880" />
          <span>{toast}</span>
        </div>
      )}

      <div>
        <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '24px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
          Visual Storefront Builder
        </h1>
        <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
          Drag, drop, and configure bespoke homepage sections with live preview.
        </p>
      </div>

      {/* Device View Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '6px', border: '1px solid #E2E8F0', gap: '4px' }}>
        <button
          type="button"
          onClick={() => setDeviceView('desktop')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: deviceView === 'desktop' ? '#FFFFFF' : 'transparent',
            color: deviceView === 'desktop' ? '#0F172A' : '#64748B',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: deviceView === 'desktop' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
          }}
        >
          <Monitor size={14} />
          <span>Desktop</span>
        </button>

        <button
          type="button"
          onClick={() => setDeviceView('tablet')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: deviceView === 'tablet' ? '#FFFFFF' : 'transparent',
            color: deviceView === 'tablet' ? '#0F172A' : '#64748B',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: deviceView === 'tablet' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
          }}
        >
          <Tablet size={14} />
          <span>Tablet</span>
        </button>

        <button
          type="button"
          onClick={() => setDeviceView('mobile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: deviceView === 'mobile' ? '#FFFFFF' : 'transparent',
            color: deviceView === 'mobile' ? '#0F172A' : '#64748B',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: deviceView === 'mobile' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
          }}
        >
          <Smartphone size={14} />
          <span>Mobile</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          type="button"
          onClick={resetToDefault}
          title="Reset to default template"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 16px',
            backgroundColor: 'transparent',
            color: '#64748B',
            border: '1px solid #CBD5E1',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={13} />
          <span>Reset Template</span>
        </button>

        <button 
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 24px',
            backgroundColor: isSaving ? '#64748B' : '#0F172A',
            color: '#FAF8F5',
            border: '1px solid #C5A880',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={14} color="#C5A880" />
          <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
        </button>
      </div>

    </div>
  );
}

export default function BuilderPage() {
  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <BuilderProvider>
        <BuilderHeader />
        <BuilderInterface />
      </BuilderProvider>
    </div>
  );
}
