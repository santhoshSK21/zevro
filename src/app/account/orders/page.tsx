import React from 'react';
import Link from 'next/link';

export default function AccountOrdersPage() {
  const orders = [
    {
      id: 'ZEVRO-918273',
      date: 'October 15, 2026',
      total: 429900,
      status: 'shipped',
      itemCount: 1
    }
  ];

  return (
    <div>
      <h1 className="display-serif" style={{ fontSize: 'var(--text-2xl)', marginBottom: '32px', color: 'var(--color-ink)' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-stone)' }}>
          <p style={{ color: 'var(--color-ink-muted)', marginBottom: '24px' }}>You haven't placed any orders yet.</p>
          <Link href="/products" className="btn btn-outline-dark">START SHOPPING</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid var(--color-stone)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginBottom: '8px', letterSpacing: 'var(--tracking-wider)' }}>Order {order.id}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', marginBottom: '4px' }}>Placed on {order.date}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-ink)' }}>Total: ₹{(order.total / 100).toLocaleString('en-IN')} for {order.itemCount} item(s)</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="label-caps" style={{ marginBottom: '16px', display: 'inline-block', color: 'var(--color-ink)', border: '1px solid var(--color-ink)', padding: '4px 8px', fontSize: '10px' }}>
                  {order.status}
                </span>
                <div>
                  <Link href={`/account/orders/${order.id}`} className="link-underline" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
