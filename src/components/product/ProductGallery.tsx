'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '24px', position: 'sticky', top: '100px' }}>
      
      {/* Thumbnails */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '80px', flexShrink: 0 }}>
        {images.map((img, i) => (
          <button 
            key={i} 
            onClick={() => setActiveImage(i)}
            style={{ 
              position: 'relative', aspectRatio: '3/4', width: '100%',
              border: activeImage === i ? '2px solid var(--gold)' : '1px solid transparent',
              overflow: 'hidden', backgroundColor: 'var(--beige)',
              cursor: 'pointer', transition: 'border 0.3s'
            }}
          >
            <Image src={img} alt={`Thumbnail ${i}`} fill style={{ objectFit: 'cover' }} />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div style={{ flex: 1, position: 'relative', aspectRatio: '3/4', backgroundColor: 'var(--beige)', overflow: 'hidden' }}>
        <Image 
          src={images[activeImage]} 
          alt="Main product" 
          fill 
          style={{ objectFit: 'cover', animation: 'fadeIn 0.3s ease' }} 
        />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(1.02); }
            to { opacity: 1; transform: scale(1); }
          }
        `}} />
      </div>

    </div>
  );
}
