'use client';

import React, { useEffect, useState } from 'react';

export default function AdminPromotionsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const initialForm = {
    _id: '',
    code: '',
    description: '',
    type: 'percent',
    value: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    usageLimit: 0,
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      setCoupons(data);
    } catch (e) {
      console.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (coupon: any) => {
    setFormData({
      ...initialForm,
      ...coupon,
      value: coupon.type === 'fixed' ? coupon.value / 100 : coupon.value,
      minOrderValue: coupon.minOrderValue ? coupon.minOrderValue / 100 : 0,
      maxDiscount: coupon.maxDiscount ? coupon.maxDiscount / 100 : 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Coupon deleted', 'success');
        fetchCoupons();
      }
    } catch (e) {
      showToast('Error deleting coupon', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const method = formData._id ? 'PUT' : 'POST';
    const url = formData._id ? `/api/coupons/${formData._id}` : '/api/coupons';
    
    const payload = {
      ...formData,
      value: formData.type === 'fixed' ? formData.value * 100 : formData.value,
      minOrderValue: formData.minOrderValue ? formData.minOrderValue * 100 : 0,
      maxDiscount: formData.maxDiscount ? formData.maxDiscount * 100 : 0
    };
    if (!payload._id) delete (payload as any)._id;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      showToast('Coupon saved', 'success');
      setShowModal(false);
      fetchCoupons();
    } catch (err: any) {
      showToast(err.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '16px 24px', borderRadius: '4px', color: '#fff', backgroundColor: toast.type === 'success' ? 'var(--success)' : 'var(--error)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>PROMOTIONS</h1>
        <button 
          onClick={() => { setFormData(initialForm); setShowModal(true); }} 
          style={{ padding: '8px 16px', backgroundColor: 'var(--espresso)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          + Add Coupon
        </button>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E9ECEF', textAlign: 'left', backgroundColor: '#F8F9FA' }}>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Code</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Type</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Discount</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Usage</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center' }}>Loading...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#6C757D' }}>No coupons found.</td></tr>
            ) : coupons.map(c => (
              <tr key={c._id} style={{ borderBottom: '1px solid #E9ECEF' }}>
                <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--espresso)', letterSpacing: '1px' }}>{c.code}</td>
                <td style={{ padding: '16px 24px', color: '#6C757D', textTransform: 'capitalize' }}>{c.type}</td>
                <td style={{ padding: '16px 24px' }}>
                  {c.type === 'percent' ? `${c.value}%` : `₹${(c.value/100).toLocaleString('en-IN')}`}
                </td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>
                  {c.usedCount} {c.usageLimit ? `/ ${c.usageLimit}` : 'uses'}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', backgroundColor: c.isActive ? '#E8F5E9' : '#FDECEA', color: c.isActive ? 'var(--success)' : 'var(--error)' }}>
                    {c.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <button onClick={() => handleEdit(c)} style={{ background: 'none', border: 'none', color: '#1976D2', cursor: 'pointer', fontSize: '13px', marginRight: '12px' }}>Edit</button>
                  <button onClick={() => handleDelete(c._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleSave} style={{ backgroundColor: '#fff', padding: '32px', width: '100%', maxWidth: '500px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: 'var(--espresso)' }}>{formData._id ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button type="button" onClick={() => setShowModal(false)} style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>COUPON CODE *</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', textTransform: 'uppercase' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>TYPE *</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }}>
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>DISCOUNT VALUE *</label>
                  <input required type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>MIN ORDER (₹)</label>
                  <input type="number" value={formData.minOrderValue} onChange={e => setFormData({...formData, minOrderValue: Number(e.target.value)})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>MAX DISCOUNT (₹)</label>
                  <input type="number" value={formData.maxDiscount} onChange={e => setFormData({...formData, maxDiscount: Number(e.target.value)})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} disabled={formData.type === 'fixed'} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>USAGE LIMIT (0 = Unlimited)</label>
                <input type="number" value={formData.usageLimit} onChange={e => setFormData({...formData, usageLimit: Number(e.target.value)})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
              </div>
              
              <div style={{ marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} /> Active Coupon
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', border: '1px solid var(--linen)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '12px', backgroundColor: saving ? '#ccc' : 'var(--espresso)', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving...' : 'Save Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
