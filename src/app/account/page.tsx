import React from 'react';
import Link from 'next/link';

export default function AccountDashboardPage() {
  return (
    <div>
      <h1 className="display-serif" style={{ fontSize: 'var(--text-2xl)', marginBottom: '16px', color: 'var(--color-ink)' }}>Welcome Back</h1>
      <p style={{ color: 'var(--color-ink-muted)', marginBottom: '48px', lineHeight: 1.6 }}>From your account dashboard, you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Recent Orders */}
        <div style={{ border: '1px solid var(--color-stone)', padding: '32px' }}>
          <h3 className="label-caps" style={{ marginBottom: '24px', color: 'var(--color-ink)' }}>Recent Orders</h3>
          <p style={{ color: 'var(--color-ink-muted)', fontSize: '14px', marginBottom: '24px' }}>You have no recent orders.</p>
          <Link href="/account/orders" className="link-underline" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>View all orders</Link>
        </div>

        {/* Default Address */}
        <div style={{ border: '1px solid var(--color-stone)', padding: '32px' }}>
          <h3 className="label-caps" style={{ marginBottom: '24px', color: 'var(--color-ink)' }}>Default Address</h3>
          <p style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--color-ink)' }}>Demo User</p>
          <p style={{ color: 'var(--color-ink-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>123 Luxury Avenue, Fashion District<br/>Mumbai, Maharashtra 400001<br/>India</p>
          <Link href="/account/addresses" className="link-underline" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>Manage addresses</Link>
        </div>

      </div>
    </div>
  );
}
