'use client';

import React from 'react';
import { useFilterStore } from '../../store/filterStore';
import { ChevronDown, ArrowUpDown } from 'lucide-react';

interface SortDropdownProps {
  className?: string;
  hideLabel?: boolean;
}

export default function SortDropdown({ className = '', hideLabel = false }: SortDropdownProps) {
  const { sortBy, setFilter } = useFilterStore();

  return (
    <div className={`sort-dropdown-container ${className}`}>
      {!hideLabel && (
        <label htmlFor="sort-select" className="sort-label">
          <ArrowUpDown size={12} className="sort-icon" />
          <span>SORT</span>
        </label>
      )}
      <div className="sort-select-wrapper">
        <select 
          id="sort-select"
          value={sortBy} 
          onChange={(e) => setFilter('sortBy', e.target.value)}
          className="sort-native-select"
          aria-label="Sort products"
        >
          <option value="newest">New Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="bestselling">Bestselling</option>
        </select>
        <ChevronDown size={13} className="sort-arrow" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .sort-dropdown-container {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .sort-label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.16em;
          color: var(--color-ink-muted);
          font-weight: 700;
          text-transform: uppercase;
        }
        .sort-icon {
          color: var(--color-accent);
        }
        .sort-select-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .sort-native-select {
          appearance: none;
          -webkit-appearance: none;
          background: var(--color-surface);
          border: 1px solid var(--color-stone);
          border-radius: 20px;
          padding: 6px 30px 6px 14px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          color: var(--color-ink);
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .sort-native-select:hover,
        .sort-native-select:focus {
          border-color: var(--color-accent);
          outline: none;
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 20%, transparent);
        }
        .sort-arrow {
          position: absolute;
          right: 11px;
          pointer-events: none;
          color: var(--color-ink-muted);
        }
      `}} />
    </div>
  );
}
