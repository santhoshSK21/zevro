'use client';

import React, { useEffect, useState } from 'react';
import { useConfigStore } from '../../store/configStore';

export default function ContactPage() {
  const { config, fetchConfig } = useConfigStore();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!config) fetchConfig();
  }, [config, fetchConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div style={{ backgroundColor: 'var(--ivory, #FAF8F5)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Banner with Subtle Gradient */}
      <div style={{ position: 'relative', height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1600&auto=format&fit=crop&q=80" 
          alt="ZEVRO Flagship Boutique" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.4), rgba(15,23,42,0.75))' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#FFF', padding: '0 20px' }}>
          <span style={{ fontFamily: 'var(--font-ui, sans-serif)', fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            CLIENT RELATIONS
          </span>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(32px, 4.5vw, 50px)', letterSpacing: '0.06em', margin: 0 }}>
            CONNECT WITH {config?.storeName || 'ZEVRO'}
          </h1>
          <p style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', fontSize: '16px', color: '#E2E8F0', marginTop: '8px' }}>
            Our stylists & client concierges are at your complete service.
          </p>
        </div>
      </div>

      <main className="container" style={{ padding: '64px 24px 80px', flex: 1, maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
          
          {/* Direct Concierge Cards */}
          <div>
            <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '32px', borderRadius: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '22px', color: '#0F172A', marginBottom: '16px' }}>
                Bespoke Client Concierge
              </h3>
              <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                For personalized styling consultations, bespoke tailoring requests, or order inquiries, reach out through our dedicated channels.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    ✉️
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: '#0F172A', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Direct Email</strong>
                    <a href={`mailto:${config?.supportEmail || 'concierge@zevro.in'}`} style={{ color: '#B49A68', textDecoration: 'none', fontWeight: 500 }}>
                      {config?.supportEmail || 'concierge@zevro.in'}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    📞
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: '#0F172A', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Phone Concierge</strong>
                    <a href={`tel:${config?.supportPhone || '+919876543210'}`} style={{ color: '#0F172A', textDecoration: 'none' }}>
                      {config?.supportPhone || '+91 98765 43210'}
                    </a>
                  </div>
                </div>

                {config?.whatsappNumber && (
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                      💬
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#0F172A', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>WhatsApp VIP Line</strong>
                      <a href={`https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#16A34A', textDecoration: 'none', fontWeight: 500 }}>
                        {config.whatsappNumber}
                      </a>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    🕒
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: '#0F172A', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Operating Hours</strong>
                    <span style={{ color: '#64748B' }}>{config?.supportHours || 'Monday – Saturday: 9:00 AM – 7:00 PM IST'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Atelier Address Card */}
            <div style={{ background: '#F8F6F0', border: '1px solid #EAE6DF', padding: '24px', borderRadius: '4px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#B49A68', fontWeight: 600 }}>FLAGSHIP ATELIER</span>
              <h4 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '18px', color: '#0F172A', margin: '6px 0 8px 0' }}>ZEVRO Maison</h4>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                14/B Heritage Boulevard, Indiranagar<br />
                Bengaluru, Karnataka 560038, India
              </p>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '36px', borderRadius: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '24px', color: '#0F172A', marginBottom: '8px' }}>
              Send an Inquiry
            </h3>
            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>
              Fill out the form below and an atelier representative will reply within 24 hours.
            </p>

            {submitted ? (
              <div style={{ padding: '24px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', borderRadius: '4px', textAlign: 'center' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>Message Received</h4>
                <p style={{ fontSize: '13px', margin: 0 }}>Thank you for writing to ZEVRO. A client advisor will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', fontWeight: 600, marginBottom: '6px' }}>Full Name *</label>
                    <input type="text" required placeholder="e.g. Priya Sharma" style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#FAF9F7' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', fontWeight: 600, marginBottom: '6px' }}>Email Address *</label>
                    <input type="email" required placeholder="e.g. priya@domain.com" style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#FAF9F7' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', fontWeight: 600, marginBottom: '6px' }}>Subject / Reason for Inquiry *</label>
                  <input type="text" required placeholder="e.g. Bespoke Fitting / Order Status" style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#FAF9F7' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#475569', fontWeight: 600, marginBottom: '6px' }}>Your Message *</label>
                  <textarea required rows={5} placeholder="How can our atelier assist you today?" style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#FAF9F7' }}></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ padding: '16px', background: '#0F172A', color: '#FAF8F5', border: 'none', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer', marginTop: '8px' }}
                >
                  DISPATCH INQUIRY
                </button>
              </form>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}

  