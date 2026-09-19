'use client';

import React, { useState, Suspense } from 'react';

function TrackContent() {
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

  return (
    <main className="container" style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto', flex: 1, width: '100%' }}>
      <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>TRACK YOUR ORDER</h1>
      
      <p style={{ textAlign: 'center', color: 'var(--warm-grey)', marginBottom: '32px' }}>
        Please enter your Order ID and the Email Address used during checkout to track your order.
      </p>

      <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '64px', maxWidth: '500px', margin: '0 auto 64px auto' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.05em' }}>ORDER ID</label>
          <input 
            type="text" 
            placeholder="e.g. ZEVRO-2026-12345" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="input-field"
            style={{ width: '100%' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.05em' }}>EMAIL ADDRESS</label>
          <input 
            type="email" 
            placeholder="e.g. you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            style={{ width: '100%' }}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSearching || !orderId || !email} style={{ marginTop: '16px' }}>
          {isSearching ? 'TRACKING...' : 'TRACK ORDER'}
        </button>
        {error && <p style={{ color: 'var(--error)', textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>{error}</p>}
      </form>

      {result && (
        <div style={{ backgroundColor: 'var(--white)', padding: '40px', border: '1px solid var(--linen)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--linen)', paddingBottom: '24px', marginBottom: '40px' }}>
            <div>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--warm-grey)' }}>Order ID</p>
              <p className="order-id" style={{ fontSize: '18px', fontWeight: 600 }}>{result.id}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--warm-grey)' }}>Current Status</p>
              <p style={{ fontSize: '18px', fontWeight: 500, color: 'var(--espresso)', textTransform: 'capitalize' }}>{result.status}</p>
            </div>
          </div>

          <div className="tracking-timeline">
            {result.timeline.map((step: any, idx: number) => (
              <div key={idx} className={`timeline-step ${step.completed ? 'completed' : ''}`}>
                <div className={`timeline-dot ${step.completed ? 'completed' : ''} ${idx === result.timeline.length -1 ? 'active' : ''}`}>
                  {step.completed && <span style={{ color: 'var(--white)', fontSize: '10px' }}>✓</span>}
                </div>
                {idx !== result.timeline.length - 1 && <div className="timeline-line"></div>}
                
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: step.completed ? 'var(--espresso)' : 'var(--warm-grey)', margin: '0 0 4px', textTransform: 'capitalize' }}>{step.status}</h4>
                <p style={{ fontSize: '13px', color: 'var(--warm-grey)', margin: '0 0 4px' }}>{step.message}</p>
                {step.time && <p style={{ fontSize: '11px', color: 'var(--warm-grey)', fontFamily: 'var(--font-mono)' }}>{step.time}</p>}
              </div>
            ))}
            {result.timeline.length === 0 && (
              <p style={{ color: 'var(--warm-grey)' }}>No tracking updates available yet.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function TrackPage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>}>
        <TrackContent />
      </Suspense>
    </div>
  );
}
