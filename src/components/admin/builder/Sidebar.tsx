'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ComponentType } from './types';
import { Type, Image, AlignLeft, GripHorizontal } from 'lucide-react';

interface SidebarItemProps {
  type: ComponentType;
  label: string;
  icon: React.ReactNode;
}

export function SidebarItem({ type, label, icon }: SidebarItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `sidebar-${type}`,
    data: {
      type: 'sidebarItem',
      componentType: type,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center gap-3 p-3 mb-2 bg-white border border-gray-200 rounded cursor-grab hover:bg-gray-50 transition-colors"
    >
      <div className="text-gray-500">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <GripHorizontal className="ml-auto text-gray-400" size={16} />
    </div>
  );
}

export function Sidebar() {
  const items: SidebarItemProps[] = [
    { type: 'hero', label: 'Hero Banner', icon: <Image size={20} /> },
    { type: 'product-grid', label: 'Product Grid', icon: <Type size={20} /> }, // Should use grid icon
    { type: 'text', label: 'Text Block', icon: <AlignLeft size={20} /> },
    { type: 'spacer', label: 'Spacer', icon: <div className="w-5 h-5 border-t-2 border-b-2 border-gray-400"></div> },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Components</h2>
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <SidebarItem key={item.type} {...item} />
        ))}
      </div>
    </div>
  );
}
