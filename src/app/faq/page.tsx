'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FaqItem {
  q: string;
  a: string;
  cat: string;
}

export default function FaqPage() {
  const [activeCat, setActiveCat] = useState('all');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      cat: 'orders',
      q: 'How do I place a bespoke or made-to-measure order?',
      a: 'Select "Custom Sizing" on any product detail page, or write to concierge@zevro.in with your bespoke measurement profile. Our master draper will liaise with you prior to cutting.'
    },
    {
      cat: 'orders',
      q: 'Can I modify or cancel my order after placement?',
      a: 'We process orders swiftly. If you need to modify sizing or shipping addresses, please contact our VIP Concierge via WhatsApp or phone within 2 hours of order confirmation.'
    },
    {
      cat: 'payments',
      q: 'What payment methods are supported on ZEVRO?',
      a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex, RuPay), UPI (Google Pay, PhonePe, Paytm), Net Banking across 50+ banks, and Cash on Delivery (COD) on eligible domestic postal codes.'
    },
    {
      cat: 'shipping',
      q: 'How long does shipment and delivery take?',
      a: 'Domestic metro orders are dispatched within 24 hours and delivered in 2–4 business days. Regional and international shipments typically arrive within 5–8 business days via expedited air freight.'
    },
    {
      cat: 'returns',
      q: 'What is ZEVRO’s return and exchange policy?',
      a: 'We offer a complimentary 7-day return and exchange window from the date of delivery. Doorstep pickup is completely free. Items must be in unwashed, original condition with all brand security tags attached.'
    },
    {
      cat: 'care',
      q: 'How should I care for my silk and handloom garments?',
      a: 'We strongly advise professional dry cleaning for all pure mulberry silks, brocades, and zardozi embellishments. For organic linens and cotton blends, gentle cold hand washing with mild detergent is recommended.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Inquiries' },
    { id: 'orders', label: 'Orders & Bespoke' },
    { id: 'payments', label: 'Payments & Security' },
    { id: 'shipping', label: 'Shipping & Delivery' },
    { id: 'returns', label: 'Returns & Exchanges' },
    { id: 'care', label: 'Garment Care' }
  ];

  const filtered = activeCat === 'all' ? faqs : faqs.filter(f => f.cat === activeCat);

  return (
    <div style={{ backgroundColor: 'var(--ivory, #FAF8F5)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Header */}
      <div style={{ position: 'relative', height: '42vh', minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&auto=format&fit=crop&q=80" 
          alt="ZEVRO Client Concierge Consultation" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.4), rgba(15,23,42,0.75))' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#FFF', padding: '0 20px' }}>
          <span style={{ fontFamily: 'var(--font-ui, sans-serif)', fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            CLIENT ADVISORY
          </span>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(32px, 4.5vw, 50px)', letterSpacing: '0.06em', margin: 0 }}>
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', fontSize: '16px', color: '#E2E8F0', marginTop: '8px' }}>
            Everything you need to know about our atelier, fits, dispatch, and care.
          </p>
        </div>
      </div>

      <main className="container" style={{ padding: '64px 24px 80px', flex: 1, maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCat(cat.id); setOpenIdx(null); }}
              style={{
                padding: '10px 18px',
                border: 'none',
                background: activeCat === cat.id ? '#0F172A' : '#FFF',
                color: activeCat === cat.id ? '#FAF8F5' : '#475569',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: '2px',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '56px' }}>
          {filtered.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display, serif)', fontSize: '17px', color: '#0F172A', fontWeight: 600 }}>
                    {item.q}
                  </span>
                  <span style={{ fontSize: '18px', color: '#B49A68', marginLeft: '16px', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    +
                  </span>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 24px 20px', color: '#64748B', fontSize: '14px', lineHeight: 1.7, borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div style={{ background: '#F8F6F0', border: '1px solid #EAE6DF', padding: '36px', borderRadius: '4px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '22px', color: '#0F172A', marginBottom: '8px' }}>
            Have an Unanswered Question?
          </h3>
          <p style={{ color: '#64748B', fontSize: '14px', maxWidth: '520px', margin: '0 auto 20px', lineHeight: 1.6 }}>
            Our concierge team is available 6 days a week to guide you through styling, bespoke measurements, and order questions.
          </p>
          <Link
            href="/contact"
            className="btn btn-primary"
            style={{ display: 'inline-block', padding: '13px 28px', background: '#0F172A', color: '#FAF8F5', textDecoration: 'none', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}
          >
            CONTACT OUR CONCIERGE
          </Link>
        </div>

      </main>
    </div>
  );
}