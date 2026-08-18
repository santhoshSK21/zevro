'use client';

import React, { useState } from 'react';

interface SizeOption {
  size: string;
  inStock: boolean;
}

interface SizeSelectorProps {
  sizes: SizeOption[];
  selected: string | null;
  onChange: (s: string) => void;
}

export default function SizeSelector({ sizes, selected, onChange }: SizeSelectorProps) {
  const [notifySize, setNotifySize] = useState<string | null>(null);

  const handleSizeClick = (sizeOption: SizeOption) => {
    if (sizeOption.inStock) {
      onChange(sizeOption.size);
      setNotifySize(null);
    } else {
      setNotifySize(sizeOption.size);
      onChange(sizeOption.size);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
        <h4 className="label-caps" style={{ color: 'var(--color-ink)' }}>Select Size</h4>
        <button className="label-caps" style={{ borderBottom: '1px solid currentColor', paddingBottom: '2px' }}>Size Guide</button>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {sizes.map((s) => {
          const isSelected = selected === s.size;
          return (
            <button 
              key={s.size}
              onClick={() => handleSizeClick(s)}
              style={{
                width: '48px', height: '48px',
                border: '1px solid var(--color-stone)',
                backgroundColor: isSelected && s.inStock ? 'var(--color-ink)' : 'transparent',
                color: isSelected && s.inStock ? 'var(--color-white)' : 'var(--color-ink)',
                fontSize: '13px',
                fontFamily: 'var(--font-ui)',
                transition: 'all 0.2s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                opacity: s.inStock ? 1 : 0.5
              }}
            >
              {s.size}
              {!s.inStock && (
                <div style={{
                  position: 'absolute', top: '50%', left: '-10%', right: '-10%',
                  height: '1px', backgroundColor: 'var(--color-ink)',
                  transform: 'rotate(-45deg)'
                }} />
              )}
            </button>
          );
        })}
      </div>

      {notifySize && (
         <div style={{ marginTop: '16px', padding: '16px', border: '1px solid var(--color-stone)' }}>
            <p style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--color-ink)' }}>
              Size <strong>{notifySize}</strong> is out of stock.
            </p>
         </div>
      )}
    </div>
  );
}
