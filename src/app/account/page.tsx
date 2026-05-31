import React from 'react';
import Link from 'next/link';

export default function AccountDashboardPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '8px' }}>WELCOME BACK, DEMO USER</h1>
      <p style={{ color: 'var(--warm-grey)', marginBottom: '40px' }}>From your account dashboard, you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Recent Orders */}
        <div style={{ border: '1px solid var(--linen)', padding: '24px', backgroundColor: 'var(--white)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '16px' }}>RECENT ORDERS</h3>
          <p style={{ color: 'var(--warm-grey)', fontSize: '14px', marginBottom: '16px' }}>You have no recent orders.</p>
          <Link href="/account/orders" style={{ fontSize: '12px', textDecoration: 'underline', color: 'var(--espresso)' }}>View all orders</Link>
        </div>

        {/* Default Address */}
        <div style={{ border: '1px solid var(--linen)', padding: '24px', backgroundColor: 'var(--white)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '16px' }}>DEFAULT ADDRESS</h3>
          <p style={{ fontSize: '14px', marginBottom: '4px', fontWeight: 500 }}>Demo User</p>
          <p style={{ color: 'var(--warm-grey)', fontSize: '14px', marginBottom: '16px' }}>123 Luxury Avenue, Fashion District<br/>Mumbai, Maharashtra 400001<br/>India</p>
          <Link href="/account/addresses" style={{ fontSize: '12px', textDecoration: 'underline', color: 'var(--espresso)' }}>Manage addresses</Link>
        </div>

      </div>
    </div>
  );
}
