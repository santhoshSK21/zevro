
import React from 'react';

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main className="container" style={{ padding: '80px 24px', flex: 1, maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '32px', color: 'var(--espresso)' }}>Terms of Service</h1>
        <div style={{ color: 'var(--warm-grey)', lineHeight: 1.8, fontSize: '15px' }}>
          
  {/* Note: This is a template. Legal advisor review recommended before going live. */}
  <p>Welcome to Zevro. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Zevro if you do not agree to all of the terms and conditions stated on this page.</p>

        </div>
      </main>
    </div>
  );
}
  