
import React from 'react';

export default function FaqPage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main className="container" style={{ padding: '80px 24px', flex: 1, maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '32px', color: 'var(--espresso)' }}>Frequently Asked Questions</h1>
        <div style={{ color: 'var(--warm-grey)', lineHeight: 1.8, fontSize: '15px' }}>
          
  <h3 style={{marginTop: '24px', marginBottom: '16px', color: 'var(--espresso)'}}>What payment methods do you accept?</h3>
  <p>We accept all major credit/debit cards, UPI, Net Banking, and Wallets via Razorpay. Cash on Delivery (COD) is available on select pin codes.</p>
  
  <h3 style={{marginTop: '24px', marginBottom: '16px', color: 'var(--espresso)'}}>How long does shipping take?</h3>
  <p>Orders are typically dispatched within 48 hours and delivered within 3-7 business days depending on your location.</p>

        </div>
      </main>
    </div>
  );
}
  