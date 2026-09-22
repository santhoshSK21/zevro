import React from 'react';
import Link from 'next/link';

export default function ReturnsPage() {
  const steps = [
    {
      num: '01',
      title: 'Initiate Request',
      desc: 'Visit your Account Orders portal within 7 days of delivery and tap "Request Return / Exchange".'
    },
    {
      num: '02',
      title: 'Complimentary Pickup',
      desc: 'Our logistics courier partners schedule a doorstep collection from your location at zero additional charge.'
    },
    {
      num: '03',
      title: 'Quality Assessment',
      desc: 'Our atelier inspects the returned item (original tags, unworn condition, authentic packaging).'
    },
    {
      num: '04',
      title: 'Instant Refund / Exchange',
      desc: 'Refunds are disbursed back to your original payment method or instant store credit within 48 hours.'
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--ivory, #FAF8F5)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Header */}
      <div style={{ position: 'relative', height: '40vh', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1600&auto=format&fit=crop&q=80" 
          alt="ZEVRO White Glove Packaging" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.4), rgba(15,23,42,0.75))' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#FFF', padding: '0 20px' }}>
          <span style={{ fontFamily: 'var(--font-ui, sans-serif)', fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            SEAMLESS CLIENT CARE
          </span>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(32px, 4.5vw, 50px)', letterSpacing: '0.06em', margin: 0 }}>
            RETURNS & EXCHANGES
          </h1>
          <p style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', fontSize: '16px', color: '#E2E8F0', marginTop: '8px' }}>
            A graceful, stress-free return process for your complete peace of mind.
          </p>
        </div>
      </div>

      <main className="container" style={{ padding: '64px 24px 80px', flex: 1, maxWidth: '1040px', margin: '0 auto', width: '100%' }}>
        
        {/* Intro Highlight */}
        <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '36px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '48px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B49A68', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            7-DAY COMPLIMENTARY RETURN PROMISE
          </span>
          <h2 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '28px', color: '#0F172A', marginBottom: '16px' }}>
            Perfection in Fit & Finish, Guaranteed
          </h2>
          <p style={{ color: '#64748B', fontSize: '15px', maxWidth: '640px', margin: '0 auto 24px', lineHeight: 1.7 }}>
            If a garment does not fit flawlessly or match your expectations, we gladly offer complimentary returns and size exchanges within 7 calendar days of delivery.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/account/orders" 
              className="btn btn-primary" 
              style={{ display: 'inline-block', padding: '14px 28px', background: '#0F172A', color: '#FAF8F5', textDecoration: 'none', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}
            >
              GO TO MY ORDERS
            </Link>
            <Link 
              href="/contact" 
              style={{ display: 'inline-block', padding: '13px 24px', border: '1px solid #0F172A', color: '#0F172A', textDecoration: 'none', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}
            >
              CONTACT CONCIERGE
            </Link>
          </div>
        </div>

        {/* Step-by-Step Return Process */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '24px', color: '#0F172A', margin: 0 }}>
              How the Return Process Works
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {steps.map((s, idx) => (
              <div key={idx} style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '24px', borderRadius: '4px', position: 'relative' }}>
                <span style={{ fontSize: '28px', fontFamily: 'var(--font-display, serif)', color: '#B49A68', opacity: 0.8, fontWeight: 700, display: 'block', marginBottom: '12px' }}>
                  {s.num}
                </span>
                <h4 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '16px', color: '#0F172A', marginBottom: '8px' }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines Table/List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <div style={{ background: '#F8F6F0', border: '1px solid #EAE6DF', padding: '28px', borderRadius: '4px' }}>
            <h4 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '18px', color: '#0F172A', marginBottom: '14px' }}>
              Eligible for Return
            </h4>
            <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#475569', lineHeight: 1.8, margin: 0 }}>
              <li>Garments in their original, unwashed, and unworn condition.</li>
              <li>Original ZEVRO brand tags and hygiene ribbons intact.</li>
              <li>Returned within 7 days from the tracking delivery date.</li>
              <li>Original packaging box or protective sleeve included.</li>
            </ul>
          </div>

          <div style={{ background: '#F8F6F0', border: '1px solid #EAE6DF', padding: '28px', borderRadius: '4px' }}>
            <h4 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '18px', color: '#0F172A', marginBottom: '14px' }}>
              Non-Returnable Items
            </h4>
            <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#475569', lineHeight: 1.8, margin: 0 }}>
              <li>Custom-altered or bespoke-tailored garments made to special order.</li>
              <li>Pierced jewelry / select intimate accessories for hygiene reasons.</li>
              <li>Items marked as "Final Archive Sale" during seasonal flash sales.</li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}