import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory, #FAF8F5)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Banner */}
      <div style={{ position: 'relative', height: '32vh', minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1600&auto=format&fit=crop&q=80" 
          alt="ZEVRO Privacy & Security" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.4), rgba(15,23,42,0.8))' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#FFF', padding: '0 20px' }}>
          <span style={{ fontFamily: 'var(--font-ui, sans-serif)', fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            DATA INTEGRITY & TRUST
          </span>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(30px, 4vw, 46px)', letterSpacing: '0.06em', margin: 0 }}>
            PRIVACY POLICY
          </h1>
          <p style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', fontSize: '15px', color: '#E2E8F0', marginTop: '6px' }}>
            Safeguarding your personal data and client discretion with bank-grade encryption.
          </p>
        </div>
      </div>

      <main className="container" style={{ padding: '56px 24px 80px', flex: 1, maxWidth: '860px', margin: '0 auto', width: '100%' }}>
        <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '36px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ color: '#475569', lineHeight: 1.8, fontSize: '14px' }}>
            <p style={{ fontSize: '15px', color: '#0F172A', fontWeight: 500, marginBottom: '24px' }}>
              ZEVRO respects your privacy and is unwaveringly committed to protecting your personal data. This privacy document outlines how we collect, process, and safeguard your details during your journey across our digital store and ateliers.
            </p>

            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '20px', color: '#0F172A', marginTop: '28px', marginBottom: '12px' }}>
              1. Information We Collect
            </h3>
            <p>
              We collect information that you directly provide when registering an account, placing bespoke orders, subscribing to atelier editorials, or reaching out to our client concierge:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              <li><strong>Personal Identifiers:</strong> Name, billing and delivery addresses, email address, and phone number.</li>
              <li><strong>Bespoke Measurements:</strong> Optional fit profiles provided for customized tailoring consultations.</li>
              <li><strong>Payment Information:</strong> Encrypted transaction identifiers processed securely via PCI-DSS certified gateways (Razorpay, Stripe). We never store raw card numbers.</li>
            </ul>

            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '20px', color: '#0F172A', marginTop: '28px', marginBottom: '12px' }}>
              2. How We Utilize Your Data
            </h3>
            <p>
              Your data is employed solely to provide a seamless haute couture experience:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              <li>Processing, fulfilling, and dispatching your orders with our air express courier partners.</li>
              <li>Delivering automated tracking updates and delivery status notifications.</li>
              <li>Offering personalized client concierge styling recommendations upon request.</li>
            </ul>

            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '20px', color: '#0F172A', marginTop: '28px', marginBottom: '12px' }}>
              3. Data Protection & Encryption
            </h3>
            <p>
              All communication between your browser and our servers is secured with 256-bit TLS/SSL encryption. We will never sell, lease, or monetize your personal data with third-party advertising brokers.
            </p>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '24px', marginTop: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Last Updated: March 2026</span>
              <Link href="/contact" style={{ fontSize: '12px', color: '#B49A68', fontWeight: 600, textDecoration: 'none' }}>
                Contact Data Protection Officer →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}