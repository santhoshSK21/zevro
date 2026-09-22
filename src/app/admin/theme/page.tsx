'use client';

import React, { useState, useEffect } from 'react';
import { applyThemeToDocument } from '../../../components/layout/ThemeSync';
import { Sparkles, Check, Palette } from 'lucide-react';

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    bg: string;
    surface: string;
    ink: string;
    inkMuted: string;
    accent: string;
    stone: string;
    dark: string;
  };
  fontDisplay: string;
  fontBody: string;
}

const PRESET_THEMES: ThemePreset[] = [
  {
    id: 'royal-ivory',
    name: 'Royal Ivory & Champagne Gold',
    description: 'Zevro Signature Warm Editorial Aesthetic',
    colors: {
      bg: '#F5F1E8',
      surface: '#EAE4D8',
      ink: '#1C1C1A',
      inkMuted: '#68645C',
      accent: '#B49A68',
      stone: '#DDD6C8',
      dark: '#1B1B19'
    },
    fontDisplay: 'Playfair Display, serif',
    fontBody: 'Inter, sans-serif'
  },
  {
    id: 'midnight-noir',
    name: 'Midnight Noir & Champagne',
    description: 'Dark Luxury Haute Couture Theme',
    colors: {
      bg: '#141412',
      surface: '#1F1F1C',
      ink: '#FAF8F5',
      inkMuted: '#A8A298',
      accent: '#D4AF37',
      stone: '#33322E',
      dark: '#0C0C0B'
    },
    fontDisplay: 'Cinzel, serif',
    fontBody: 'Inter, sans-serif'
  },
  {
    id: 'minimalist-monochrome',
    name: 'Atelier Monochrome',
    description: 'Contemporary Scandinavian High-Fashion Minimalist',
    colors: {
      bg: '#FAFAFA',
      surface: '#F0F0F0',
      ink: '#111111',
      inkMuted: '#777777',
      accent: '#000000',
      stone: '#E0E0E0',
      dark: '#111111'
    },
    fontDisplay: 'Montserrat, sans-serif',
    fontBody: 'Inter, sans-serif'
  },
  {
    id: 'rose-silk',
    name: 'Rose Silk & Sand',
    description: 'Soft Pastel Bridal & Feminine Luxury',
    colors: {
      bg: '#FAF4F0',
      surface: '#F2E8E2',
      ink: '#261B1B',
      inkMuted: '#7A6B69',
      accent: '#C48B71',
      stone: '#E5D6D0',
      dark: '#211515'
    },
    fontDisplay: 'Cormorant Garamond, serif',
    fontBody: 'Plus Jakarta Sans, sans-serif'
  },
  {
    id: 'emerald-heritage',
    name: 'Emerald Heritage Velvet',
    description: 'Regal Traditional Indian Aristocracy Aesthetic',
    colors: {
      bg: '#F3F6F3',
      surface: '#E2EBE2',
      ink: '#0F2418',
      inkMuted: '#4F6659',
      accent: '#B38E42',
      stone: '#CFDBCF',
      dark: '#0A1A11'
    },
    fontDisplay: 'Bodoni Moda, serif',
    fontBody: 'Inter, sans-serif'
  }
];

