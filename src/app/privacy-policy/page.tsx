
import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main className="container" style={{ padding: '80px 24px', flex: 1, maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '32px', color: 'var(--espresso)' }}>Privacy Policy</h1>
        <div style={{ color: 'var(--warm-grey)', lineHeight: 1.8, fontSize: '15px' }}>
          
  {/* Note: This is a template. Legal advisor review recommended before going live. */}
  <p>Zevro respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
  <h3 style={{marginTop: '24px', marginBottom: '16px', color: 'var(--espresso)'}}>Data Collection</h3>
  <p>We collect personal data such as name, email, and address strictly for order fulfillment and customer support purposes.</p>

        </div>
      </main>
    </div>
  );
}
  