'use client';

import React, { useState } from 'react';

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [tab, setTab] = useState<'western' | 'ethnic'>('western');

  // Multiplier for cm conversion
  const toUnit = (valIn: number) => {
    return unit === 'in' ? valIn : Math.round(valIn * 2.54);
  };

  return (
    <div style={{ backgroundColor: 'var(--ivory, #FAF8F5)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Header */}
      <div style={{ position: 'relative', height: '42vh', minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=1600&auto=format&fit=crop&q=80" 
          alt="ZEVRO Atelier Tailoring & Measuring" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.4), rgba(15,23,42,0.75))' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#FFF', padding: '0 20px' }}>
          <span style={{ fontFamily: 'var(--font-ui, sans-serif)', fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            FIT & PROPORTION
          </span>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(32px, 4.5vw, 52px)', letterSpacing: '0.06em', margin: 0 }}>
            BESPOKE SIZE GUIDE
          </h1>
          <p style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', fontSize: '16px', color: '#E2E8F0', marginTop: '8px' }}>
            Tailored precision designed for modern grace and comfort.
          </p>
        </div>
      </div>

      <main className="container" style={{ padding: '64px 24px 80px', flex: 1, maxWidth: '1040px', margin: '0 auto', width: '100%' }}>
        
        {/* Controls: Category tabs & Unit switch */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '20px', marginBottom: '36px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setTab('western')}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: tab === 'western' ? '#0F172A' : '#F1F5F9',
                color: tab === 'western' ? '#FAF8F5' : '#475569',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Western & Indo-Western
            </button>
            <button
              onClick={() => setTab('ethnic')}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: tab === 'ethnic' ? '#0F172A' : '#F1F5F9',
                color: tab === 'ethnic' ? '#FAF8F5' : '#475569',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Ethnic Kurtas & Sarees
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFF', border: '1px solid #CBD5E1', padding: '4px', borderRadius: '4px' }}>
            <button
              onClick={() => setUnit('in')}
              style={{
                padding: '6px 14px',
                border: 'none',
                background: unit === 'in' ? '#0F172A' : 'transparent',
                color: unit === 'in' ? '#FAF8F5' : '#64748B',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: '2px'
              }}
            >
              INCHES (IN)
            </button>
            <button
              onClick={() => setUnit('cm')}
              style={{
                padding: '6px 14px',
                border: 'none',
                background: unit === 'cm' ? '#0F172A' : 'transparent',
                color: unit === 'cm' ? '#FAF8F5' : '#64748B',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: '2px'
              }}
            >
              CENTIMETERS (CM)
            </button>
          </div>
        </div>

        {/* Table & Visual Guide Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
          
          {/* Size Chart */}
          <div style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: '24px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '20px', color: '#0F172A', marginBottom: '16px' }}>
              Standard Atelier Measurements ({unit.toUpperCase()})
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #0F172A' }}>
                    <th style={{ padding: '12px 8px', fontWeight: 600, color: '#0F172A' }}>Size</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600, color: '#0F172A' }}>Bust</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600, color: '#0F172A' }}>Waist</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600, color: '#0F172A' }}>Hip</th>
                    <th style={{ padding: '12px 8px', fontWeight: 600, color: '#0F172A' }}>Length</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: 'XS (34)', bust: 32, waist: 26, hip: 34, length: 44 },
                    { size: 'S (36)', bust: 34, waist: 28, hip: 36, length: 44.5 },
                    { size: 'M (38)', bust: 36, waist: 30, hip: 38, length: 45 },
                    { size: 'L (40)', bust: 38, waist: 32, hip: 40, length: 45.5 },
                    { size: 'XL (42)', bust: 40, waist: 34, hip: 42, length: 46 },
                    { size: 'XXL (44)', bust: 42, waist: 36, hip: 44, length: 46 }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 1 ? '#FAF9F7' : '#FFF' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 600, color: '#0F172A' }}>{row.size}</td>
                      <td style={{ padding: '12px 8px', color: '#475569' }}>{toUnit(row.bust)}</td>
                      <td style={{ padding: '12px 8px', color: '#475569' }}>{toUnit(row.waist)}</td>
                      <td style={{ padding: '12px 8px', color: '#475569' }}>{toUnit(row.hip)}</td>
                      <td style={{ padding: '12px 8px', color: '#475569' }}>{toUnit(row.length)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '16px', fontStyle: 'italic', margin: '16px 0 0 0' }}>
              * For custom measurements or bespoke bridal styling, select "Bespoke Size" during checkout or contact our concierge.
            </p>
          </div>

          {/* How to Measure Card with Visuals */}
          <div style={{ background: '#F8F6F0', border: '1px solid #EAE6DF', padding: '32px', borderRadius: '4px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#B49A68', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              TAILOR'S ADVICE
            </span>
            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '22px', color: '#0F172A', marginBottom: '20px' }}>
              How to Measure Yourself
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '13px', color: '#0F172A', marginBottom: '4px' }}>1. Bust / Chest</strong>
                <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                  Place the tape measure under your arms at the fullest part of your chest. Keep the tape horizontal and comfortably snug without pinching.
                </p>
              </div>

              <div>
                <strong style={{ display: 'block', fontSize: '13px', color: '#0F172A', marginBottom: '4px' }}>2. Natural Waist</strong>
                <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                  Measure around your natural waistline, which is the narrowest point of your torso, typically an inch above your navel.
                </p>
              </div>

              <div>
                <strong style={{ display: 'block', fontSize: '13px', color: '#0F172A', marginBottom: '4px' }}>3. Hips</strong>
                <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                  Stand with your heels together and measure around the fullest part of your hips and seat.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '28px', borderTop: '1px solid #E2E8F0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Unsure between sizes?</span>
              <a href="/contact" style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B49A68', fontWeight: 600, textDecoration: 'none' }}>
                Ask a Stylist →
              </a>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}