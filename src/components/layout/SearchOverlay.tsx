'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUiStore } from '../../store/uiStore';

export default function SearchOverlay() {
  const { isSearchOpen, setSearchOpen } = useUiStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setSearchOpen]);

  if (!isSearchOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setSearchOpen(false);
  };

  return (
    <div className="search-backdrop" onClick={() => setSearchOpen(false)}>
      <div className="search-floating-card" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="search-input-wrap">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, collections, categories..."
            className="search-input-field"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="search-clear-btn"
              title="Clear search"
            >
              ✕
            </button>
          )}

          <button type="submit" className="search-submit-btn">
            Search
          </button>

          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="search-close-btn"
            title="Close (Esc)"
          >
            ✕
          </button>
        </form>

        <div className="search-suggestions">
          <span className="suggestions-label">Popular:</span>
          <div className="suggestions-pills">
            {['Sarees', 'Silk', 'Dresses', 'Kurtis', 'Accessories', 'New Arrivals'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleQuickSearch(term)}
                className="suggestion-pill"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .search-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 80px;
          animation: backdropFade 0.2s ease-out forwards;
        }

        .search-floating-card {
          width: 100%;
          maxWidth: 680px;
          margin: 0 16px;
          background: rgba(250, 248, 245, 0.96);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(212, 175, 55, 0.35);
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.08);
          animation: searchSlideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          color: #1A1816;
        }

        .search-input-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 8px;
          padding: 8px 14px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .search-input-wrap:focus-within {
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
        }

        .search-icon {
          color: #9E978E;
          flex-shrink: 0;
        }

        .search-input-field {
          flex: 1;
          border: none;
          background: transparent;
          font-family: var(--font-body, sans-serif);
          font-size: 15px;
          color: #1A1816;
          outline: none;
        }

        .search-input-field::placeholder {
          color: #A0988E;
          font-size: 14px;
        }

        .search-clear-btn {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          font-size: 12px;
          padding: 4px;
          line-height: 1;
        }

        .search-submit-btn {
          background: #1A1816;
          color: #FAF8F5;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .search-submit-btn:hover {
          background: #D4AF37;
          color: #1A1816;
        }

        .search-close-btn {
          background: transparent;
          border: none;
          color: #666;
          font-size: 16px;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .search-close-btn:hover {
          background: rgba(0,0,0,0.06);
          color: #000;
        }

        .search-suggestions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          flex-wrap: wrap;
        }

        .suggestions-label {
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #7A7268;
        }

        .suggestions-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .suggestion-pill {
          background: rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 20px;
          padding: 4px 12px;
          font-family: var(--font-body, sans-serif);
          font-size: 12px;
          color: #2D2A26;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .suggestion-pill:hover {
          background: rgba(212, 175, 55, 0.15);
          border-color: rgba(212, 175, 55, 0.4);
          color: #000;
          transform: translateY(-1px);
        }

        @keyframes backdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes searchSlideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  );
}
