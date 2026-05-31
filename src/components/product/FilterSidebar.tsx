'use client';

import React from 'react';
import { useFilterStore } from '../../store/filterStore';

const CATEGORIES = [
  { id: 'western-wear', label: 'Western Wear' },
  { id: 'ethnic-wear', label: 'Ethnic Wear' },
  { id: 'indo-western', label: 'Indo-Western' },
  { id: 'accessories', label: 'Accessories' }
];

const COLORS = ['Black', 'White', 'Ivory', 'Gold', 'Red', 'Blue', 'Green', 'Pink'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function FilterSidebar() {
  const { 
    category, sizes, colors, minPrice, maxPrice, 
    setFilter, clearAll 
  } = useFilterStore();

  const handleArrayFilter = (key: 'sizes' | 'colors', value: string) => {
    const current = key === 'sizes' ? sizes : colors;
    const updated = current.includes(value) 
      ? current.filter(v => v !== value)
      : [...current, value];
    setFilter(key, updated);
  };

  return (
    <aside style={{ width: '280px', flexShrink: 0, paddingRight: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.1em' }}>FILTERS</h3>
        <button onClick={clearAll} style={{ fontSize: '12px', color: 'var(--warm-grey)', textDecoration: 'underline' }}>Clear All</button>
      </div>

      {/* Category */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '16px' }}>CATEGORY</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {CATEGORIES.map(cat => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="category"
                checked={category === cat.id}
                onChange={() => setFilter('category', cat.id)}
                style={{ accentColor: 'var(--gold)' }}
              />
              <span style={{ fontSize: '14px', color: category === cat.id ? 'var(--espresso)' : 'var(--warm-grey)' }}>
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '16px' }}>PRICE RANGE</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input 
            type="number" 
            value={minPrice} 
            onChange={(e) => setFilter('minPrice', Number(e.target.value))}
            style={{ width: '100%', padding: '8px', border: '1px solid var(--linen)' }}
          />
          <span>-</span>
          <input 
            type="number" 
            value={maxPrice} 
            onChange={(e) => setFilter('maxPrice', Number(e.target.value))}
            style={{ width: '100%', padding: '8px', border: '1px solid var(--linen)' }}
          />
        </div>
      </div>

      {/* Size */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '16px' }}>SIZE</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SIZES.map(s => (
            <button 
              key={s}
              onClick={() => handleArrayFilter('sizes', s)}
              style={{
                width: '40px', height: '40px',
                border: '1px solid',
                borderColor: sizes.includes(s) ? 'var(--espresso)' : 'var(--linen)',
                backgroundColor: sizes.includes(s) ? 'var(--espresso)' : 'transparent',
                color: sizes.includes(s) ? 'var(--ivory)' : 'var(--espresso)',
                fontSize: '12px',
                transition: 'all 0.2s'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '16px' }}>COLOR</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {COLORS.map(c => (
            <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={colors.includes(c)}
                onChange={() => handleArrayFilter('colors', c)}
                style={{ accentColor: 'var(--gold)' }}
              />
              <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: c.toLowerCase(), border: '1px solid #ddd' }} />
              <span style={{ fontSize: '14px', color: colors.includes(c) ? 'var(--espresso)' : 'var(--warm-grey)' }}>
                {c}
              </span>
            </label>
          ))}
        </div>
      </div>

    </aside>
  );
}
