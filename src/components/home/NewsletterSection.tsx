'use client';

import React, { useState } from 'react';

export interface NewsletterSectionProps {
  headline?: string;
  subheadline?: string;
  buttonText?: string;
}

export default function NewsletterSection({
  headline = 'JOIN THE ATELIER CIRCLE',
  subheadline = 'Receive private invitations to seasonal edits, bespoke appointments, and 10% honorarium on your inaugural acquisition.',
  buttonText = 'REQUEST INVITATION',
}: NewsletterSectionProps = {}) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="atelier-newsletter-section">
      <div className="container">
        <div className="newsletter-luxury-card">
          {/* Subtle Ambient Vignette */}
          <div className="card-ambient-glow" />

          <div className="newsletter-content">
            <div className="nl-tag-row">
              <span className="nl-star">✦</span>
              <span className="nl-tag">PRIVATE ACCESS</span>
              <span className="nl-star">✦</span>
            </div>

            <h2 className="nl-headline">
              {headline}
            </h2>

            <p className="nl-subheadline">
              {subheadline}
            </p>

            <div className="nl-benefits-row">
              <div className="benefit-item">
                <span className="benefit-dot">✦</span>
                <span>Runway Previews</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-dot">✦</span>
                <span>Bespoke Styling Concierge</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-dot">✦</span>
                <span>10% Welcome Honorarium</span>
              </div>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="nl-luxury-form">
                <div className="nl-input-wrap">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your privileged email address"
                    required
                    className="nl-input"
                  />
                  <button type="submit" className="nl-submit-btn">
                    {buttonText} →
                  </button>
                </div>
                <p className="nl-privacy">
                  We honor your privacy with utmost discretion. Unsubscribe at any time.
                </p>
              </form>
            ) : (
              <div className="nl-success-box">
                <span className="success-icon">✦</span>
                <p className="success-title">Welcome to the ZEVRO Atelier Circle</p>
                <p className="success-desc">
                  Your invitation and inaugural 10% code have been dispatched to <strong>{email}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .atelier-newsletter-section {
          padding: clamp(48px, 6vw, 76px) 0;
          background-color: var(--color-bg);
          position: relative;
        }
        .newsletter-luxury-card {
          position: relative;
          background: #141412;
          color: #FAF7F2;
          border-radius: 4px;
          border: 1px solid rgba(197, 168, 105, 0.4);
          overflow: hidden;
          padding: clamp(40px, 6vw, 68px) clamp(24px, 4vw, 48px);
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        .card-ambient-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 0%,
            rgba(197, 168, 105, 0.15) 0%,
            rgba(20, 20, 18, 0.8) 60%,
            #141412 100%
          );
          pointer-events: none;
        }
        .newsletter-content {
          position: relative;
          z-index: 2;
          max-width: 680px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .nl-tag-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .nl-star {
          color: #C5A869;
          font-size: 11px;
        }
        .nl-tag {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #C5A869;
          font-weight: 600;
        }
        .nl-headline {
          font-family: var(--font-display);
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 400;
          letter-spacing: -0.01em;
          color: #FAF7F2;
          margin: 0 0 14px 0;
          line-height: 1.15;
        }
        .nl-subheadline {
          font-family: var(--font-body);
          font-size: 14px;
          line-height: 1.65;
          color: rgba(250, 247, 242, 0.8);
          margin-bottom: 24px;
        }
        .nl-benefits-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .benefit-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #C5A869;
        }
        .benefit-dot {
          font-size: 9px;
        }
        .nl-luxury-form {
          width: 100%;
          max-width: 540px;
        }
        .nl-input-wrap {
          display: flex;
          align-items: stretch;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(197, 168, 105, 0.45);
          border-radius: 3px;
          overflow: hidden;
          transition: border-color 0.3s ease;
        }
        .nl-input-wrap:focus-within {
          border-color: #C5A869;
          box-shadow: 0 0 16px rgba(197, 168, 105, 0.2);
        }
        .nl-input {
          flex: 1;
          padding: 16px 20px;
          background: transparent;
          border: none;
          color: #FAF7F2;
          font-family: var(--font-body);
          font-size: 13px;
          outline: none;
        }
        .nl-input::placeholder {
          color: rgba(250, 247, 242, 0.45);
        }
        .nl-submit-btn {
          background: #C5A869;
          color: #141412;
          border: none;
          padding: 0 24px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.3s ease;
        }
        .nl-submit-btn:hover {
          background: #DFCA95;
        }
        .nl-privacy {
          font-family: var(--font-body);
          font-size: 11px;
          color: rgba(250, 247, 242, 0.5);
          margin-top: 12px;
        }
        .nl-success-box {
          background: rgba(197, 168, 105, 0.12);
          border: 1px solid #C5A869;
          padding: 24px 32px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .success-icon {
          color: #C5A869;
          font-size: 20px;
        }
        .success-title {
          font-family: var(--font-display);
          font-size: 20px;
          color: #FAF7F2;
          margin: 0;
        }
        .success-desc {
          font-family: var(--font-body);
          font-size: 13px;
          color: rgba(250, 247, 242, 0.85);
          margin: 0;
        }
        @media (max-width: 640px) {
          .nl-input-wrap {
            flex-direction: column;
          }
          .nl-submit-btn {
            padding: 14px 20px;
          }
          .nl-benefits-row {
            gap: 12px;
            flex-direction: column;
          }
        }
      `}} />
    </section>
  );
}
