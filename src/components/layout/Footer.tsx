'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/superadmin') || pathname?.startsWith('/adminControl')) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="zevro-luxury-footer">
      <div className="container footer-inner">
        
        {/* Main 5-Column Grid */}
        <div className="footer-grid">
          
          {/* Col 1: Brand & Bio */}
          <div className="footer-col footer-col-brand">
            <h3 className="footer-brand-title">ZEVRO</h3>
            <p className="footer-brand-tagline">
              Modern silhouettes. Timeless traditions. Crafted for the woman who does it all.
            </p>
            <div className="footer-brand-contact">
              <a href="mailto:concierge@zevro.com" className="footer-contact-link">concierge@zevro.com</a>
              <span className="footer-location-tag">Mumbai • London • New York</span>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div className="footer-col">
            <h4 className="footer-col-header">SHOP</h4>
            <ul className="footer-links">
              <li><Link href="/products?category=new-in">New Arrivals</Link></li>
              <li><Link href="/category/western-wear">Western Wear</Link></li>
              <li><Link href="/category/ethnic-wear">Ethnic Wear</Link></li>
              <li><Link href="/category/indo-western">Indo-Western</Link></li>
              <li><Link href="/category/accessories">Accessories</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="footer-col">
            <h4 className="footer-col-header">CUSTOMER CARE</h4>
            <ul className="footer-links">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/shipping-policy">Shipping & Delivery</Link></li>
              <li><Link href="/returns">Returns & Exchanges</Link></li>
              <li><Link href="/track">Track Order</Link></li>
              <li><Link href="/size-guide">Size Guide</Link></li>
            </ul>
          </div>

          {/* Col 4: About */}
          <div className="footer-col">
            <h4 className="footer-col-header">ABOUT</h4>
            <ul className="footer-links">
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/about">Craftsmanship</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Col 5: Newsletter & Follow (Fills right side) */}
          <div className="footer-col footer-col-newsletter">
            <h4 className="footer-col-header newsletter-gold">JOIN OUR WORLD</h4>
            <p className="footer-newsletter-sub">
              Subscribe for private previews, collection launches, and editorial stories.
            </p>
            {subscribed ? (
              <p className="footer-subscribed-msg">Thank you for subscribing to Zevro.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL"
                  required
                  className="footer-email-input"
                />
                <button type="submit" className="footer-submit-btn">
                  SUBSCRIBE
                </button>
              </form>
            )}

            <div className="footer-social-wrap">
              <span className="footer-social-label">FOLLOW US</span>
              <div className="footer-social-links">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-badge">Instagram</a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="footer-social-badge">Pinterest</a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-badge">Facebook</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright-text">
            © {new Date().getFullYear()} ZEVRO. All rights reserved.
          </p>
          <div className="footer-legal-row">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <span className="legal-dot">•</span>
            <Link href="/terms">Terms & Conditions</Link>
            <span className="legal-dot">•</span>
            <Link href="/shipping-policy">Shipping Policy</Link>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .zevro-luxury-footer {
          background-color: var(--color-dark, #1B1B19);
          color: #FAF8F5;
          padding-top: 48px;
          padding-bottom: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-family: var(--font-body, sans-serif);
          width: 100%;
        }
        .footer-inner {
          width: 100%;
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 var(--container-gutter);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.9fr 1.1fr 0.9fr 1.6fr;
          gap: 36px;
          margin-bottom: 36px;
          width: 100%;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
        }
        .footer-brand-title {
          font-family: var(--font-display, serif);
          font-size: 22px;
          letter-spacing: 0.18em;
          color: #FAF8F5;
          margin: 0 0 10px 0;
          font-weight: 500;
        }
        .footer-brand-tagline {
          font-size: 12px;
          line-height: 1.6;
          color: #9E978E;
          margin: 0 0 16px 0;
          max-width: 260px;
        }
        .footer-brand-contact {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .footer-contact-link {
          font-size: 12px;
          color: #B49A68;
          text-decoration: none;
          letter-spacing: 0.02em;
        }
        .footer-contact-link:hover {
          color: #FAF8F5;
        }
        .footer-location-tag {
          font-size: 11px;
          color: #6E6860;
          letter-spacing: 0.04em;
        }
        .footer-col-header {
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #FAF8F5;
          margin: 0 0 14px 0;
        }
        .footer-col-header.newsletter-gold {
          color: #B49A68;
        }
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .footer-links a {
          font-size: 12px;
          color: #9E978E;
          text-decoration: none;
          letter-spacing: 0.01em;
          line-height: 1.4;
          transition: color 0.2s ease, transform 0.2s ease;
          display: inline-block;
        }
        .footer-links a:hover {
          color: #FAF8F5;
          transform: translateX(2px);
        }
        .footer-newsletter-sub {
          font-size: 12px;
          color: #9E978E;
          margin: 0 0 12px 0;
          line-height: 1.5;
        }
        .footer-newsletter-form {
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.22);
          padding-bottom: 6px;
          margin-bottom: 20px;
          transition: border-color 0.25s ease;
        }
        .footer-newsletter-form:focus-within {
          border-color: #B49A68;
        }
        .footer-email-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #FAF8F5;
          font-size: 12px;
          letter-spacing: 0.05em;
          outline: none;
          padding: 2px 0;
        }
        .footer-email-input::placeholder {
          color: #6E6860;
          font-size: 11px;
          letter-spacing: 0.08em;
        }
        .footer-submit-btn {
          background: transparent;
          border: none;
          color: #B49A68;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          padding: 2px 0 2px 8px;
          transition: color 0.2s;
        }
        .footer-submit-btn:hover {
          color: #FAF8F5;
        }
        .footer-subscribed-msg {
          font-size: 12px;
          color: #B49A68;
          margin: 0 0 20px 0;
        }
        .footer-social-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .footer-social-label {
          font-family: var(--font-ui);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: #6E6860;
          text-transform: uppercase;
        }
        .footer-social-links {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .footer-social-badge {
          font-size: 12px;
          color: #9E978E;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-social-badge:hover {
          color: #FAF8F5;
        }
        .footer-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-copyright-text {
          font-size: 11px;
          color: #6E6860;
          letter-spacing: 0.03em;
          margin: 0;
        }
        .footer-legal-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .footer-legal-row a {
          font-size: 11px;
          color: #6E6860;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-legal-row a:hover {
          color: #FAF8F5;
        }
        .legal-dot {
          font-size: 8px;
          color: #444;
        }
        @media (max-width: 1080px) {
          .footer-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 28px;
          }
          .footer-col-newsletter {
            grid-column: span 3;
            max-width: 480px;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .footer-col-brand {
            grid-column: span 2;
          }
          .footer-col-newsletter {
            grid-column: span 2;
          }
          .footer-bottom-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}} />
    </footer>
  );
}
