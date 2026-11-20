'use client';

import React, { useState, useEffect } from 'react';
import { useFilterStore } from '../../store/filterStore';
import { X, SlidersHorizontal, Check, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = [
  { id: '', label: 'All Collections' },
  { id: 'new-in', label: 'New In' },
  { id: 'western-wear', label: 'Western Wear' },
  { id: 'ethnic-wear', label: 'Ethnic Wear' },
  { id: 'indo-western', label: 'Indo-Western' },
  { id: 'accessories', label: 'Accessories' }
];

const PRICE_PRESETS = [
  { label: 'All Prices', min: 0, max: 50000 },
  { label: 'Under ₹5,000', min: 0, max: 5000 },
  { label: '₹5,000 - ₹15,000', min: 5000, max: 15000 },
  { label: '₹15,000 - ₹30,000', min: 15000, max: 30000 },
  { label: 'Above ₹30,000', min: 30000, max: 50000 },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COLORS = [
  { label: 'Black', hex: '#111827' },
  { label: 'Ivory', hex: '#FFFFF0', border: true },
  { label: 'Gold', hex: '#D4AF37' },
  { label: 'Blue', hex: '#1E3A8A' },
  { label: 'Green', hex: '#047857' },
  { label: 'Red', hex: '#B91C1C' },
  { label: 'Pink', hex: '#DB2777' },
  { label: 'Champagne', hex: '#E7D3B6' }
];

const FABRICS = [
  'Pure Silk',
  'Velvet',
  'Georgette',
  'Chiffon',
  'Cotton Silk',
  'Linen',
  'Organza'
];

const OCCASIONS = [
  { id: 'wedding', label: 'Wedding & Bridal' },
  { id: 'festive', label: 'Festive & Celebration' },
  { id: 'evening', label: 'Evening & Gala' },
  { id: 'casual', label: 'Daywear & Casual' }
];

interface FilterSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function FilterSidebar({ isOpenMobile, onCloseMobile }: FilterSidebarProps) {
  const { 
    category, sizes, colors, fabric, occasion, minPrice, maxPrice, 
    setFilter, clearFiltersOnly 
  } = useFilterStore();

  // Local state for custom price inputs to prevent rapid invalid queries
  const [localMin, setLocalMin] = useState<string>(minPrice > 0 ? String(minPrice) : '');
  const [localMax, setLocalMax] = useState<string>(maxPrice < 50000 ? String(maxPrice) : '');

  // Keep local price inputs synced when store resets
  useEffect(() => {
    setLocalMin(minPrice > 0 ? String(minPrice) : '');
    setLocalMax(maxPrice < 50000 ? String(maxPrice) : '');
  }, [minPrice, maxPrice]);

  const handleArrayToggle = (key: 'sizes' | 'colors' | 'fabric' | 'occasion', value: string) => {
    let current: string[] = [];
    if (key === 'sizes') current = sizes || [];
    else if (key === 'colors') current = colors || [];
    else if (key === 'fabric') current = fabric || [];
    else if (key === 'occasion') current = occasion || [];

    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFilter(key, updated);
  };

  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = localMin.trim() ? Math.max(0, Number(localMin)) : 0;
    const maxVal = localMax.trim() ? Math.max(minVal, Number(localMax)) : 50000;
    setFilter('minPrice', minVal);
    setFilter('maxPrice', maxVal);
  };

  const handlePricePreset = (min: number, max: number) => {
    setFilter('minPrice', min);
    setFilter('maxPrice', max);
    setLocalMin(min > 0 ? String(min) : '');
    setLocalMax(max < 50000 ? String(max) : '');
  };

  const hasPriceFilter = minPrice > 0 || (maxPrice > 0 && maxPrice < 50000);
  const activeCount = (sizes?.length || 0) + 
    (colors?.length || 0) + 
    (fabric?.length || 0) + 
    (occasion?.length || 0) + 
    (hasPriceFilter ? 1 : 0);

  const sidebarContent = (
    <div className="filter-inner-content">
      {/* Header */}
      <div className="filter-header-row">
        <div className="filter-header-left">
          <SlidersHorizontal size={14} />
          <span className="filter-header-title">FILTERS</span>
          {activeCount > 0 && <span className="filter-count-badge">({activeCount})</span>}
        </div>
        {activeCount > 0 && (
          <button 
            type="button"
            onClick={clearFiltersOnly} 
            className="filter-reset-btn"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeCount > 0 && (
        <div className="filter-chips-cluster">
          {hasPriceFilter && (
            <span className="active-pill">
              <span>₹{minPrice} - ₹{maxPrice < 50000 ? maxPrice : '50k+'}</span>
              <button 
                type="button" 
                onClick={() => handlePricePreset(0, 50000)}
                aria-label="Remove price filter"
              >
                <X size={11} />
              </button>
            </span>
          )}
          {sizes?.map(s => (
            <span key={s} className="active-pill">
              <span>Size: {s}</span>
              <button 
                type="button" 
                onClick={() => handleArrayToggle('sizes', s)}
                aria-label={`Remove size ${s}`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
          {colors?.map(c => (
            <span key={c} className="active-pill">
              <span>Color: {c}</span>
              <button 
                type="button" 
                onClick={() => handleArrayToggle('colors', c)}
                aria-label={`Remove color ${c}`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
          {fabric?.map(f => (
            <span key={f} className="active-pill">
              <span>{f}</span>
              <button 
                type="button" 
                onClick={() => handleArrayToggle('fabric', f)}
                aria-label={`Remove fabric ${f}`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
          {occasion?.map(o => (
            <span key={o} className="active-pill">
              <span>{o}</span>
              <button 
                type="button" 
                onClick={() => handleArrayToggle('occasion', o)}
                aria-label={`Remove occasion ${o}`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Price Range Section */}
      <div className="filter-block">
        <h4 className="filter-block-title">PRICE RANGE</h4>
        <div className="price-presets-list">
          {PRICE_PRESETS.map((p, idx) => {
            const isSelected = p.min === minPrice && p.max === maxPrice;
            return (
              <button
                type="button"
                key={idx}
                onClick={() => handlePricePreset(p.min, p.max)}
                className={`price-preset-btn ${isSelected ? 'is-selected' : ''}`}
              >
                <span className="radio-circle">
                  {isSelected && <span className="radio-dot" />}
                </span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Price Inputs */}
        <form onSubmit={handleApplyCustomPrice} className="price-custom-form">
          <div className="price-input-row">
            <div className="price-field">
              <span className="currency-mark">₹</span>
              <input
                type="number"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                placeholder="Min"
                className="price-num-input"
                min="0"
              />
            </div>
            <span className="price-range-sep">—</span>
            <div className="price-field">
              <span className="currency-mark">₹</span>
              <input
                type="number"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                placeholder="Max"
                className="price-num-input"
                min="0"
              />
            </div>
            <button type="submit" className="price-apply-btn">
              GO
            </button>
          </div>
        </form>
      </div>

      {/* Sizes Section */}
      <div className="filter-block">
        <h4 className="filter-block-title">SIZE</h4>
        <div className="size-chips-grid">
          {SIZES.map(s => {
            const isSelected = sizes?.includes(s);
            return (
              <button
                type="button"
                key={s}
                onClick={() => handleArrayToggle('sizes', s)}
                className={`size-filter-pill ${isSelected ? 'is-active' : ''}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Section */}
      <div className="filter-block">
        <h4 className="filter-block-title">COLOR</h4>
        <div className="color-swatch-list">
          {COLORS.map(c => {
            const isSelected = colors?.includes(c.label);
            return (
              <button
                type="button"
                key={c.label}
                onClick={() => handleArrayToggle('colors', c.label)}
                className={`color-filter-row ${isSelected ? 'is-active' : ''}`}
              >
                <span 
                  className={`color-dot ${c.border ? 'has-border' : ''}`} 
                  style={{ backgroundColor: c.hex }}
                >
                  {isSelected && <Check size={10} color={c.hex === '#FFFFF0' ? '#111827' : '#FFFFFF'} />}
                </span>
                <span className="color-text">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fabric Section */}
      <div className="filter-block">
        <h4 className="filter-block-title">FABRIC & CRAFT</h4>
        <div className="checkbox-filter-list">
          {FABRICS.map(f => {
            const isSelected = fabric?.includes(f);
            return (
              <button
                type="button"
                key={f}
                onClick={() => handleArrayToggle('fabric', f)}
                className={`checkbox-filter-row ${isSelected ? 'is-active' : ''}`}
              >
                <span className={`custom-checkbox ${isSelected ? 'is-checked' : ''}`}>
                  {isSelected && <Check size={11} color="#FFFFFF" strokeWidth={2.5} />}
                </span>
                <span className="checkbox-text">{f}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Occasion Section */}
      <div className="filter-block">
        <h4 className="filter-block-title">OCCASION</h4>
        <div className="checkbox-filter-list">
          {OCCASIONS.map(o => {
            const isSelected = occasion?.includes(o.id);
            return (
              <button
                type="button"
                key={o.id}
                onClick={() => handleArrayToggle('occasion', o.id)}
                className={`checkbox-filter-row ${isSelected ? 'is-active' : ''}`}
              >
                <span className={`custom-checkbox ${isSelected ? 'is-checked' : ''}`}>
                  {isSelected && <Check size={11} color="#FFFFFF" strokeWidth={2.5} />}
                </span>
                <span className="checkbox-text">{o.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Panel */}
      <aside className="filter-desktop-panel">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="filter-drawer-overlay" onClick={onCloseMobile}>
          <div className="filter-drawer-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="filter-drawer-top">
              <div className="filter-drawer-top-title">
                <SlidersHorizontal size={15} />
                <span>FILTERS {activeCount > 0 && `(${activeCount})`}</span>
              </div>
              <button 
                type="button"
                onClick={onCloseMobile} 
                className="filter-drawer-close-btn" 
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <div className="filter-drawer-body">
              {sidebarContent}
            </div>

            <div className="filter-drawer-bottom">
              <button 
                type="button"
                onClick={clearFiltersOnly}
                className="drawer-clear-btn"
                disabled={activeCount === 0}
              >
                Clear All
              </button>
              <button 
                type="button"
                onClick={onCloseMobile}
                className="drawer-apply-btn"
              >
                Apply Filters {activeCount > 0 && `(${activeCount})`}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .filter-desktop-panel {
          width: 250px;
          background: #FFFFFF;
          border: 1px solid var(--color-stone, #E5E7EB);
          border-radius: var(--radius-md, 8px);
          padding: 16px 18px;
        }

        .filter-inner-content {
          display: flex;
          flex-direction: column;
        }

        .filter-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          margin-bottom: 14px;
          border-bottom: 1px solid var(--color-stone, #E5E7EB);
        }

        .filter-header-left {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-ink, #111827);
        }

        .filter-header-title {
          text-transform: uppercase;
        }

        .filter-count-badge {
          color: var(--color-accent, #C5A869);
        }

        .filter-reset-btn {
          font-family: var(--font-ui, sans-serif);
          font-size: 10.5px;
          font-weight: 600;
          color: #DC2626;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          padding: 2px 4px;
          transition: opacity 0.15s ease;
        }

        .filter-reset-btn:hover {
          opacity: 0.8;
        }

        .filter-chips-cluster {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--color-stone, #E5E7EB);
        }

        .active-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          background: var(--color-surface, #F8F9FA);
          border: 1px solid var(--color-stone, #E5E7EB);
          border-radius: 9999px;
          font-family: var(--font-ui, sans-serif);
          font-size: 10.5px;
          font-weight: 600;
          color: var(--color-ink, #111827);
        }

        .active-pill button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--color-ink-muted, #595F69);
          cursor: pointer;
          padding: 0;
        }

        .active-pill button:hover {
          color: #DC2626;
        }

        .filter-block {
          padding-bottom: 18px;
          margin-bottom: 18px;
          border-bottom: 1px solid var(--color-stone, #E5E7EB);
        }

        .filter-block:last-child {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        .filter-block-title {
          font-family: var(--font-ui, sans-serif);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink, #111827);
          margin: 0 0 10px 0;
        }

        /* Price Presets */
        .price-presets-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 10px;
        }

        .price-preset-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          padding: 3px 0;
          font-family: var(--font-body, sans-serif);
          font-size: 12px;
          color: var(--color-ink-muted, #595F69);
          cursor: pointer;
          text-align: left;
          transition: color 0.15s ease;
        }

        .price-preset-btn:hover,
        .price-preset-btn.is-selected {
          color: var(--color-ink, #111827);
          font-weight: 600;
        }

        .radio-circle {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1.5px solid var(--color-stone, #E5E7EB);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.15s ease;
        }

        .price-preset-btn.is-selected .radio-circle {
          border-color: var(--color-ink, #111827);
        }

        .radio-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-ink, #111827);
        }

        /* Custom Price Form */
        .price-custom-form {
          margin-top: 8px;
        }

        .price-input-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .price-field {
          position: relative;
          flex: 1;
        }

        .currency-mark {
          position: absolute;
          left: 6px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10.5px;
          color: var(--color-ink-muted, #595F69);
        }

        .price-num-input {
          width: 100%;
          height: 28px;
          padding: 0 4px 0 16px;
          border: 1px solid var(--color-stone, #E5E7EB);
          border-radius: 4px;
          font-size: 11px;
          font-family: var(--font-body, sans-serif);
          color: var(--color-ink, #111827);
          outline: none;
        }

        .price-num-input:focus {
          border-color: var(--color-ink, #111827);
        }

        .price-range-sep {
          color: var(--color-stone, #E5E7EB);
          font-size: 10px;
        }

        .price-apply-btn {
          height: 28px;
          padding: 0 9px;
          background: var(--color-ink, #111827);
          color: #FFFFFF;
          border: none;
          border-radius: 4px;
          font-family: var(--font-ui, sans-serif);
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .price-apply-btn:hover {
          background: var(--color-accent, #C5A869);
        }

        /* Size Chips */
        .size-chips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .size-filter-pill {
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-stone, #E5E7EB);
          border-radius: 4px;
          background: #FFFFFF;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 600;
          color: var(--color-ink, #111827);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .size-filter-pill:hover {
          border-color: var(--color-ink, #111827);
        }

        .size-filter-pill.is-active {
          background: var(--color-ink, #111827);
          color: #FFFFFF;
          border-color: var(--color-ink, #111827);
        }

        /* Color Swatches */
        .color-swatch-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .color-filter-row {
          display: flex;
          align-items: center;
          gap: 7px;
          background: none;
          border: none;
          padding: 3px 0;
          cursor: pointer;
          text-align: left;
        }

        .color-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .color-dot.has-border {
          border: 1px solid var(--color-stone, #E5E7EB);
        }

        .color-text {
          font-family: var(--font-body, sans-serif);
          font-size: 12px;
          color: var(--color-ink-muted, #595F69);
          transition: color 0.15s ease;
        }

        .color-filter-row:hover .color-text,
        .color-filter-row.is-active .color-text {
          color: var(--color-ink, #111827);
          font-weight: 600;
        }

        /* Checkbox Rows (Fabric & Occasion) */
        .checkbox-filter-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .checkbox-filter-row {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          padding: 3px 0;
          cursor: pointer;
          text-align: left;
        }

        .custom-checkbox {
          width: 15px;
          height: 15px;
          border-radius: 3px;
          border: 1.5px solid var(--color-stone, #E5E7EB);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .custom-checkbox.is-checked {
          background: var(--color-ink, #111827);
          border-color: var(--color-ink, #111827);
        }

        .checkbox-text {
          font-family: var(--font-body, sans-serif);
          font-size: 12px;
          color: var(--color-ink-muted, #595F69);
          transition: color 0.15s ease;
        }

        .checkbox-filter-row:hover .checkbox-text,
        .checkbox-filter-row.is-active .checkbox-text {
          color: var(--color-ink, #111827);
          font-weight: 600;
        }

        /* Mobile Drawer Styles */
        .filter-drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: flex-start;
          animation: fadeIn 0.2s ease forwards;
        }

        .filter-drawer-sheet {
          width: 320px;
          max-width: 85vw;
          height: 100%;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
          animation: slideDrawer 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .filter-drawer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--color-stone, #E5E7EB);
        }

        .filter-drawer-top-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-ui, sans-serif);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-ink, #111827);
        }

        .filter-drawer-close-btn {
          background: none;
          border: none;
          color: var(--color-ink, #111827);
          cursor: pointer;
          padding: 4px;
        }

        .filter-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
        }

        .filter-drawer-bottom {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border-top: 1px solid var(--color-stone, #E5E7EB);
          background: #FFFFFF;
        }

        .drawer-clear-btn {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid var(--color-stone, #E5E7EB);
          border-radius: 4px;
          background: #FFFFFF;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 600;
          color: var(--color-ink, #111827);
          cursor: pointer;
        }

        .drawer-clear-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .drawer-apply-btn {
          flex: 2;
          padding: 10px 14px;
          border: none;
          border-radius: 4px;
          background: var(--color-ink, #111827);
          color: #FFFFFF;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .drawer-apply-btn:hover {
          background: var(--color-accent, #C5A869);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideDrawer {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        @media (max-width: 900px) {
          .filter-desktop-panel {
            display: none;
          }
        }
      `}} />
    </>
  );
}
