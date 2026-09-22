'use client';

import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

interface MediaManagerProps {
  images: string[];
  onChange: (newImages: string[]) => void;
}

export default function MediaManager({ images, onChange }: MediaManagerProps) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    // Small timeout to allow the drag image to generate before making the source invisible
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIdx(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;

    const newImages = [...images];
    const item = newImages.splice(draggedIdx, 1)[0];
    newImages.splice(idx, 0, item);
    onChange(newImages);
  };

  const removeImage = (idx: number) => {
    const newImages = [...images];
    newImages.splice(idx, 1);
    onChange(newImages);
  };

  const validImages = (images || []).filter(img => typeof img === 'string' && img.trim() !== '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {validImages.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {validImages.map((img, idx) => (
            <div
              key={img + idx}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              style={{
                position: 'relative',
                width: '120px',
                height: '160px',
                cursor: 'grab',
                border: idx === 0 ? '2px solid var(--espresso)' : '1px solid var(--linen)',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <img src={img} alt="Product Media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', textAlign: 'center', padding: '4px' }}>
                {idx === 0 ? 'Primary' : `Image ${idx + 1}`}
              </div>

              <button
                type="button"
                onClick={() => removeImage(idx)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(255,0,0,0.8)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input 
            type="url" 
            id="media-url-input" 
            placeholder="Or paste image URL directly (e.g. https://images.unsplash.com/...)" 
            style={{ flex: 1, padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const val = (e.currentTarget.value || '').trim();
                if (val) {
                  onChange([...images, val]);
                  e.currentTarget.value = '';
                }
              }
            }}
          />
          <button 
            type="button" 
            onClick={() => {
              const input = document.getElementById('media-url-input') as HTMLInputElement;
              if (input && input.value.trim()) {
                onChange([...images, input.value.trim()]);
                input.value = '';
              }
            }}
            style={{ padding: '10px 18px', backgroundColor: '#0F172A', color: '#FAF8F5', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            ADD URL
          </button>
        </div>

        <ImageUpload 
          onUploadSuccess={(url) => onChange([...images, url])} 
          maxFiles={10 - images.length} 
        />
      </div>
    </div>
  );
}

