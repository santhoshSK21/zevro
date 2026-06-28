
import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function ShippingPolicyPage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="container" style={{ padding: '80px 24px', flex: 1, maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '32px', color: 'var(--espresso)' }}>Shipping Policy</h1>
        <div style={{ color: 'var(--warm-grey)', lineHeight: 1.8, fontSize: '15px' }}>
          
  {/* Note: This is a template. Legal advisor review recommended before going live. */}
  <p>We offer free shipping on orders above ₹999 within India. For orders below ₹999, a standard shipping fee applies.</p>
  <h3 style={{marginTop: '24px', marginBottom: '16px', color: 'var(--espresso)'}}>Delivery Times</h3>
  <p>Standard delivery takes 3-7 business days. You will receive a tracking link via email once your order has been dispatched.</p>

        </div>
      </main>
      <Footer />
    </div>
  );
}
  