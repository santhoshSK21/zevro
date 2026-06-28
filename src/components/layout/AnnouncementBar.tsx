'use client';

import React, { useEffect, useState } from 'react';
import { useUiStore } from '../../store/uiStore';
import { useConfigStore } from '../../store/configStore';
import { usePathname } from 'next/navigation';

export default function AnnouncementBar() {
  const { announcementBarVisible, hideAnnouncementBar, initAnnouncementBar } = useUiStore();
  const { config, fetchConfig } = useConfigStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    initAnnouncementBar();
    if (!config) fetchConfig();
    setMounted(true);
  }, [initAnnouncementBar, config, fetchConfig]);

  if (!mounted || !announcementBarVisible || pathname?.startsWith('/admin')) return null;
  if (!config?.announcementText) return null;

  const msg = `${config.announcementText}  ·  `;

  return (
    <div className="announcement-bar">
      <div className="announcement-marquee">
        <span>{msg}</span>
        <span>{msg}</span>
      </div>
      <button
        onClick={hideAnnouncementBar}
        className="announcement-close"
        aria-label="Close"
      >
        ✕
      </button>
      <style dangerouslySetInnerHTML={{__html: `
        .announcement-bar {
          background-color: var(--color-ink);
          color: var(--color-white);
          height: 40px;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          font-family: var(--font-ui);
          font-size: var(--text-xs);
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
          font-weight: 500;
        }
        .announcement-marquee {
          display: flex;
          white-space: nowrap;
          animation: marquee 25s linear infinite;
        }
        .announcement-close {
          position: absolute;
          right: 16px;
          color: var(--color-white);
          opacity: 0.7;
          font-size: 16px;
          padding: 4px;
        }
        .announcement-close:hover {
          opacity: 1;
        }
      `}} />
    </div>
  );
}
