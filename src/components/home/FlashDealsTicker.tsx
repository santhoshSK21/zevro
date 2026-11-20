'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Clock, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

export default function FlashDealsTicker() {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });
  const [copied, setCopied] = useState(false);
  const { addToast } = useUiStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('ATELIER15');
    setCopied(true);
    addToast('Coupon code ATELIER15 copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const formatDigit = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flash-ticker-bar">
      <div className="container flash-ticker-inner">
        {/* Left: Animated Flash Badge & Headline */}
        <div className="flash-left-group">
          <div className="flash-badge">
            <Zap size={13} className="flash-icon" />
            <span>FLASH VAULT</span>
          </div>
          <div className="flash-copy-text">
            <span>Special Atelier Privilege: Enjoy <strong>15% Savings</strong> on Autumn Edit</span>
          </div>
        </div>

        {/* Center: Live Countdown Clock */}
        <div className="flash-timer-box">
          <Clock size={13} className="timer-icon" />
          <span className="timer-label">ENDS IN:</span>
          <div className="timer-digits">
            <span className="digit-box">{formatDigit(timeLeft.hours)}h</span>
            <span className="digit-colon">:</span>
            <span className="digit-box">{formatDigit(timeLeft.minutes)}m</span>
            <span className="digit-colon">:</span>
            <span className="digit-box">{formatDigit(timeLeft.seconds)}s</span>
          </div>
        </div>

        {/* Right: Coupon Code Pill & CTA */}
        <div className="flash-action-group">
          <button 
            type="button" 
            onClick={handleCopyCode} 
            className={`coupon-copy-pill ${copied ? 'is-copied' : ''}`}
            title="Click to copy promo code"
            aria-label="Copy voucher code ATELIER15"
          >
            <span className="coupon-code">CODE: <strong>ATELIER15</strong></span>
            {copied ? <Check size={12} className="copy-icon" /> : <Copy size={12} className="copy-icon" />}
          </button>

          <Link href="/products" className="flash-cta-btn">
            <span>DISCOVER</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .flash-ticker-bar {
          background: #141412;
          color: #FAF7F2;
          border-top: 1px solid rgba(197, 168, 105, 0.35);
          border-bottom: 1px solid rgba(197, 168, 105, 0.35);
          padding: 8px 0;
          position: relative;
          z-index: 15;
        }

        .flash-ticker-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .flash-left-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .flash-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #B91C1C;
          color: #FFFFFF;
          padding: 3px 8px;
          border-radius: 4px;
          font-family: var(--font-ui);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .flash-icon {
          animation: flashPulse 1.4s infinite;
        }

        @keyframes flashPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }

        .flash-copy-text {
          font-family: var(--font-body);
          font-size: 12px;
          color: #E6E1D8;
        }

        .flash-copy-text strong {
          color: var(--color-accent, #C5A869);
        }

        .flash-timer-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(197, 168, 105, 0.3);
          border-radius: 20px;
          padding: 4px 12px;
        }

        .timer-icon {
          color: var(--color-accent, #C5A869);
        }

        .timer-label {
          font-family: var(--font-ui);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--color-accent, #C5A869);
        }

        .timer-digits {
          display: flex;
          align-items: center;
          gap: 2px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #FFFFFF;
        }

        .digit-box {
          background: rgba(0, 0, 0, 0.4);
          padding: 1px 5px;
          border-radius: 3px;
        }

        .digit-colon {
          color: var(--color-accent, #C5A869);
        }

        .flash-action-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .coupon-copy-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(197, 168, 105, 0.15);
          border: 1px dashed var(--color-accent, #C5A869);
          border-radius: 16px;
          padding: 4px 10px;
          color: #FAF7F2;
          font-family: var(--font-ui);
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .coupon-copy-pill:hover,
        .coupon-copy-pill.is-copied {
          background: var(--color-accent, #C5A869);
          color: var(--color-dark, #141412);
          border-style: solid;
        }

        .coupon-code strong {
          letter-spacing: 0.08em;
        }

        .copy-icon {
          color: var(--color-accent, #C5A869);
        }

        .coupon-copy-pill:hover .copy-icon,
        .coupon-copy-pill.is-copied .copy-icon {
          color: var(--color-dark, #141412);
        }

        .flash-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--color-accent, #C5A869);
          color: var(--color-dark, #141412);
          border: none;
          border-radius: 16px;
          padding: 5px 12px;
          font-family: var(--font-ui);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-decoration: none;
          transition: background 0.2s ease;
        }

        .flash-cta-btn:hover {
          background: #FFFFFF;
          color: #141412;
        }

        @media (max-width: 860px) {
          .flash-ticker-inner {
            justify-content: center;
            gap: 10px;
          }
          .flash-copy-text {
            display: none;
          }
        }
      `}} />
    </div>
  );
}

