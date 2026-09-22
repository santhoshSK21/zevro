'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TrackPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !email) return;
    
    setIsSearching(true);
    setError('');
    setResult(null);
    
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, email })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to track order');
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDemoFill = () => {
    setOrderId('ZEVRO-2026-88912');
    setEmail('priya.sharma@example.com');
  };

  return (
    <div style={{ backgroundColor: 'var(--ivory, #FAF8F5)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Hero Header */}
      <div style={{ position: 'relative', height: '36vh', minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&auto=format&fit=crop&q=80" 
          alt="ZEVRO White Glove Dispatch" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.4), rgba(15,23,42,0.8))' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#FFF', padding: '0 20px' }}>
          <span style={{ fontFamily: 'var(--font-ui, sans-serif)', fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#C5A880', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            CONCIERGE LOGISTICS
          </span>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(30px, 4.5vw, 46px)', letterSpacing: '0.06em', margin: 0 }}>
            TRACK YOUR CONSIGNMENT
          </h1>
          <p style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', fontSize: '15px', color: '#E2E8F0', marginTop: '8px' }}>
            Live status from our atelier dispatch to your doorstep.
          </p>
        </div>
      </div>

      <main className="container" style={{ padding: '56px 20px 80px', maxWidth: '860px', margin: '0 auto', flex: 1, width: '100%', fontFamily: 'var(--font-body)' }}>


      {/* Form */}
      <div style={{ backgroundColor: 'var(--color-white, #FAF8F5)', border: '1px solid var(--color-stone, #DDD6C8)', padding: '32px', marginBottom: '48px', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' }}>
        <form onSubmit={handleTrack} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--color-ink, #1C1C1A)', textTransform: 'uppercase', marginBottom: '8px' }}>
              ORDER ID
            </label>
            <input 
              type="text" 
              placeholder="e.g. ZEVRO-2026-88912" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', background: '#FFF', border: '1px solid #CCC', fontSize: '13px', outline: 'none' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--color-ink, #1C1C1A)', textTransform: 'uppercase', marginBottom: '8px' }}>
              EMAIL ADDRESS
            </label>
            <input 
              type="email" 
              placeholder="e.g. yourname@domain.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', background: '#FFF', border: '1px solid #CCC', fontSize: '13px', outline: 'none' }}
              required
            />
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
            <button 
              type="submit" 
              disabled={isSearching || !orderId || !email} 
              style={{ flex: 1, padding: '14px 24px', background: 'var(--color-ink, #1C1C1A)', color: '#FAF8F5', border: 'none', fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, cursor: isSearching ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
            >
              {isSearching ? 'SEARCHING ARCHIVE...' : 'TRACK CONSIGNMENT'}
            </button>
            <button
              type="button"
              onClick={handleDemoFill}
              style={{ background: 'transparent', border: '1px solid var(--color-accent, #B49A68)', color: 'var(--color-accent, #B49A68)', padding: '13px 18px', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              TRY DEMO ORDER
            </button>
          </div>
        </form>

        {error && (
          <div style={{ marginTop: '20px', padding: '12px 16px', background: 'rgba(158, 42, 43, 0.08)', border: '1px solid rgba(158, 42, 43, 0.3)', color: '#9E2A2B', fontSize: '13px', textAlign: 'center' }}>
            {error}
          </div>
        )}
      </div>

      {/* Results View */}
      {result && (
        <div style={{ backgroundColor: '#FFF', border: '1px solid var(--color-stone, #DDD6C8)', padding: '36px', boxShadow: '0 12px 36px rgba(0,0,0,0.04)' }}>
          
          {/* Header Strip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #EBE7DF', paddingBottom: '24px', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888', letterSpacing: '0.1em' }}>Consignment Reference</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', margin: '4px 0 0 0', color: 'var(--color-ink, #1C1C1A)' }}>{result.id}</h2>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888', letterSpacing: '0.1em' }}>Status</span>
              <div style={{ marginTop: '4px' }}>
                <span style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--color-ink, #1C1C1A)', color: '#FAF8F5', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '2px' }}>
                  {result.status}
                </span>
              </div>
            </div>
          </div>

          {/* Courier & Delivery Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', background: 'var(--color-bg, #F5F1E8)', padding: '20px', borderRadius: '4px', marginBottom: '36px' }}>
            <div>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#777', letterSpacing: '0.12em', margin: '0 0 4px 0' }}>COURIER PARTNER</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1A', margin: 0 }}>{result.courier}</p>
              {result.awb && <p style={{ fontSize: '11px', color: '#666', margin: '2px 0 0 0' }}>AWB: {result.awb}</p>}
            </div>
            <div>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#777', letterSpacing: '0.12em', margin: '0 0 4px 0' }}>ESTIMATED DELIVERY</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#B49A68', margin: 0 }}>{result.estimatedDelivery}</p>
            </div>
            {result.recipient && (
              <div>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#777', letterSpacing: '0.12em', margin: '0 0 4px 0' }}>DESTINATION</p>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#1C1C1A', margin: 0 }}>{result.recipient.name}</p>
                <p style={{ fontSize: '11px', color: '#666', margin: '2px 0 0 0' }}>{result.recipient.city} {result.recipient.pincode}</p>
              </div>
            )}
          </div>

          {/* Stepper Timeline */}
          <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1C1C1A', marginBottom: '24px' }}>
            SHIPMENT PROGRESS
          </h3>

          <div style={{ position: 'relative', paddingLeft: '28px', marginBottom: '40px' }}>
            <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '8px', width: '2px', background: '#E0DDD5' }} />
            
            {result.timeline?.map((step: any, idx: number) => {
              const isDone = step.completed;
              return (
                <div key={idx} style={{ position: 'relative', marginBottom: idx === result.timeline.length - 1 ? 0 : '24px' }}>
                  {/* Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-28px',
                    top: '2px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: isDone ? '#B49A68' : '#FFF',
                    border: isDone ? '2px solid #B49A68' : '2px solid #CCC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    zIndex: 2
                  }}>
                    {isDone ? '✓' : ''}
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: isDone ? '#1C1C1A' : '#888', margin: 0 }}>
                        {step.status}
                      </h4>
                      <span style={{ fontSize: '11px', color: '#888' }}>{step.time}</span>
                    </div>
                    {step.message && (
                      <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                        {step.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Items */}
          {result.items && result.items.length > 0 && (
            <div style={{ borderTop: '1px solid #EBE7DF', paddingTop: '24px' }}>
              <h4 style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1C1C1A', marginBottom: '16px' }}>
                ITEMS IN THIS CONSIGNMENT
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {result.items.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#FAF9F7', padding: '12px', border: '1px solid #EAE6DF' }}>
                    <div style={{ width: '48px', height: '60px', backgroundColor: '#EEE', position: 'relative', overflow: 'hidden' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1A', margin: '0 0 4px 0' }}>{item.name}</p>
                      <p style={{ fontSize: '11px', color: '#777', margin: 0 }}>
                        Qty: {item.qty} {item.size ? `• Size: ${item.size}` : ''} {item.color ? `• Color: ${item.color}` : ''}
                      </p>
                    </div>
                    {item.price && (
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1A' }}>{item.price}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Support Strip */}
      <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '12px', color: '#888' }}>
        Need urgent assistance with your shipment? <Link href="/contact" style={{ color: '#B49A68', textDecoration: 'underline' }}>Speak with Client Concierge</Link>
      </div>

    </main>
    </div>
  );
}

