'use client';

import React, { useEffect, useState } from 'react';
import ImageUpload from '../../../components/admin/ImageUpload';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<any>({
    storeName: '', storeLogoUrl: '', storeDescription: '',
    supportEmail: '', supportPhone: '', whatsappNumber: '',
    instagramUrl: '', facebookUrl: '', xUrl: '', pinterestUrl: '',
    currency: 'INR', currencySymbol: '₹', freeShippingThreshold: 0, shippingCharge: 0, codEnabled: true, demoMode: false,
    announcementText: '', footerCopyright: '', supportHours: ''
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setFormData({
          ...data,
          freeShippingThreshold: data.freeShippingThreshold / 100,
          shippingCharge: data.shippingCharge / 100
        });
      }
    } catch (e) {
      showToast('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setIsDirty(true);
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : (target.type === 'number' || target.name === 'catalogBatchSize' ? Number(target.value) : target.value);
    setFormData({ ...formData, [target.name]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      ...formData,
      freeShippingThreshold: Math.round(Number(formData.freeShippingThreshold) * 100),
      shippingCharge: Math.round(Number(formData.shippingCharge) * 100),
    };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast('Settings saved successfully', 'success');
        setIsDirty(false);
      } else {
        showToast(data.error || 'Failed to save settings', 'error');
      }
    } catch (err) {
      showToast('An error occurred while saving', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Settings...</div>;

  return (
    <div style={{ paddingBottom: '100px' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '16px 24px', borderRadius: '4px', color: '#fff', backgroundColor: toast.type === 'success' ? 'var(--success)' : 'var(--error)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {toast.message}
        </div>
      )}
      
      {isDirty && (
        <div style={{ position: 'sticky', top: '20px', zIndex: 1000, backgroundColor: '#FFF3E0', padding: '16px 24px', borderRadius: '8px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #FFE0B2' }}>
          <span style={{ color: 'var(--warning)', fontWeight: 500 }}>⚠️ You have unsaved changes!</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => { fetchSettings(); setIsDirty(false); }} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--linen)', cursor: 'pointer' }}>Reset</button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '8px 24px', backgroundColor: 'var(--espresso)', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 500 }}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>STORE SETTINGS</h1>
          <p style={{ color: '#6C757D', marginTop: '4px', fontSize: '14px' }}>Manage global store configurations and commerce settings</p>
        </div>
        {!isDirty && (
          <button onClick={handleSave} disabled={saving} style={{ padding: '12px 24px', backgroundColor: 'var(--espresso)', color: '#fff', border: 'none', borderRadius: '4px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        )}
      </div>

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '900px' }}>
        
        {/* General Section */}
        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E9ECEF' }}>General Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>STORE NAME</label>
              <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>STORE LOGO (URL)</label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {formData.storeLogoUrl && <img src={formData.storeLogoUrl} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />}
                <div style={{ flex: 1 }}>
                  <ImageUpload onUploadSuccess={(url) => { setFormData({...formData, storeLogoUrl: url}); setIsDirty(true); }} />
                </div>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>STORE DESCRIPTION</label>
              <textarea name="storeDescription" value={formData.storeDescription} onChange={handleChange} rows={3} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} />
            </div>
          </div>
        </div>

        {/* Contact & Support Section */}
        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E9ECEF' }}>Contact & Support</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>SUPPORT EMAIL</label>
              <input type="email" name="supportEmail" value={formData.supportEmail} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>SUPPORT PHONE</label>
              <input type="text" name="supportPhone" value={formData.supportPhone} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>WHATSAPP NUMBER</label>
              <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="+91..." style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>SUPPORT HOURS</label>
              <input type="text" name="supportHours" value={formData.supportHours} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} />
            </div>
          </div>
        </div>

          {/* Commerce & Catalog Settings */}
        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E9ECEF' }}>Commerce & Catalog</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>FREE SHIPPING THRESHOLD (₹)</label>
              <input type="number" min="0" name="freeShippingThreshold" value={formData.freeShippingThreshold} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>STANDARD SHIPPING CHARGE (₹)</label>
              <input type="number" min="0" name="shippingCharge" value={formData.shippingCharge} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>CATALOG BATCH SIZE (INFINITE SCROLL)</label>
              <select 
                name="catalogBatchSize" 
                value={formData.catalogBatchSize || 16} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none', backgroundColor: '#FFF' }}
              >
                <option value={8}>8 items per batch</option>
                <option value={12}>12 items per batch</option>
                <option value={16}>16 items per batch (Default)</option>
                <option value={20}>20 items per batch</option>
                <option value={24}>24 items per batch</option>
                <option value={32}>32 items per batch</option>
                <option value={48}>48 items per batch</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" name="codEnabled" checked={formData.codEnabled} onChange={handleChange} style={{ width: '16px', height: '16px', accentColor: 'var(--espresso)' }} /> Cash on Delivery (COD) Enabled
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--error)' }}>
              <input type="checkbox" name="demoMode" checked={formData.demoMode} onChange={handleChange} style={{ width: '16px', height: '16px', accentColor: 'var(--error)' }} /> Demo Mode (No real payments)
            </label>
          </div>
        </div>

        {/* Branding & Socials */}
        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E9ECEF' }}>Branding & Socials</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>ANNOUNCEMENT BAR TEXT</label>
              <input type="text" name="announcementText" value={formData.announcementText} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>FOOTER COPYRIGHT TEXT</label>
              <input type="text" name="footerCopyright" value={formData.footerCopyright} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>INSTAGRAM URL</label>
                <input type="url" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>FACEBOOK URL</label>
                <input type="url" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>X (TWITTER) URL</label>
                <input type="url" name="xUrl" value={formData.xUrl} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>PINTEREST URL</label>
                <input type="url" name="pinterestUrl" value={formData.pinterestUrl} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} />
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
