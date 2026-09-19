'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-ink-muted)' }}>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="display-serif" style={{ fontSize: 'var(--text-2xl)', marginBottom: '32px', color: 'var(--color-ink)' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-stone)' }}>
          <p style={{ color: 'var(--color-ink-muted)', marginBottom: '24px' }}>You haven't placed any orders yet.</p>
          <Link href="/products" className="btn btn-ghost">START SHOPPING</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => (
            <div key={order._id} style={{ border: '1px solid var(--color-stone)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginBottom: '8px', letterSpacing: 'var(--tracking-wider)' }}>Order {order.orderId || order._id.slice(-6).toUpperCase()}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', marginBottom: '4px' }}>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-ink)' }}>Total: ₹{((order.pricing?.total || 0) / 100).toLocaleString('en-IN')} for {order.items?.length || 0} item(s)</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="label-caps" style={{ marginBottom: '16px', display: 'inline-block', color: 'var(--color-ink)', border: '1px solid var(--color-ink)', padding: '4px 8px', fontSize: '10px' }}>
                  {order.status}
                </span>
                <div>
                  <Link href={`/account/orders/${order._id}`} className="link-underline" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
