'use client';

import React, { useEffect, useState } from 'react';
import { useUiStore } from '../../store/uiStore';
import { usePathname } from 'next/navigation';

export default function AnnouncementBar() {
  const { announcementBarVisible, hideAnnouncementBar, initAnnouncementBar } = useUiStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    initAnnouncementBar();
    setMounted(true);
  }, [initAnnouncementBar]);

  if (!mounted || !announcementBarVisible || pathname?.startsWith('/admin')) return null;

  const msg = "FREE SHIPPING ABOVE ₹999  ·  ZEVRO10 FOR 10% OFF  ·  NEW ARRIVALS EVERY FRIDAY  ·  EASY 7-DAY RETURNS  ·  ";

  return (
    <div style={{
      backgroundColor: '#050505',
      color: '#F6EFE7',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-body)',
      fontSize: '11px',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      fontWeight: 500
    }}>
      <div style={{
        display: 'flex',
        whiteSpace: 'nowrap',
        animation: 'marquee 25s linear infinite',
      }}>
        <span>{msg}</span>
        <span>{msg}</span>
      </div>
      <button 
        onClick={hideAnnouncementBar}
        style={{
          position: 'absolute',
          right: '16px',
          color: '#F6EFE7',
          opacity: 0.7,
          fontSize: '16px',
          padding: '4px'
        }}
        aria-label="Close"
      >
        ✕
      </button>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 
          from { transform: translateX(0); } 
          to { transform: translateX(-50%); } 
        }
      `}} />
    </div>
  );
}
