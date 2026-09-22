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

  if (!mounted || !announcementBarVisible || pathname?.startsWith('/admin') || pathname?.startsWith('/superadmin') || pathname?.startsWith('/adminControl')) return null;
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
          background-color: #161614;
          color: #FAF8F5;
          height: 38px;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 1002;
          overflow: hidden;
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .announcement-marquee {
          display: flex;
          white-space: nowrap;
          animation: marquee 28s linear infinite;
        }
        .announcement-close {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          font-size: 11px;
          padding: 4px 8px;
          transition: color 0.2s ease;
          z-index: 2;
        }
        .announcement-close:hover {
          color: #FAF8F5;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 640px) {
          .announcement-bar {
            height: 34px;
            font-size: 10px;
          }
        }
      `}} />
    </div>
  );
}
