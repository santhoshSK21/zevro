'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function AccountOrderDetailPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
             router.push('/login');
             return;
          }
          throw new Error('Order not found');
        }
        return res.json();
      })
      .then(data => {
        if (data) setOrder(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--color-ink-muted)' }}>Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--error)', marginBottom: '24px' }}>{error || 'Order not found'}</p>
        <Link href="/account/orders" className="btn btn-ghost">BACK TO ORDERS</Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/account/orders" className="link-underline" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '16px', display: 'inline-block' }}>← Back to Orders</Link>
        <h1 className="display-serif" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-ink)' }}>Order {order.orderId || order._id.slice(-6).toUpperCase()}</h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-ink-muted)', marginTop: '8px' }}>
          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ border: '1px solid var(--color-stone)', padding: '32px' }}>
            <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '24px' }}>Items</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '24px', borderBottom: idx !== order.items.length - 1 ? '1px solid var(--color-stone)' : 'none', paddingBottom: idx !== order.items.length - 1 ? '24px' : '0' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100px', height: '120px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '8px' }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>Color: {item.color}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>Size: {item.size}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-ink-muted)' }}>Qty: {item.quantity}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-mono)' }}>₹{(((item.priceAtPurchase || 0) * item.quantity) / 100).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ border: '1px solid var(--color-stone)', padding: '32px' }}>
            <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '24px' }}>Order Timeline</h3>
            <div className="tracking-timeline">
              {order.timeline?.map((step: any, idx: number) => (
                <div key={idx} className="timeline-step completed">
                  <div className="timeline-dot completed active">
                    <span style={{ color: 'var(--white)', fontSize: '10px' }}>✓</span>
                  </div>
                  {idx !== order.timeline.length - 1 && <div className="timeline-line"></div>}
                  
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--color-ink)', margin: '0 0 4px', textTransform: 'capitalize' }}>{step.status}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)', margin: '0 0 4px' }}>{step.message}</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}>{new Date(step.timestamp).toLocaleString('en-IN')}</p>
                </div>
              ))}
              {(!order.timeline || order.timeline.length === 0) && (
                 <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)' }}>No timeline events available.</p>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ border: '1px solid var(--color-stone)', padding: '32px', backgroundColor: 'var(--color-bg)' }}>
            <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '24px' }}>Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'var(--color-ink-muted)' }}>
              <span>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>₹{((order.pricing?.subtotal||0)/100).toLocaleString('en-IN')}</span>
            </div>
            {order.pricing?.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'var(--success)' }}>
                <span>Discount</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>- ₹{((order.pricing?.discount||0)/100).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'var(--color-ink-muted)' }}>
              <span>Shipping</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {order.pricing?.shippingCharge === 0 ? 'FREE' : `₹${(order.pricing?.shippingCharge/100).toLocaleString('en-IN')}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--color-stone)', fontSize: '18px', fontFamily: 'var(--font-serif)' }}>
              <span>Total</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>₹{((order.pricing?.total||0)/100).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ border: '1px solid var(--color-stone)', padding: '32px' }}>
             <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '16px' }}>Shipping Address</h3>
             <p style={{ fontSize: '14px', color: 'var(--color-ink)', lineHeight: '1.6' }}>
               {order.shippingAddress?.name}<br/>
               {order.shippingAddress?.line1}<br/>
               {order.shippingAddress?.line2 && <>{order.shippingAddress?.line2}<br/></>}
               {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}<br/>
               {order.shippingAddress?.country}
             </p>
          </div>

          <div style={{ border: '1px solid var(--color-stone)', padding: '32px' }}>
             <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '16px' }}>Payment Method</h3>
             <p style={{ fontSize: '14px', color: 'var(--color-ink)', textTransform: 'uppercase' }}>
               {order.payment?.method}
             </p>
             <p style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginTop: '4px', textTransform: 'uppercase' }}>
               Status: {order.payment?.status}
             </p>
          </div>

        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .tracking-timeline {
          position: relative;
          padding-left: 20px;
        }
        .timeline-step {
          position: relative;
          padding-bottom: 24px;
        }
        .timeline-step:last-child {
          padding-bottom: 0;
        }
        .timeline-dot {
          position: absolute;
          left: -20px;
          top: 0;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--color-stone);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateX(-50%);
        }
        .timeline-dot.completed {
          background-color: var(--color-ink);
        }
        .timeline-dot.active {
          box-shadow: 0 0 0 4px rgba(0,0,0,0.1);
        }
        .timeline-line {
          position: absolute;
          left: -20px;
          top: 16px;
          bottom: 0;
          width: 2px;
          background-color: var(--color-stone);
          transform: translateX(-50%);
        }
        .timeline-step.completed .timeline-line {
          background-color: var(--color-ink);
        }
      `}} />
    </div>
  );
}
