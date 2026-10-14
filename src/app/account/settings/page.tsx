'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Store, 
  ShieldCheck, 
  Check, 
  Save, 
  LogOut, 
  ExternalLink,
  Edit3,
  Calendar
} from 'lucide-react';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [profile, setProfile] = useState<{
    id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    role?: string;
    createdAt?: string;
  }>({});

  const [seller, setSeller] = useState<{
    id?: string;
    storeName?: string;
    businessName?: string;
    email?: string;
    phone?: string;
    status?: string;
    gstin?: string;
    pan?: string;
  } | null>(null);

  // Form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user || {});
          setSeller(data.seller || null);

          setFirstName(data.user?.firstName || (data.user?.name ? data.user.name.split(' ')[0] : ''));
          setLastName(data.user?.lastName || (data.user?.name ? data.user.name.split(' ').slice(1).join(' ') : ''));
          setPhone(data.user?.phone || '');
          if (data.seller?.storeName) {
            setStoreName(data.seller.storeName);
          }
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const fullName = `${firstName} ${lastName}`.trim();

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          name: fullName,
          phone,
          storeName: seller ? storeName : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Profile details successfully updated!');
        setProfile(prev => ({ ...prev, name: fullName, firstName, lastName, phone }));
        if (seller && storeName) {
          setSeller(prev => prev ? ({ ...prev, storeName }) : null);
        }
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to update profile details');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: '#68645C', fontSize: '13px' }}>
        Loading account details...
      </div>
    );
  }

  const roleLabel = profile.role === 'seller' ? 'Merchant Seller' : profile.role === 'admin' ? 'Administrator' : 'Verified Customer';

  return (
    <div style={{ maxWidth: '800px' }}>
      
      {/* Header with Title and Sign Out Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', letterSpacing: '0.18em', color: '#B49A68', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            PROFILE & SECURITY
          </span>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '28px', color: '#1C1C1A', margin: 0, fontWeight: 500 }}>
            Account Details
          </h1>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            backgroundColor: '#FFF0F0',
            color: '#B91C1C',
            border: '1px solid #FECACA',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <LogOut size={15} />
          <span>Sign Out / Logout</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', color: '#166534', padding: '14px 18px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '14px 18px', borderRadius: '8px', fontSize: '13px', marginBottom: '24px' }}>
          {errorMsg}
        </div>
      )}

      {/* Overview Identity Card */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D6', borderRadius: '12px', padding: '24px', marginBottom: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1C1C1A', color: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display, serif)' }}>
            {(profile.name || profile.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1C1C1A', margin: 0 }}>
                {profile.name || 'Member'}
              </h2>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#8A704C', backgroundColor: 'rgba(180, 154, 104, 0.15)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {roleLabel}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#68645C', margin: 0 }}>
              {profile.email}
            </p>
          </div>

          {seller && (
            <Link
              href="/seller"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#1C1C1A',
                color: '#FAF8F5',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '0.05em',
              }}
            >
              <Store size={14} color="#C5A880" />
              <span>Go to Seller Hub</span>
              <ExternalLink size={12} />
            </Link>
          )}
        </div>
      </div>

      {/* Edit Profile Form */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D6', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid #F0ECE4', paddingBottom: '16px' }}>
          <Edit3 size={18} color="#B49A68" />
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1A', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Edit Personal Details
          </h2>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1C1C1A', marginBottom: '8px' }}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                required
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #DDD6C8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAF9F6', color: '#1C1C1A', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1C1C1A', marginBottom: '8px' }}>
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #DDD6C8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAF9F6', color: '#1C1C1A', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1C1C1A', marginBottom: '8px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={profile.email || ''}
                disabled
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #E8E2D6', borderRadius: '6px', fontSize: '13px', backgroundColor: '#F1EFEA', color: '#88847E', outline: 'none', boxSizing: 'border-box', cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '11px', color: '#88847E', marginTop: '4px', display: 'block' }}>Primary login identity (read-only)</span>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1C1C1A', marginBottom: '8px' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #DDD6C8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAF9F6', color: '#1C1C1A', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* If user is seller, allow editing store name */}
          {seller && (
            <div style={{ marginTop: '10px', paddingTop: '18px', borderTop: '1px dashed #DDD6C8' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1C1C1A', marginBottom: '8px' }}>
                Store Brand Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Royal Silks Boutique"
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #DDD6C8', borderRadius: '6px', fontSize: '13px', backgroundColor: '#FAF9F6', color: '#1C1C1A', outline: 'none', boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '11px', color: '#8A704C', marginTop: '4px', display: 'block' }}>
                Displays publicly on product listings and your seller storefront.
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                backgroundColor: saving ? '#88847E' : '#1C1C1A',
                color: '#FAF8F5',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Save size={14} color="#C5A880" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
