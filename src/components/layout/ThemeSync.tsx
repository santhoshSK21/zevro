'use client';

import { useEffect } from 'react';

export function applyThemeToDocument(theme: any) {
  if (!theme || !theme.colors) return;
  const root = document.documentElement;
  const colors = theme.colors;

  // Set CSS variables
  if (colors.bg) {
    root.style.setProperty('--color-bg', colors.bg);
    root.style.setProperty('--ivory', colors.bg);
    root.style.setProperty('--bg-primary', colors.bg);
  }
  if (colors.surface) {
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--beige', colors.surface);
    root.style.setProperty('--cream', colors.surface);
    root.style.setProperty('--bg-secondary', colors.surface);
  }
  if (colors.ink) {
    root.style.setProperty('--color-ink', colors.ink);
    root.style.setProperty('--black', colors.ink);
    root.style.setProperty('--off-black', colors.ink);
    root.style.setProperty('--espresso', colors.ink);
    root.style.setProperty('--text-primary', colors.ink);
    root.style.setProperty('--text-dark', colors.ink);
  }
  if (colors.inkMuted) {
    root.style.setProperty('--color-ink-muted', colors.inkMuted);
    root.style.setProperty('--bronze', colors.inkMuted);
    root.style.setProperty('--warm-grey', colors.inkMuted);
    root.style.setProperty('--text-muted', colors.inkMuted);
  }
  if (colors.accent) {
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--gold', colors.accent);
    root.style.setProperty('--accent', colors.accent);
  }
  if (colors.stone) {
    root.style.setProperty('--color-stone', colors.stone);
    root.style.setProperty('--linen', colors.stone);
    root.style.setProperty('--border', colors.stone);
  }
  if (colors.dark) {
    root.style.setProperty('--color-dark', colors.dark);
    root.style.setProperty('--bg-dark', colors.dark);
  }

  // Adjust contrast white if background is dark
  if (colors.bg && (colors.bg.toLowerCase().startsWith('#1') || colors.bg.toLowerCase().startsWith('#0'))) {
    root.style.setProperty('--color-white', '#1E1E1C');
  } else {
    root.style.setProperty('--color-white', '#FAF8F5');
  }

  // Font Display
  if (theme.fontDisplay) {
    root.style.setProperty('--font-display', theme.fontDisplay);
  }
}

export default function ThemeSync() {
  useEffect(() => {
    // 1. Immediate apply from localStorage
    try {
      const cached = localStorage.getItem('zevro_custom_theme');
      if (cached) {
        const parsed = JSON.parse(cached);
        applyThemeToDocument(parsed);
      }
    } catch (e) {}

    // 2. Fetch from DB
    async function fetchServerTheme() {
      try {
        const res = await fetch('/api/theme');
        if (res.ok) {
          const data = await res.json();
          if (data.theme) {
            localStorage.setItem('zevro_custom_theme', JSON.stringify(data.theme));
            applyThemeToDocument(data.theme);
          }
        }
      } catch (err) {}
    }

    fetchServerTheme();

    // 3. Listen to live theme changes across tabs or admin
    const handleThemeChange = (event: any) => {
      if (event.detail) {
        applyThemeToDocument(event.detail);
      }
    };

    window.addEventListener('zevro-theme-changed', handleThemeChange);
    return () => window.removeEventListener('zevro-theme-changed', handleThemeChange);
  }, []);

  return null;
}
