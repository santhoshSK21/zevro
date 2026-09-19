
import React from 'react';

export default function ReturnsPage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main className="container" style={{ padding: '80px 24px', flex: 1, maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '32px', color: 'var(--espresso)' }}>Returns & Exchanges</h1>
        <div style={{ color: 'var(--warm-grey)', lineHeight: 1.8, fontSize: '15px' }}>
          
  <p>At Zevro, we offer a simple and easy 7-day return policy. If you are not satisfied with your purchase, you can return it within 7 days of delivery.</p>
  <h3 style={{marginTop: '24px', marginBottom: '16px', color: 'var(--espresso)'}}>How to Request a Return</h3>
  <ol style={{paddingLeft: '20px'}}>
    <li>Go to your <a href="/account/orders" style={{color: 'var(--gold)', textDecoration: 'underline'}}>Orders</a> page in your account.</li>
    <li>Select the order you wish to return.</li>
    <li>Click on "Request Return" and follow the instructions.</li>
  </ol>

        </div>
      </main>
    </div>
  );
}
  