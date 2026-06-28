'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useConfigStore } from '../../store/configStore';
import { motion, useReducedMotion } from 'framer-motion';

export default function Footer() {
  const pathname = usePathname();
  const { config, fetchConfig } = useConfigStore();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!config) fetchConfig();
  }, [config, fetchConfig]);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="zevro-footer">
      {/* Top — Editorial tagline */}
      <div className="container footer-tagline-wrap">
        <motion.h2
          className="display-serif footer-tagline"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Dress with <em>Intention</em>
        </motion.h2>
      </div>

      {/* Link columns */}
      <div className="container footer-columns">
        <div className="footer-col footer-brand-col">
          <h3 className="display-serif footer-brand-name">{config?.storeName || 'ZEVRO'}</h3>
          <p className="footer-brand-desc">
            {config?.storeDescription || 'Crafting modern elegance with timeless traditions. Discover luxury fashion designed for the confident woman.'}
          </p>
          <div className="footer-social">
            {config?.instagramUrl && <a href={config.instagramUrl} target="_blank" rel="noreferrer" className="link-underline footer-social-link">Instagram</a>}
            {config?.facebookUrl && <a href={config.facebookUrl} target="_blank" rel="noreferrer" className="link-underline footer-social-link">Facebook</a>}
            {config?.xUrl && <a href={config.xUrl} target="_blank" rel="noreferrer" className="link-underline footer-social-link">X</a>}
            {config?.pinterestUrl && <a href={config.pinterestUrl} target="_blank" rel="noreferrer" className="link-underline footer-social-link">Pinterest</a>}
            {(!config?.instagramUrl && !config?.facebookUrl && !config?.xUrl && !config?.pinterestUrl) && (
              <>
                <a href="#" className="link-underline footer-social-link">Instagram</a>
                <a href="#" className="link-underline footer-social-link">Facebook</a>
                <a href="#" className="link-underline footer-social-link">X</a>
              </>
            )}
          </div>
        </div>

        <div className="footer-col">
          <h4 className="label-caps footer-col-heading">Shop</h4>
          <ul className="footer-link-list">
            <li><Link href="/new-in" className="link-underline footer-link">New Arrivals</Link></li>
            <li><Link href="/western-wear" className="link-underline footer-link">Western Wear</Link></li>
            <li><Link href="/ethnic-wear" className="link-underline footer-link">Ethnic Wear</Link></li>
            <li><Link href="/indo-western" className="link-underline footer-link">Indo-Western</Link></li>
            <li><Link href="/accessories" className="link-underline footer-link">Accessories</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="label-caps footer-col-heading">Help</h4>
          <ul className="footer-link-list">
            <li><Link href="/account" className="link-underline footer-link">My Account</Link></li>
            <li><Link href="/track" className="link-underline footer-link">Track Order</Link></li>
            <li><Link href="/returns" className="link-underline footer-link">Returns & Exchanges</Link></li>
            <li><Link href="/size-guide" className="link-underline footer-link">Size Guide</Link></li>
            <li><Link href="/faq" className="link-underline footer-link">FAQ</Link></li>
            <li><Link href="/contact" className="link-underline footer-link">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="label-caps footer-col-heading">Company</h4>
          <ul className="footer-link-list">
            <li><Link href="/about" className="link-underline footer-link">About Zevro</Link></li>
            <li><Link href="/careers" className="link-underline footer-link">Careers</Link></li>
            <li><Link href="/privacy-policy" className="link-underline footer-link">Privacy Policy</Link></li>
            <li><Link href="/terms" className="link-underline footer-link">Terms of Service</Link></li>
            <li><Link href="/shipping-policy" className="link-underline footer-link">Shipping Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container footer-bottom">
        <p className="label-caps footer-copyright">
          {config?.footerCopyright || `© ${new Date().getFullYear()} Zevro. All rights reserved.`}
        </p>
        <div className="footer-payments label-caps">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>UPI</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .zevro-footer {
          background-color: var(--color-ink);
          color: var(--color-white);
          padding-top: var(--space-24);
          padding-bottom: var(--space-8);
        }
        .footer-tagline-wrap {
          border-bottom: 1px solid rgba(255,255,255,0.15);
          padding-bottom: var(--space-16);
          margin-bottom: var(--space-16);
        }
        .footer-tagline {
          font-size: var(--text-3xl);
          color: var(--color-white);
          font-style: italic;
        }
        .footer-tagline em {
          font-style: italic;
          font-weight: 300;
        }
        .footer-columns {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: var(--space-12);
          margin-bottom: var(--space-16);
        }
        .footer-brand-name {
          font-size: var(--text-xl);
          letter-spacing: var(--tracking-tight);
          margin-bottom: var(--space-4);
          color: var(--color-white);
        }
        .footer-brand-desc {
          font-size: var(--text-sm);
          color: rgba(255,255,255,0.6);
          line-height: var(--leading-loose);
          max-width: 300px;
          margin-bottom: var(--space-6);
        }
        .footer-social {
          display: flex;
          gap: var(--space-6);
        }
        .footer-social-link {
          font-size: var(--text-sm);
          color: var(--color-white);
        }
        .footer-social-link::after {
          background: var(--color-white);
        }
        .footer-col-heading {
          color: rgba(255,255,255,0.5);
          margin-bottom: var(--space-6);
        }
        .footer-link-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .footer-link {
          font-size: var(--text-sm);
          color: rgba(255,255,255,0.75);
        }
        .footer-link::after {
          background: var(--color-white);
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: var(--space-6);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-4);
        }
        .footer-copyright {
          color: rgba(255,255,255,0.4);
        }
        .footer-payments {
          display: flex;
          gap: var(--space-4);
          color: rgba(255,255,255,0.4);
        }
        @media (max-width: 768px) {
          .footer-columns {
            grid-template-columns: 1fr 1fr;
            gap: var(--space-8);
          }
          .footer-tagline {
            font-size: var(--text-2xl);
          }
        }
        @media (max-width: 480px) {
          .footer-columns {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </footer>
  );
}
