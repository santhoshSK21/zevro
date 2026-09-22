'use client';

import React from 'react';
import { useFilterStore } from '../../store/filterStore';
import { X, SlidersHorizontal, Check } from 'lucide-react';

const CATEGORIES = [
  { id: '', label: 'All Categories' },
  { id: 'new-in', label: 'New In' },
  { id: 'western-wear', label: 'Western Wear' },
  { id: 'ethnic-wear', label: 'Ethnic Wear' },
  { id: 'indo-western', label: 'Indo-Western' },
  { id: 'accessories', label: 'Accessories' }
];

const COLORS = ['Black', 'White', 'Ivory', 'Gold', 'Red', 'Blue', 'Green', 'Pink'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface FilterSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function FilterSidebar({ isOpenMobile, onCloseMobile }: FilterSidebarProps) {
  const { 
    category, sizes, colors, minPrice, maxPrice, 
    setFilter, clearAll 
  } = useFilterStore();

  const handleCategoryToggle = (catId: string) => {
    if (category === catId || catId === '') {
      setFilter('category', '');
    } else {
      setFilter('category', catId);
    }
  };

  const handleArrayFilter = (key: 'sizes' | 'colors', value: string) => {
    const current = key === 'sizes' ? sizes : colors;
    const updated = current.includes(value) 
      ? current.filter(v => v !== value)
      : [...current, value];
    setFilter(key, updated);
  };

  const activeCount = (category ? 1 : 0) + 
    (sizes.length) + 
    (colors.length) + 
    (minPrice > 0 || maxPrice < 50000 ? 1 : 0);

  const formatCategoryName = (catSlug: string) => {
    const match = CATEGORIES.find(c => c.id === catSlug);
    return match ? match.label : catSlug.replace(/-/g, ' ');
  };

  const sidebarContent = (
    <div className="filter-content-wrap">
      {/* Header */}
      <div className="filter-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={15} color="var(--color-ink)" />
          <h3 className="label-caps" style={{ margin: 0, fontSize: '12px', letterSpacing: '0.12em' }}>FILTERS {activeCount > 0 && `(${activeCount})`}</h3>
        </div>
        {activeCount > 0 && (
          <button 
            onClick={clearAll} 
            className="filter-clear-btn"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeCount > 0 && (
        <div className="active-chips-wrap">
          {category && (
            <span className="filter-chip">
              {formatCategoryName(category)}
              <button onClick={() => setFilter('category', '')} aria-label="Remove category filter"><X size={11} /></button>
            </span>
          )}
          {(minPrice > 0 || maxPrice < 50000) && (
            <span className="filter-chip">
              ₹{minPrice} - ₹{maxPrice}
              <button onClick={() => { setFilter('minPrice', 0); setFilter('maxPrice', 50000); }} aria-label="Reset price"><X size={11} /></button>
            </span>
          )}
          {sizes.map(s => (
            <span key={s} className="filter-chip">
              Size: {s}
              <button onClick={() => handleArrayFilter('sizes', s)} aria-label={`Remove size ${s}`}><X size={11} /></button>
            </span>
          ))}
          {colors.map(c => (
            <span key={c} className="filter-chip">
              Color: {c}
              <button onClick={() => handleArrayFilter('colors', c)} aria-label={`Remove color ${c}`}><X size={11} /></button>
            </span>
          ))}
        </div>
      )}

      {/* Category Section */}
      <div className="filter-section">
        <h4 className="filter-section-title">Category</h4>
        <div className="filter-options-list">
          {CATEGORIES.map(cat => {
            const isSelected = (!category && cat.id === '') || category === cat.id;
            return (
              <label 
                key={cat.id || 'all'} 
                className={`filter-option-row ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleCategoryToggle(cat.id)}
              >
                <div className={`filter-radio-indicator ${isSelected ? 'is-checked' : ''}`}>
                  {isSelected && <div className="filter-radio-dot" />}
                </div>
                <span className="filter-option-label">
                  {cat.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="filter-section">
        <h4 className="filter-section-title">Price Range</h4>
        <div className="price-inputs-row">
          <div className="price-input-box">
            <span className="price-curr">₹</span>
            <input 
              type="number" 
              value={minPrice || ''} 
              placeholder="0"
              min="0"
              onChange={(e) => setFilter('minPrice', Math.max(0, Number(e.target.value)))}
              className="price-input"
            />
          </div>
          <span className="price-divider">—</span>
          <div className="price-input-box">
            <span className="price-curr">₹</span>
            <input 
              type="number" 
              value={maxPrice || ''} 
              placeholder="50000"
              min="0"
              onChange={(e) => setFilter('maxPrice', Math.max(0, Number(e.target.value)))}
              className="price-input"
            />
          </div>
        </div>
      </div>

      {/* Size Section */}
      <div className="filter-section">
        <h4 className="filter-section-title">Size</h4>
        <div className="size-grid">
          {SIZES.map(s => {
            const isSelected = sizes.includes(s);
            return (
              <button
                type="button"
                key={s}
                onClick={() => handleArrayFilter('sizes', s)}
                className={`size-btn-pill ${isSelected ? 'is-active' : ''}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Section */}
      <div className="filter-section">
        <h4 className="filter-section-title">Color</h4>
        <div className="color-grid">
          {COLORS.map(c => {
            const isSelected = colors.includes(c);
            return (
              <label 
                key={c} 
                className={`color-pill-item ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleArrayFilter('colors', c)}
              >
                <div className={`color-checkbox ${isSelected ? 'is-checked' : ''}`}>
                  {isSelected && <Check size={10} color="#FFF" />}
                </div>
                <span className="color-name">{c}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="filter-sidebar-desktop">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="filter-drawer-backdrop" onClick={onCloseMobile}>
          <div className="filter-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="filter-drawer-header">
              <span className="filter-drawer-title">FILTER & REFINE</span>
              <button onClick={onCloseMobile} className="filter-drawer-close" aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <div className="filter-drawer-scroll">
              {sidebarContent}
            </div>
            <div className="filter-drawer-footer">
              <button 
                onClick={clearAll}
                className="filter-drawer-btn-clear"
              >
                Clear All
              </button>
              <button 
                onClick={onCloseMobile}
                className="filter-drawer-btn-apply"
              >
                Apply Filters {activeCount > 0 && `(${activeCount})`}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .filter-sidebar-desktop {
          width: 250px;
          flex-shrink: 0;
          padding-right: 32px;
          display: block;
        }

        .filter-content-wrap {
          display: flex;
          flex-direction: column;
        }

        .filter-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--color-stone, #E2DED9);
        }

        .filter-clear-btn {
          background: transparent;
          border: none;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #8C827A;
          cursor: pointer;
          border-bottom: 1px solid currentColor;
          padding: 0 0 2px 0;
          transition: color 0.15s;
        }
        .filter-clear-btn:hover {
          color: var(--color-ink, #0F172A);
        }

        .active-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 24px;
        }

        .filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background-color: #0F172A;
          color: #FAF8F5;
          border-radius: 20px;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          letter-spacing: 0.04em;
        }
        .filter-chip button {
          background: transparent;
          border: none;
          color: #FAF8F5;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
        }

        .filter-section {
          margin-bottom: 32px;
        }

        .filter-section-title {
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink, #0F172A);
          margin: 0 0 14px 0;
        }

        .filter-options-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .filter-option-row {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
          padding: 4px 0;
        }

        .filter-radio-indicator {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .filter-radio-indicator.is-checked {
          border-color: #0F172A;
        }
        .filter-radio-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #0F172A;
        }

        .filter-option-label {
          font-family: var(--font-body, sans-serif);
          font-size: 13px;
          color: #64748B;
          transition: color 0.15s;
        }
        .filter-option-row.is-selected .filter-option-label {
          color: #0F172A;
          font-weight: 600;
        }

        .price-inputs-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .price-input-box {
          display: flex;
          align-items: center;
          border: 1px solid #CBD5E1;
          border-radius: 4px;
          background: #FFFFFF;
          padding: 6px 10px;
          flex: 1;
        }
        .price-curr {
          font-size: 12px;
          color: #94A3B8;
          margin-right: 4px;
        }
        .price-input {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 13px;
          font-family: var(--font-body, sans-serif);
          outline: none;
          color: #0F172A;
        }
        .price-divider {
          color: #94A3B8;
          font-size: 12px;
        }

        .size-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .size-btn-pill {
          padding: 8px 0;
          border: 1px solid #CBD5E1;
          border-radius: 4px;
          background: transparent;
          color: #334155;
          font-family: var(--font-ui, sans-serif);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          text-align: center;
        }
        .size-btn-pill.is-active {
          background-color: #0F172A;
          color: #FAF8F5;
          border-color: #0F172A;
        }

        .color-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .color-pill-item {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
          padding: 4px 0;
        }
        .color-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 3px;
          border: 1px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFF;
        }
        .color-checkbox.is-checked {
          background: #0F172A;
          border-color: #0F172A;
        }
        .color-name {
          font-size: 13px;
          color: #64748B;
        }
        .color-pill-item.is-selected .color-name {
          color: #0F172A;
          font-weight: 600;
        }

        /* Mobile Drawer */
        .filter-drawer-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2500;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.2s ease;
        }

        .filter-drawer-panel {
          width: 100%;
          max-width: 360px;
          height: 100%;
          background-color: #FFFFFF;
          display: flex;
          flex-direction: column;
          box-shadow: -8px 0 32px rgba(0,0,0,0.15);
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .filter-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          border-bottom: 1px solid #E2E8F0;
        }
        .filter-drawer-title {
          font-family: var(--font-ui, sans-serif);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #0F172A;
        }
        .filter-drawer-close {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #64748B;
          display: flex;
          padding: 4px;
        }

        .filter-drawer-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .filter-drawer-footer {
          padding: 16px 24px;
          border-top: 1px solid #E2E8F0;
          display: flex;
          gap: 12px;
          background-color: #F8FAFC;
        }
        .filter-drawer-btn-clear {
          flex: 1;
          padding: 12px 0;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          border-radius: 4px;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #475569;
          cursor: pointer;
        }
        .filter-drawer-btn-apply {
          flex: 2;
          padding: 12px 0;
          border: none;
          background: #0F172A;
          color: #FAF8F5;
          border-radius: 4px;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @media (max-width: 900px) {
          .filter-sidebar-desktop {
            display: none;
          }
        }
      `}} />
    </>
  );
}

