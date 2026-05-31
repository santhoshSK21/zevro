'use client';

import React from 'react';

interface SizeSelectorProps {
  sizes: string[];
  selected: string | null;
  onChange: (s: string) => void;
}

export default function SizeSelector({ sizes, selected, onChange }: SizeSelectorProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em' }}>SELECT SIZE</h4>
        <button style={{ fontSize: '12px', color: 'var(--warm-grey)', textDecoration: 'underline' }}>Size Guide</button>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {sizes.map(s => (
          <button 
            key={s}
            onClick={() => onChange(s)}
            style={{
              width: '48px', height: '48px',
              border: '1px solid',
              borderColor: selected === s ? 'var(--espresso)' : 'var(--linen)',
              backgroundColor: selected === s ? 'var(--espresso)' : 'transparent',
              color: selected === s ? 'var(--ivory)' : 'var(--espresso)',
              fontSize: '14px',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
