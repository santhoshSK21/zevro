'use client';

import React, { useState } from 'react';

export default function SuperAdminAnalyticsPage() {
  const [timeframe, setTimeframe] = useState('30d');

  const funnelSteps = [
    { step: 'Storefront Visitors', count: '1,42,800', rate: '100%', drop: '-' },
    { step: 'Viewed Product Details', count: '68,544', rate: '48.0%', drop: '-52.0%' },
    { step: 'Added to Luxury Bag', count: '14,280', rate: '10.0%', drop: '-38.0%' },
    { step: 'Initiated Checkout', count: '7,140', rate: '5.0%', drop: '-5.0%' },
    { step: 'Payment Captured', count: '4,884', rate: '3.42%', drop: '-1.58%' },
  ];

  const citySales = [
    { city: 'Mumbai & MMR', sales: '₹18,40,000', percent: 38 },
    { city: 'Delhi-NCR', sales: '₹13,20,000', percent: 27 },
    { city: 'Bengaluru', sales: '₹7,80,000', percent: 16 },
    { city: 'Hyderabad', sales: '₹4,90,000', percent: 10 },
    { city: 'International (UK & US)', sales: '₹4,62,300', percent: 9 },
  ];

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', letterSpacing: '0.16em', color: '#D4AF37', textTransform: 'uppercase', fontWeight: 600 }}>
            PLATFORM TELEMETRY
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#FAF8F5', margin: '4px 0 0 0' }}>
            Advanced Analytics & Funnel Diagnostics
          </h1>
          <p style={{ fontSize: '13px', color: '#8E8880', margin: '4px 0 0 0' }}>
            End-to-end customer journey metrics, cohort retention, and regional order telemetry.
          </p>
        </div>

        <select 
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          style={{ padding: '10px 18px', backgroundColor: '#161614', border: '1px solid #333', borderRadius: '6px', color: '#FAF8F5', fontSize: '13px', outline: 'none' }}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last Quarter (Q3)</option>
          <option value="year">Full Year 2026</option>
        </select>
      </div>

      {/* Top Telemetry Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
          <span style={{ fontSize: '11px', color: '#8E8880', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Customer LTV (High-Tier)</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#D4AF37', margin: '6px 0 2px' }}>₹18,400</div>
          <span style={{ fontSize: '11px', color: '#81C784' }}>+14.2% vs regular baseline</span>
        </div>

        <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
          <span style={{ fontSize: '11px', color: '#8E8880', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cart Abandonment Rate</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#FAF8F5', margin: '6px 0 2px' }}>49.8%</div>
          <span style={{ fontSize: '11px', color: '#81C784' }}>-4.2% below luxury avg</span>
        </div>

        <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
          <span style={{ fontSize: '11px', color: '#8E8880', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Repeat Purchase Rate</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#64B5F6', margin: '6px 0 2px' }}>31.4%</div>
          <span style={{ fontSize: '11px', color: '#888' }}>Within 60-day window</span>
        </div>

        <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
          <span style={{ fontSize: '11px', color: '#8E8880', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Average Page Load Time</span>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#81C784', margin: '6px 0 2px' }}>0.48s</div>
          <span style={{ fontSize: '11px', color: '#888' }}>Global CDN Cache Hit: 99.2%</span>
        </div>

      </div>

      {/* Conversion Funnel Grid */}
      <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FAF8F5', margin: 0 }}>
            E-Commerce Conversion Funnel
          </h3>
          <span style={{ fontSize: '12px', color: '#D4AF37', fontWeight: 600 }}>Final Conversion Rate: 3.42%</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {funnelSteps.map((step, idx) => (
            <div key={step.step} style={{ backgroundColor: '#1D1D1A', padding: '16px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#D4AF37', color: '#000', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#FAF8F5' }}>{step.step}</span>
                </div>
                <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
                  <span style={{ fontWeight: 600, color: '#FAF8F5' }}>{step.count} sessions</span>
                  <span style={{ color: '#D4AF37', fontWeight: 700 }}>{step.rate}</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#0D0D0C', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: step.rate, height: '100%', backgroundColor: idx === 4 ? '#81C784' : '#D4AF37', transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional & Channel Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* City Demographics */}
        <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FAF8F5', margin: '0 0 20px 0' }}>
            Top Sales By Territory
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {citySales.map(item => (
              <div key={item.city}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#FAF8F5' }}>{item.city}</span>
                  <span style={{ color: '#D4AF37', fontWeight: 600 }}>{item.sales} ({item.percent}%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#0D0D0C', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.percent}%`, height: '100%', backgroundColor: '#D4AF37' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device & Traffic Channel */}
        <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FAF8F5', margin: '0 0 20px 0' }}>
            Device & Platform Traffic
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: '#FAF8F5' }}>📱 Mobile (iOS Safari & Android Chrome)</span>
                <span style={{ color: '#81C784', fontWeight: 600 }}>74.2%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#0D0D0C', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '74.2%', height: '100%', backgroundColor: '#81C784' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: '#FAF8F5' }}>💻 Desktop & Workstation</span>
                <span style={{ color: '#64B5F6', fontWeight: 600 }}>22.5%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#0D0D0C', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '22.5%', height: '100%', backgroundColor: '#64B5F6' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: '#FAF8F5' }}>📱 iPad & Tablet Viewport</span>
                <span style={{ color: '#D4AF37', fontWeight: 600 }}>3.3%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#0D0D0C', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '3.3%', height: '100%', backgroundColor: '#D4AF37' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
