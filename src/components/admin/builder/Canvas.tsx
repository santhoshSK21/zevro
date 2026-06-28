'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilder } from './BuilderContext';
import { BuilderComponent } from './types';
import { Trash2 } from 'lucide-react';

// Simplified representation of blocks for the canvas
function BlockPreview({ component }: { component: BuilderComponent }) {
  switch (component.type) {
    case 'hero':
      return <div className="bg-blue-100 p-8 text-center rounded border-2 border-dashed border-blue-300">Hero: {component.props.headline}</div>;
    case 'product-grid':
      return <div className="bg-green-100 p-8 text-center rounded border-2 border-dashed border-green-300">Product Grid: {component.props.title}</div>;
    case 'text':
      return <div className="bg-gray-100 p-4 rounded border border-gray-300">{component.props.text}</div>;
    case 'spacer':
      return <div className="bg-transparent border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400" style={{ height: component.props.height || 50 }}>Spacer ({component.props.height}px)</div>;
    default:
      return <div>Unknown Component</div>;
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
  
  const { selectedId, setSelectedId, removeComponent } = useBuilder();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedId === id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative mb-4 group cursor-pointer border-2 transition-all ${
        isSelected ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-300'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(id);
      }}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1 bg-white border shadow-sm rounded opacity-0 group-hover:opacity-100 cursor-grab z-10"
      >
        <div className="w-4 h-4 bg-gray-400 flex flex-col justify-around p-[2px]">
            <div className="w-full h-[2px] bg-white"></div>
            <div className="w-full h-[2px] bg-white"></div>
            <div className="w-full h-[2px] bg-white"></div>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeComponent(id);
        }}
        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 hover:bg-red-600 z-10"
      >
        <Trash2 size={16} />
      </button>

      <BlockPreview component={component} />
    </div>
  );
}

export function Canvas() {
  const { components, setSelectedId } = useBuilder();
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
    data: {
      type: 'canvas',
    },
  });

  return (
    <div 
      className="flex-1 bg-gray-200 overflow-y-auto p-8 flex justify-center"
      onClick={() => setSelectedId(null)}
    >
      <div
        ref={setNodeRef}
        className={`w-full max-w-4xl bg-white min-h-[800px] shadow-lg rounded-sm p-4 transition-colors ${
          isOver ? 'bg-blue-50' : 'bg-white'
        }`}
      >
        {components.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-lg">Drag components here to start building</p>
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