export default function ThemeCreatorPage() {
  const [selectedPreset, setSelectedPreset] = useState<string>('royal-ivory');
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(PRESET_THEMES[0]);
  const [savedToast, setSavedToast] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await fetch('/api/theme');
        if (res.ok) {
          const data = await res.json();
          if (data.theme && data.theme.colors) {
            setCurrentTheme(data.theme);
            if (data.theme.id) {
              setSelectedPreset(data.theme.id);
            }
            applyThemeToDocument(data.theme);
          }
        }
      } catch (err) {
        // Fallback to localStorage
        try {
          const cached = localStorage.getItem('zevro_custom_theme');
          if (cached) {
            const parsed = JSON.parse(cached);
            setCurrentTheme(parsed);
            if (parsed.id) setSelectedPreset(parsed.id);
            applyThemeToDocument(parsed);
          }
        } catch (e) {}
      }
    }
    loadTheme();
  }, []);

  // Apply preset
  const handleSelectPreset = (preset: ThemePreset) => {
    setSelectedPreset(preset.id);
    setCurrentTheme({ ...preset });
    applyThemeToDocument(preset);
  };

  // Color change handler
  const handleColorChange = (key: keyof ThemePreset['colors'], value: string) => {
    const updated = {
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        [key]: value
      }
    };
    setCurrentTheme(updated);
    applyThemeToDocument(updated);
  };

  const handleSaveTheme = async () => {
    setSaving(true);
    try {
      // 1. Save to MongoDB
      await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTheme)
      });

      // 2. Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('zevro_custom_theme', JSON.stringify(currentTheme));
        // 3. Dispatch global live sync event
        window.dispatchEvent(new CustomEvent('zevro-theme-changed', { detail: currentTheme }));
      }

      // 4. Apply to document
      applyThemeToDocument(currentTheme);

      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 4000);
    } catch (e) {
      console.error('Error saving theme:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', fontFamily: 'var(--font-body)' }}>
      
      {/* Toast */}
      {savedToast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#0F172A', color: '#FAF8F5', border: '1px solid #C5A880', padding: '14px 24px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#C5A880" />
          <span>Storefront Theme Published & Applied Live to All Pages!</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#1E293B', margin: '0 0 6px 0' }}>
            Storefront Theme & Color Customizer
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            Select luxury presets or fine-tune custom palettes. Changes are saved to MongoDB and applied live to the entire storefront.
          </p>
        </div>

        <button 
          onClick={handleSaveTheme}
          disabled={saving}
          style={{ padding: '12px 28px', backgroundColor: saving ? '#64748B' : '#0F172A', color: '#FAF8F5', border: '1px solid #C5A880', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Sparkles size={14} color="#C5A880" />
          {saving ? 'Publishing...' : 'Publish Theme Live'}
        </button>
      </div>

      {/* Preset Cards */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1A1816', marginBottom: '16px' }}>
          Curated Luxury Theme Presets
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {PRESET_THEMES.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                style={{
                  backgroundColor: '#FFF',
                  border: isSelected ? '2px solid #D4AF37' : '1px solid #E9ECEF',
                  borderRadius: '8px',
                  padding: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 6px 18px rgba(212, 175, 55, 0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: preset.colors.bg, border: '1px solid #DDD' }} />
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: preset.colors.surface, border: '1px solid #DDD' }} />
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: preset.colors.accent, border: '1px solid #DDD' }} />
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: preset.colors.ink, border: '1px solid #DDD' }} />
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1A1816', margin: '0 0 4px 0' }}>{preset.name}</h4>
                <p style={{ fontSize: '11px', color: '#6C757D', margin: 0, lineHeight: 1.4 }}>{preset.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Split: Controls on Left, Live Store Preview on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '32px', alignItems: 'flex-start' }}>
        
        {/* Controls Column */}
        <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1816', margin: '0 0 20px 0' }}>
            Color & Typography Tokens
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Primary Background */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1816' }}>Primary Background</label>
                <span style={{ fontSize: '11px', color: '#888' }}>Main page canvas</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="color" 
                  value={currentTheme.colors.bg} 
                  onChange={(e) => handleColorChange('bg', e.target.value)}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#444' }}>{currentTheme.colors.bg}</span>
              </div>
            </div>

            {/* Surface Background */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1816' }}>Surface / Cards</label>
                <span style={{ fontSize: '11px', color: '#888' }}>Secondary containers & panels</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="color" 
                  value={currentTheme.colors.surface} 
                  onChange={(e) => handleColorChange('surface', e.target.value)}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#444' }}>{currentTheme.colors.surface}</span>
              </div>
            </div>

            {/* Accent Gold */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1816' }}>Accent / Signature Gold</label>
                <span style={{ fontSize: '11px', color: '#888' }}>Highlights, badges & stars</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="color" 
                  value={currentTheme.colors.accent} 
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#444' }}>{currentTheme.colors.accent}</span>
              </div>
            </div>

            {/* Ink / Text */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1816' }}>Primary Text / Ink</label>
                <span style={{ fontSize: '11px', color: '#888' }}>Main headings & paragraphs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="color" 
                  value={currentTheme.colors.ink} 
                  onChange={(e) => handleColorChange('ink', e.target.value)}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#444' }}>{currentTheme.colors.ink}</span>
              </div>
            </div>

            {/* Hairline Stone Border */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1816' }}>Hairline Borders</label>
                <span style={{ fontSize: '11px', color: '#888' }}>Dividers and separators</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="color" 
                  value={currentTheme.colors.stone} 
                  onChange={(e) => handleColorChange('stone', e.target.value)}
                  style={{ width: '36px', height: '36px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#444' }}>{currentTheme.colors.stone}</span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E9ECEF', margin: '8px 0' }} />

            {/* Typography Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1816', marginBottom: '8px' }}>
                Display Serif Typography
              </label>
              <select 
                value={currentTheme.fontDisplay}
                onChange={(e) => setCurrentTheme(prev => ({ ...prev, fontDisplay: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #CED4DA', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
              >
                <option value="Playfair Display, serif">Playfair Display (Signature Romance)</option>
                <option value="Cinzel, serif">Cinzel (Regal Classical)</option>
                <option value="Cormorant Garamond, serif">Cormorant Garamond (Delicate Editorial)</option>
                <option value="Bodoni Moda, serif">Bodoni Moda (Vogue Fashion)</option>
                <option value="Montserrat, sans-serif">Montserrat (Modern Clean Sans)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Live Storefront Preview Column */}
        <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1816', margin: 0 }}>
              Live Storefront Preview
            </h3>
            <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', background: '#E8F5E9', color: '#2E7D32', fontWeight: 600 }}>
              Live Render
            </span>
          </div>

          {/* Simulated Preview Box */}
          <div 
            style={{
              backgroundColor: currentTheme.colors.bg,
              color: currentTheme.colors.ink,
              borderRadius: '8px',
              border: `1px solid ${currentTheme.colors.stone}`,
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(0,0,0,0.06)'
            }}
          >
            {/* Nav Preview */}
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${currentTheme.colors.stone}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: currentTheme.fontDisplay, fontSize: '18px', letterSpacing: '0.15em', fontWeight: 600 }}>ZEVRO</span>
              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                <span>Western</span>
                <span>Ethnic</span>
                <span>Atelier</span>
              </div>
              <span style={{ color: currentTheme.colors.accent }}>🛒 (2)</span>
            </div>

            {/* Hero Section Preview */}
            <div style={{ padding: '36px 24px', textAlign: 'center', backgroundColor: currentTheme.colors.surface }}>
              <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: currentTheme.colors.accent, fontWeight: 600 }}>
                AUTUMN / WINTER 2026
              </span>
              <h2 style={{ fontFamily: currentTheme.fontDisplay, fontSize: '24px', margin: '8px 0 12px', letterSpacing: '0.05em' }}>
                The Royal Festive Edit
              </h2>
              <p style={{ fontSize: '12px', color: currentTheme.colors.inkMuted, maxWidth: '320px', margin: '0 auto 16px' }}>
                Handcrafted silk sarees and tailored festive co-ords.
              </p>
              <button style={{ backgroundColor: currentTheme.colors.ink, color: currentTheme.colors.bg, border: 'none', padding: '10px 20px', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                DISCOVER COLLECTION
              </button>
            </div>

            {/* Product Card Preview */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ backgroundColor: currentTheme.colors.surface, padding: '12px', border: `1px solid ${currentTheme.colors.stone}` }}>
                <div style={{ height: '140px', backgroundColor: currentTheme.colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: currentTheme.colors.accent }}>[ Garment Image ]</span>
                </div>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', color: currentTheme.colors.inkMuted, margin: '0 0 2px' }}>Ethnic Wear</p>
                <h4 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 6px' }}>Ivory Zari Anarkali</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>₹5,499</span>
                  <button style={{ background: 'none', border: `1px solid ${currentTheme.colors.ink}`, color: currentTheme.colors.ink, padding: '4px 8px', fontSize: '9px', textTransform: 'uppercase', fontWeight: 600 }}>
                    ADD
                  </button>
                </div>
              </div>

              <div style={{ backgroundColor: currentTheme.colors.surface, padding: '12px', border: `1px solid ${currentTheme.colors.stone}` }}>
                <div style={{ height: '140px', backgroundColor: currentTheme.colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: currentTheme.colors.accent }}>[ Garment Image ]</span>
                </div>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', color: currentTheme.colors.inkMuted, margin: '0 0 2px' }}>Western Wear</p>
                <h4 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 6px' }}>Silk Pleated Co-ord</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>₹4,499</span>
                  <button style={{ background: 'none', border: `1px solid ${currentTheme.colors.ink}`, color: currentTheme.colors.ink, padding: '4px 8px', fontSize: '9px', textTransform: 'uppercase', fontWeight: 600 }}>
                    ADD
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
