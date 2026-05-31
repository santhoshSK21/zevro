'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main className="container" style={{ flex: 1, padding: '80px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'var(--white)', padding: '40px', width: '100%', maxWidth: '480px', border: '1px solid var(--linen)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>
            {isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
          </h1>
          <p style={{ textAlign: 'center', color: 'var(--warm-grey)', fontSize: '14px', marginBottom: '32px' }}>
            {isLogin ? 'Sign in to access your orders and wishlist.' : 'Join ZEVRO for exclusive access to new collections.'}
          </p>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div>
                <label className="input-label">Full Name</label>
                <input type="text" className="input-field" placeholder="Jane Doe" required />
              </div>
            )}
            <div>
              <label className="input-label">Email Address</label>
              <input type="email" className="input-field" placeholder="jane@example.com" required />
            </div>
            <div>
              <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Password
                {isLogin && <a href="#" style={{ color: 'var(--espresso)', textTransform: 'none', letterSpacing: 'normal' }}>Forgot?</a>}
              </label>
              <input type="password" className="input-field" placeholder="••••••••" required />
            </div>

            <button type="button" className="btn btn-primary btn-full" style={{ marginTop: '16px' }}>
              {isLogin ? 'SIGN IN' : 'REGISTER'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--warm-grey)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--espresso)', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit' }}>
              {isLogin ? 'Register here' : 'Sign in here'}
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
