
import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function CareersPage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="container" style={{ padding: '80px 24px', flex: 1, maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '32px', color: 'var(--espresso)' }}>Careers</h1>
        <div style={{ color: 'var(--warm-grey)', lineHeight: 1.8, fontSize: '15px' }}>
          
  <p>We're not currently hiring, but we are always looking for passionate people to join our team in the future. Please check back soon or email your resume to careers@zevro.in.</p>

        </div>
      </main>
      <Footer />
    </div>
  );
}
  