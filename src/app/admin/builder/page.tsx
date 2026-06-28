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
      <div className="flex h-[calc(100vh-140px)] w-full border border-gray-200 rounded overflow-hidden">
        <Sidebar />
        <Canvas />
        <PropertiesPanel />
      </div>
      
      {/* Drag Overlay for better UX */}
      <DragOverlay>
        {activeSidebarType ? (
          <div className="p-3 bg-white border shadow-xl rounded opacity-80 cursor-grabbing">
            Adding {activeSidebarType}...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default function BuilderPage() {
  const [isSaving, setIsSaving] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <BuilderProvider>
        <BuilderHeader isSaving={isSaving} setIsSaving={setIsSaving} />
        <BuilderInterface />
      </BuilderProvider>
    </div>
  );
}

function BuilderHeader({ isSaving, setIsSaving }: { isSaving: boolean, setIsSaving: (s: boolean) => void }) {
  const { components } = useBuilder();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'home',
          title: 'Home Page',
          status: 'published',
          blocks: components,
        }),
      });

      if (!res.ok) throw new Error('Failed to save layout');
      alert('Layout saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Error saving layout');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>Storefront Builder</h1>
        <p className="text-gray-500 text-sm">Drag and drop components to design your homepage.</p>
      </div>
      <button 
        onClick={handleSave}
        disabled={isSaving}
        className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Save Layout'}
      </button>
    </div>
  );
}
