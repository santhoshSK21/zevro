import React from 'react';
import Link from 'next/link';

export default function ShippingPolicyPage() {
  const tiers = [
    {
      title: 'Complimentary Domestic Delivery',
      time: '3 – 5 Business Days',
      cost: 'FREE on orders above ₹999',
      sub: '(₹99 flat fee on orders below ₹999)',
      features: ['Air Express courier partners (BlueDart, Delhivery, DTDC)', 'Full transit insurance coverage', 'Doorstep OTP verification']
    },
    {
      title: 'Priority Atelier Dispatch',
      time: '1 – 2 Business Days',
      cost: '₹250 Flat Rate',
      sub: 'Available across major metro corridors',
      features: ['Same-day atelier packing & priority hand-off', 'Dedicated courier tracking concierge', 'Expedited route allocation']
    },
    {
      title: 'Global International Shipping',
      time: '5 – 8 Business Days',
      cost: 'Calculated at Checkout (DHL / FedEx Express)',
      sub: 'Over 65 countries serviced worldwide',
      features: ['White-glove international air freight', 'Complete customs clearance assistance', 'End-to-end milestone tracking']
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--ivory, #FAF8F5)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Header */}
      <div style={{ position: 'relative', height: '40vh', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=1600&auto=format&fit=crop&q=80" 
          alt="ZEVRO Global Shipping & Packaging" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.4), rgba(15,23,42,0.75))' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#FFF', padding: '0 20px' }}>
          <span style={{ fontFamily: 'var(--font-ui, sans-serif)', fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            WORLDWIDE DISPATCH
          </span>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(32px, 4.5vw, 50px)', letterSpacing: '0.06em', margin: 0 }}>
            SHIPPING & FULFILLMENT
          </h1>
          <p style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', fontSize: '16px', color: '#E2E8F0', marginTop: '8px' }}>
            White-glove handling, secure packaging, and reliable express transit.
          </p>
        </div>
      </div>

      <main className="container" style={{ padding: '64px 24px 80px', flex: 1, maxWidth: '1040px', margin: '0 auto', width: '100%' }}>
        
        {/* Shipping Tiers Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {tiers.map((tier, idx) => (
            <div key={idx} style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '32px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#B49A68', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  TIER {idx + 1}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '20px', color: '#0F172A', marginBottom: '12px' }}>
                  {tier.title}
                </h3>
                <div style={{ background: '#F8F6F0', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', margin: 0 }}>
                    {tier.cost}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                    Est. Transit: {tier.time}
                  </p>
                  {tier.sub && <p style={{ fontSize: '11px', color: '#94A3B8', margin: '2px 0 0 0' }}>{tier.sub}</p>}
                </div>

                <ul style={{ paddingLeft: '18px', fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {tier.features.map((f, fIdx) => (
                    <li key={fIdx} style={{ marginBottom: '6px' }}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Packaging & Handling Note */}
        <div style={{ background: '#F8F6F0', border: '1px solid #EAE6DF', padding: '36px', borderRadius: '4px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#B49A68', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              SIGNATURE PACKAGING
            </span>
            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '24px', color: '#0F172A', marginBottom: '12px' }}>
              The ZEVRO Unboxing Experience
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: '0 0 16px 0' }}>
              Every order arrives sealed in our signature rigid matte box, wrapped with acid-free protective tissue paper and sealed with embossed metallic ribbon. Garments are carefully folded to preserve weave structure and prevent creasing.
            </p>
            <Link 
              href="/track"
              style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0F172A', fontWeight: 600, textDecoration: 'underline' }}
            >
              Track an existing shipment →
            </Link>
          </div>

          <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '24px', borderRadius: '4px' }}>
            <h4 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '16px', color: '#0F172A', marginBottom: '12px' }}>Important Fulfillment Details</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#64748B' }}>
              <p style={{ margin: 0 }}>📦 <strong>Order Cut-Off:</strong> Orders placed before 2:00 PM IST dispatch the same business day.</p>
              <p style={{ margin: 0 }}>📍 <strong>Tracking Email:</strong> Tracking IDs activate within 4 hours of courier pickup.</p>
              <p style={{ margin: 0 }}>🛡️ <strong>Damage Guarantee:</strong> Report any transit damage within 24 hours for immediate priority replacement.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}