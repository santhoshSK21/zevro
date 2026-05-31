'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ColorCarouselProps {
  colors: { colorName: string; colorHex: string }[];
  onSelectColor: (index: number) => void;
}

export default function ColorCarousel({ colors, onSelectColor }: ColorCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    onSelectColor(index);
  };

  return (
    <div style={{ position: 'relative', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: '20px' }}>
      <div style={{ position: 'relative', width: '200px', height: '100px' }}>
        {colors.map((color, i) => {
          const angle = (i - activeIndex) * 25; // 25deg between each
          const radius = 100;
          
          // Calculate x,y along arc
          const x = Math.sin((angle * Math.PI) / 180) * radius;
          const y = (1 - Math.cos((angle * Math.PI) / 180)) * radius;

          const isActive = i === activeIndex;

          return (
            <motion.button
              key={i}
              onClick={() => handleClick(i)}
              animate={{ 
                x: x + 100 - 15, // center offset
                y: y + 20, 
                rotate: angle,
                scale: isActive ? 1.2 : 0.9,
                opacity: Math.abs(i - activeIndex) > 2 ? 0 : 1
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                position: 'absolute',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: color.colorHex,
                border: isActive ? '2px solid var(--gold)' : '1px solid var(--linen)',
                cursor: 'pointer',
                boxShadow: isActive ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
                outline: 'none',
                padding: 0
              }}
              title={color.colorName}
            />
          );
        })}
      </div>
      <div style={{ position: 'absolute', bottom: '0', fontSize: '12px', color: 'var(--warm-grey)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {colors[activeIndex]?.colorName}
      </div>
    </div>
  );
}
