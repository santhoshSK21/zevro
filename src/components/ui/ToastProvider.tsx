'use client';

import React from 'react';
import { useUiStore } from '../../store/uiStore';
import { AnimatePresence, motion } from 'framer-motion';

export default function ToastProvider() {
  const { toasts, removeToast } = useUiStore();

  return (
    <div style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none' }}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ 
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: '300px',
              padding: '16px 24px',
              backgroundColor: toast.type === 'error' ? 'var(--color-error)' : 'var(--color-ink)',
              color: 'var(--color-white)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase'
            }}
          >
            <span>{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)} 
              style={{ marginLeft: '16px', color: 'inherit', opacity: 0.7, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
