'use client';
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="zevro-footer">
      <div className="container footer-columns">
        <div className="footer-col">
          <h4 className="label-caps footer-col-heading">Help</h4>
          <ul className="footer-link-list">
            <li><Link href="/account" className="footer-link">My Account</Link></li>
            <li><Link href="/track" className="footer-link">Track Order</Link></li>
            <li><Link href="/returns" className="footer-link">Returns & Exchanges</Link></li>
            <li><Link href="/size-guide" className="footer-link">Size Guide</Link></li>
            <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="label-caps footer-col-heading">Company</h4>
          <ul className="footer-link-list">
            <li><Link href="/about" className="footer-link">About Us</Link></li>
            <li><Link href="/careers" className="footer-link">Careers</Link></li>
            <li><Link href="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
            <li><Link href="/terms" className="footer-link">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="label-caps footer-col-heading">Social</h4>
          <ul className="footer-link-list">
            <li><a href="#" className="footer-link">Instagram</a></li>
            <li><a href="#" className="footer-link">TikTok</a></li>
            <li><a href="#" className="footer-link">Pinterest</a></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="label-caps footer-copyright">
          © {new Date().getFullYear()} ZEVRO.
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .zevro-footer {
          background-color: var(--color-bg);
          color: var(--color-ink);
          padding-top: var(--space-24);
          padding-bottom: var(--space-8);
          border-top: 1px solid var(--color-stone);
        }
        .footer-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-12);
          margin-bottom: var(--space-16);
        }
        .footer-col-heading {
          margin-bottom: var(--space-4);
          font-size: 10px;
          color: var(--color-ink-muted);
        }
        .footer-link-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .footer-link {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-ink);
        }
        .footer-link:hover {
          color: var(--color-ink-muted);
        }
        .footer-bottom {
          padding-top: var(--space-8);
          border-top: 1px solid var(--color-stone);
        }
        .footer-copyright {
          font-size: 10px;
          color: var(--color-ink-muted);
        }
        @media (max-width: 768px) {
          .footer-columns {
            grid-template-columns: 1fr;
            gap: var(--space-8);
          }
        }
      `}} />
    </footer>
  );
}
