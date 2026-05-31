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
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '24px' }}>MY ORDERS</h1>

      {orders.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--white)', border: '1px solid var(--linen)' }}>
          <p style={{ color: 'var(--warm-grey)', marginBottom: '16px' }}>You haven't placed any orders yet.</p>
          <Link href="/products" className="btn btn-primary">START SHOPPING</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid var(--linen)', backgroundColor: 'var(--white)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--warm-grey)', marginBottom: '4px' }}>Order {order.id}</p>
                <p style={{ fontSize: '14px', marginBottom: '4px' }}>Placed on {order.date}</p>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>Total: ₹{(order.total / 100).toLocaleString('en-IN')} for {order.itemCount} item(s)</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${order.status === 'delivered' ? 'badge-success' : 'badge-gold'}`} style={{ marginBottom: '12px', display: 'inline-block' }}>
                  {order.status}
                </span>
                <div>
                  <Link href={`/account/orders/${order.id}`} className="btn btn-ghost btn-sm">VIEW DETAILS</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
