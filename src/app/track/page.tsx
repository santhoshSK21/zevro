'use client';

import React, { useState, Suspense } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useSearchParams } from 'next/navigation';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';
  const [orderId, setOrderId] = useState(initialOrderId);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setIsSearching(true);
    
    // Simulate API call for demo mode
    setTimeout(() => {
      setResult({
        id: orderId,
        status: 'shipped',
        estimatedDelivery: 'Thu, 24 Oct 2026',
        timeline: [
          { status: 'Order Placed', message: 'We have received your order.', time: '18 Oct 2026, 10:30 AM', completed: true },
          { status: 'Processing', message: 'Your order is being prepared for dispatch.', time: '19 Oct 2026, 02:15 PM', completed: true },
          { status: 'Shipped', message: 'Your package has been handed over to Delhivery.', time: '20 Oct 2026, 09:00 AM', completed: true, active: true },
          { status: 'Out for Delivery', message: 'Your package is out for delivery.', time: '', completed: false },
          { status: 'Delivered', message: 'Your package has been delivered.', time: '', completed: false },
        ],
        items: [
          { name: 'Banarasi Silk Saree in Deep Maroon', qty: 1, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400' }
        ]
      });
      setIsSearching(false);
    }, 1000);
  };

  return (
    <main className="container" style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto', flex: 1, width: '100%' }}>
      <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>TRACK YOUR ORDER</h1>
      
      <form onSubmit={handleTrack} style={{ display: 'flex', gap: '16px', marginBottom: '64px' }}>
        <input 
          type="text" 
          placeholder="Enter Order ID or AWB Number" 
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="input-field"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" disabled={isSearching || !orderId}>
          {isSearching ? 'TRACKING...' : 'TRACK'}
        </button>
      </form>

      {result && (
        <div style={{ backgroundColor: 'var(--white)', padding: '40px', border: '1px solid var(--linen)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--linen)', paddingBottom: '24px', marginBottom: '40px' }}>
            <div>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--warm-grey)' }}>Order ID</p>
              <p className="order-id" style={{ fontSize: '18px', fontWeight: 600 }}>{result.id}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--warm-grey)' }}>Estimated Delivery</p>
              <p style={{ fontSize: '18px', fontWeight: 500, color: 'var(--success)' }}>{result.estimatedDelivery}</p>
            </div>
          </div>

          <div className="tracking-timeline">
            {result.timeline.map((step: any, idx: number) => (
              <div key={idx} className={`timeline-step ${step.completed ? 'completed' : ''}`}>
                <div className={`timeline-dot ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                  {step.completed && <span style={{ color: 'var(--white)', fontSize: '10px' }}>✓</span>}
                </div>
                {idx !== result.timeline.length - 1 && <div className="timeline-line"></div>}
                
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: step.completed ? 'var(--espresso)' : 'var(--warm-grey)', margin: '0 0 4px' }}>{step.status}</h4>
                <p style={{ fontSize: '13px', color: 'var(--warm-grey)', margin: '0 0 4px' }}>{step.message}</p>
                {step.time && <p style={{ fontSize: '11px', color: 'var(--warm-grey)', fontFamily: 'var(--font-mono)' }}>{step.time}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default function TrackPage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>}>
        <TrackContent />
      </Suspense>
      <Footer />
    </div>
  );
}
