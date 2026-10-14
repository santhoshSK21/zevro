'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Store, ArrowRight, AlertCircle, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function SellerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/seller';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg('Invalid credentials or unauthorized seller account.');
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setErrorMsg('An error occurred during sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F5F1E8',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 16px',
        color: '#1C1C1A',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '0.12em', color: '#1C1C1A' }}>ZEVRO</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                background: '#1C1C1A',
                color: '#FAF8F5',
                padding: '2px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}
            >
              Seller Hub
            </span>
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            Merchant Sign In
          </h1>
          <p style={{ fontSize: '14px', color: '#68645C', margin: 0 }}>
            Manage listings, dispatch customer orders, and track your settlements.
          </p>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: '#FAF8F5',
            border: '1px solid #DDD6C8',
            borderRadius: '16px',
            padding: '36px 32px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
          }}
        >
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#FDECEA',
                color: '#9E2A2B',
                border: '1px solid #F5C6CB',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '20px',
                fontSize: '13px',
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Seller Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="#68645C"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seller@yourbrand.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    border: '1px solid #DDD6C8',
                    borderRadius: '8px',
                    background: '#FAF8F5',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="#68645C"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    border: '1px solid #DDD6C8',
                    borderRadius: '8px',
                    background: '#FAF8F5',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#1C1C1A',
                color: '#FAF8F5',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: '8px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Help */}
          <div
            style={{
              marginTop: '24px',
              padding: '12px',
              borderRadius: '8px',
              background: '#EAE4D8',
              fontSize: '12px',
              color: '#68645C',
              lineHeight: 1.5,
            }}
          >
            <strong>Note for Client:</strong> If you are testing for the first time, click <em>&ldquo;Register as Seller&rdquo;</em> below to configure your store profile.
          </div>
        </div>

        {/* Footer Link to Register */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#68645C' }}>
          New brand or merchant?{' '}
          <Link href="/seller/register" style={{ color: '#1C1C1A', fontWeight: 600, textDecoration: 'underline' }}>
            Register your Seller Account
          </Link>
        </div>
      </div>
    </div>
  );
}
