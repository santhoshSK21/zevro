'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setSearchOpen(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      backgroundColor: 'rgba(250, 247, 242, 0.98)',
      animation: 'fadeIn 0.3s ease forwards',
      display: 'flex', flexDirection: 'column'
    }}>
      <div className="container" style={{ paddingTop: '64px', position: 'relative' }}>
        <button 
          onClick={() => setSearchOpen(false)}
          style={{ position: 'absolute', top: '32px', right: '32px', fontSize: '24px' }}
        >
          ✕
        </button>

        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '2px solid var(--espresso)',
              fontSize: 'clamp(24px, 4vw, 40px)',
              fontFamily: 'var(--font-display)',
              padding: '16px 0',
              outline: 'none',
              color: 'var(--espresso)'
            }}
          />
        </form>

        <div style={{ width: '100%', maxWidth: '800px', margin: '48px auto 0' }}>
          <h4 style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'var(--warm-grey)', marginBottom: '16px' }}>TRENDING SEARCHES</h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['Silk Sarees', 'Party Wear Dresses', 'Kundan Jewellery', 'Festive Kurtis'].map(term => (
              <button 
                key={term}
                onClick={() => { setQuery(term); router.push(`/search?q=${encodeURIComponent(term)}`); setSearchOpen(false); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid var(--linen)',
                  fontSize: '12px',
                  backgroundColor: '#fff'
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </div>
  );
}
