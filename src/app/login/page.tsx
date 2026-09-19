'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        // Handle Login via NextAuth Credentials
        const res = await signIn('credentials', {
          redirect: false,
          email: email.trim().toLowerCase(),
          password
        });

        if (res?.error) {
          setErrorMsg('Invalid email or password. Please try again.');
        } else {
          setSuccessMsg('Signed in successfully! Redirecting...');
          setTimeout(() => {
            router.push('/account/wishlist');
            router.refresh();
          }, 1000);
        }
      } else {
        // Handle User Registration
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email: email.trim().toLowerCase(),
            password,
            phone
          })
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.error || 'Failed to create account.');
        } else {
          setSuccessMsg('Account created successfully! Signing you in...');
          
          // Auto sign in after registration
          const loginRes = await signIn('credentials', {
            redirect: false,
            email: email.trim().toLowerCase(),
            password
          });

          if (!loginRes?.error) {
            setTimeout(() => {
              router.push('/account/wishlist');
              router.refresh();
            }, 1200);
          } else {
            setIsLogin(true);
            setSuccessMsg('Account created! Please sign in with your credentials.');
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', display: 'flex' }}>
      
      {/* Left: Luxury Editorial Image */}
      <div className="login-image-side" style={{ flex: 1, position: 'relative', display: 'none' }}>
        <div 
          style={{ 
            position: 'absolute', inset: 0, 
            backgroundImage: 'url(/pdp_hero_2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} 
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26, 26, 26, 0.15)' }} />
      </div>

      {/* Right: Authentication Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1, padding: '80px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '420px' }}>
            
            <h1 className="display-serif" style={{ fontSize: '32px', textAlign: 'center', marginBottom: '10px', color: 'var(--color-ink)' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--color-ink-muted)', fontSize: '13px', marginBottom: '32px' }}>
              {isLogin 
                ? 'Sign in to access your orders, wishlist, and exclusive offers.' 
                : 'Join ZEVRO for exclusive access to new collections and bespoke recommendations.'}
            </p>

            {/* Error Message */}
            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#DC2626', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div style={{ background: 'rgba(46, 125, 50, 0.1)', border: '1px solid rgba(46, 125, 50, 0.3)', color: '#2E7D32', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Full Name for Registration */}
              {!isLogin && (
                <div>
                  <label className="input-label" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--color-ink)', display: 'block', marginBottom: '8px' }}>
                    FULL NAME *
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--color-stone)', padding: '10px 0', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none' }} 
                    placeholder="e.g. Radhika Sharma" 
                    required 
                  />
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="input-label" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--color-ink)', display: 'block', marginBottom: '8px' }}>
                  EMAIL ADDRESS *
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--color-stone)', padding: '10px 0', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none' }} 
                  placeholder="e.g. radhika@example.com" 
                  required 
                />
              </div>

              {/* Phone (Optional for Register) */}
              {!isLogin && (
                <div>
                  <label className="input-label" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--color-ink)', display: 'block', marginBottom: '8px' }}>
                    PHONE NUMBER (OPTIONAL)
                  </label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--color-stone)', padding: '10px 0', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none' }} 
                    placeholder="+91 98765 43210" 
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="input-label" style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--color-ink)', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>PASSWORD *</span>
                  {isLogin && (
                    <Link href="/api/auth/forgot-password" style={{ color: 'var(--color-ink-muted)', textTransform: 'none', letterSpacing: 'normal', fontSize: '12px' }}>
                      Forgot?
                    </Link>
                  )}
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--color-stone)', padding: '10px 0', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none' }} 
                  placeholder="••••••••" 
                  required 
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  marginTop: '16px', 
                  width: '100%', 
                  background: 'var(--color-ink)', 
                  color: 'var(--color-white)', 
                  border: 'none', 
                  padding: '16px', 
                  fontFamily: 'var(--font-ui)', 
                  fontSize: '11px', 
                  letterSpacing: '0.15em', 
                  textTransform: 'uppercase', 
                  cursor: loading ? 'not-allowed' : 'pointer', 
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.2s' 
                }}
              >
                {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            {/* Toggle Switch */}
            <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '13px', fontFamily: 'var(--font-body)', color: 'var(--color-ink-muted)' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg('');
                  setSuccessMsg('');
                }} 
                style={{ background: 'none', border: 'none', color: 'var(--color-ink)', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit', padding: 0, fontWeight: 600 }}
              >
                {isLogin ? 'Register here' : 'Sign in here'}
              </button>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Link href="/" style={{ fontSize: '12px', color: 'var(--color-ink-muted)', textDecoration: 'none' }}>
                ← Return to Storefront
              </Link>
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
