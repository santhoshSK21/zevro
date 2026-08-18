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
    <aside className="filter-sidebar" style={{ width: '240px', flexShrink: 0, paddingRight: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h3 className="label-caps">Filters</h3>
        <button onClick={clearAll} className="label-caps" style={{ borderBottom: '1px solid currentColor', paddingBottom: '2px' }}>Clear All</button>
      </div>

      {/* Category */}
      <div style={{ marginBottom: '40px' }}>
        <h4 className="label-caps" style={{ marginBottom: '16px', color: 'var(--color-ink)' }}>Category</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {CATEGORIES.map(cat => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="category"
                checked={category === cat.id}
                onChange={() => setFilter('category', cat.id)}
                style={{ accentColor: 'var(--color-ink)' }}
              />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: category === cat.id ? 'var(--color-ink)' : 'var(--color-ink-muted)' }}>
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div style={{ marginBottom: '40px' }}>
        <h4 className="label-caps" style={{ marginBottom: '16px', color: 'var(--color-ink)' }}>Price Range</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input 
            type="number" 
            value={minPrice} 
            placeholder="Min"
            onChange={(e) => setFilter('minPrice', Number(e.target.value))}
            style={{ width: '100%', padding: '8px', border: '1px solid var(--color-stone)', background: 'transparent', fontSize: '13px', fontFamily: 'var(--font-body)' }}
          />
          <span style={{ color: 'var(--color-stone)' }}>-</span>
          <input 
            type="number" 
            value={maxPrice} 
            placeholder="Max"
            onChange={(e) => setFilter('maxPrice', Number(e.target.value))}
            style={{ width: '100%', padding: '8px', border: '1px solid var(--color-stone)', background: 'transparent', fontSize: '13px', fontFamily: 'var(--font-body)' }}
          />
        </div>
      </div>

      {/* Size */}
      <div style={{ marginBottom: '40px' }}>
        <h4 className="label-caps" style={{ marginBottom: '16px', color: 'var(--color-ink)' }}>Size</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SIZES.map(s => (
            <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={sizes.includes(s)}
                onChange={() => handleArrayFilter('sizes', s)}
                style={{ accentColor: 'var(--color-ink)' }}
              />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: sizes.includes(s) ? 'var(--color-ink)' : 'var(--color-ink-muted)' }}>
                {s}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div style={{ marginBottom: '40px' }}>
        <h4 className="label-caps" style={{ marginBottom: '16px', color: 'var(--color-ink)' }}>Color</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {COLORS.map(c => (
            <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={colors.includes(c)}
                onChange={() => handleArrayFilter('colors', c)}
                style={{ accentColor: 'var(--color-ink)' }}
              />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: colors.includes(c) ? 'var(--color-ink)' : 'var(--color-ink-muted)' }}>
                {c}
              </span>
            </label>
          ))}
        </div>
      </div>

    </aside>
  );
}
