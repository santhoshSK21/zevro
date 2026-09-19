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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {images.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {images.map((img, idx) => (
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
      
      <ImageUpload 
        onUploadSuccess={(url) => onChange([...images, url])} 
        maxFiles={10 - images.length} 
      />
    </div>
  );
}
