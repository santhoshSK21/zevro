'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: 'var(--color-bg)' }}>
      {images.map((img, i) => (
        <div key={i} style={{ position: 'relative', width: '100%', aspectRatio: '3/4', backgroundColor: 'var(--color-surface)' }}>
          <Image 
            src={img} 
            alt={`Product view ${i + 1}`} 
            fill 
            style={{ objectFit: 'cover' }} 
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
