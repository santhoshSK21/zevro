'use client';

import React from 'react';
import { useBuilder } from './BuilderContext';

export function PropertiesPanel() {
  const { components, selectedId, updateComponentProps } = useBuilder();

  const selectedComponent = components.find((c) => c.id === selectedId);

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex items-center justify-center text-gray-500">
        <p className="text-center">Select a component on the canvas to edit its properties.</p>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    updateComponentProps(selectedComponent.id, { [key]: value });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-6 pb-2 border-b text-gray-800 capitalize">
        {selectedComponent.type.replace('-', ' ')} Settings
      </h2>

      <div className="space-y-4 flex flex-col">
        {/* Dynamic form fields based on component type */}
        {selectedComponent.type === 'hero' && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Headline</label>
              <input
                type="text"
                value={selectedComponent.props.headline || ''}
                onChange={(e) => handleChange('headline', e.target.value)}
                className="border p-2 rounded text-sm text-black"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Subheadline</label>
              <textarea
                value={selectedComponent.props.subheadline || ''}
                onChange={(e) => handleChange('subheadline', e.target.value)}
                className="border p-2 rounded text-sm min-h-[80px] text-black"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                value={selectedComponent.props.imageUrl || ''}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                className="border p-2 rounded text-sm text-black"
                placeholder="https://..."
              />
            </div>
          </>
        )}

        {selectedComponent.type === 'product-grid' && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Grid Title</label>
              <input
                type="text"
                value={selectedComponent.props.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="border p-2 rounded text-sm text-black"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Product Limit</label>
              <input
                type="number"
                value={selectedComponent.props.limit || 4}
                onChange={(e) => handleChange('limit', parseInt(e.target.value))}
                className="border p-2 rounded text-sm text-black"
                min="1" max="20"
              />
            </div>
          </>
        )}

        {selectedComponent.type === 'text' && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Text Content</label>
              <textarea
                value={selectedComponent.props.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="border p-2 rounded text-sm min-h-[120px] text-black"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Alignment</label>
              <select
                value={selectedComponent.props.align || 'left'}
                onChange={(e) => handleChange('align', e.target.value)}
                className="border p-2 rounded text-sm text-black"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        )}

        {selectedComponent.type === 'spacer' && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Height (px)</label>
            <input
              type="number"
              value={selectedComponent.props.height || 50}
              onChange={(e) => handleChange('height', parseInt(e.target.value))}
              className="border p-2 rounded text-sm text-black"
              min="10" max="500" step="10"
            />
          </div>
        )}
      </div>
    </div>
  );
}
