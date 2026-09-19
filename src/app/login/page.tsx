'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', display: 'flex' }}>
      
      {/* Left: Image */}
      <div className="login-image-side" style={{ flex: 1, position: 'relative', display: 'none' }}>
        <div 
          style={{ 
            position: 'absolute', inset: 0, 
            backgroundImage: 'url(/pdp_hero_2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} 
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26, 26, 26, 0.1)' }} />
      </div>

      {/* Right: Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1, padding: '80px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <h1 className="display-serif" style={{ fontSize: '32px', textAlign: 'center', marginBottom: '12px', color: 'var(--color-ink)' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--color-ink-muted)', fontSize: '13px', marginBottom: '40px' }}>
              {isLogin ? 'Sign in to access your orders, wishlist, and exclusive offers.' : 'Join ZEVRO for exclusive access to new collections and personalized recommendations.'}
            </p>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {!isLogin && (
                <div>
                  <label className="input-label" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--color-ink)', display: 'block', marginBottom: '8px' }}>FULL NAME</label>
                  <input type="text" style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--color-stone)', padding: '12px 0', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none' }} placeholder="Jane Doe" required />
                </div>
              )}
              <div>
                <label className="input-label" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--color-ink)', display: 'block', marginBottom: '8px' }}>EMAIL ADDRESS</label>
                <input type="email" style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--color-stone)', padding: '12px 0', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none' }} placeholder="jane@example.com" required />
              </div>
              <div>
                <label className="input-label" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--color-ink)', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  PASSWORD
                  {isLogin && <a href="#" style={{ color: 'var(--color-ink-muted)', textTransform: 'none', letterSpacing: 'normal' }}>Forgot?</a>}
                </label>
                <input type="password" style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--color-stone)', padding: '12px 0', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none' }} placeholder="••••••••" required />
              </div>

              <button type="button" style={{ marginTop: '24px', width: '100%', background: 'var(--color-ink)', color: 'var(--color-white)', border: 'none', padding: '16px', fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'opacity 0.2s' }}>
                {isLogin ? 'Sign In' : 'Register'}
              </button>
            </form>

            <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '13px', fontFamily: 'var(--font-body)', color: 'var(--color-ink-muted)' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--color-ink)', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit', padding: 0 }}>
                {isLogin ? 'Register here' : 'Sign in here'}
              </button>
            </div>
          </div>
        </main>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .login-image-side {
            display: block !important;
          }
        }
      `}} />
    </div>
  );
}
