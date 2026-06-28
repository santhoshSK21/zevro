'use client';

import React, { useEffect, useState } from 'react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const initialFormState = {
    _id: '',
    code: '',
    description: '',
    type: 'percent',
    value: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    usageLimit: 0,
    expiresAt: '',
    isActive: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCoupons(data);
    } catch (e: any) {
      setError(e.message);
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
      ...initialFormState,
      ...coupon,
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
      value: coupon.type === 'fixed' ? (coupon.value / 100) : coupon.value,
      minOrderValue: coupon.minOrderValue ? coupon.minOrderValue / 100 : 0,
      maxDiscount: coupon.maxDiscount ? coupon.maxDiscount / 100 : 0,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showToast('Coupon deleted', 'success');
        setCoupons(coupons.filter(c => c._id !== id));
      } else {
        showToast(data.error || 'Failed to delete', 'error');
      }
    } catch (e) {
      showToast('An error occurred', 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const method = formData._id ? 'PUT' : 'POST';
    const url = formData._id ? `/api/coupons/${formData._id}` : '/api/coupons';
    
    const payload = {
      ...formData,
      code: formData.code.toUpperCase(),
      value: formData.type === 'fixed' ? Math.round(formData.value * 100) : Number(formData.value),
      minOrderValue: formData.minOrderValue ? Math.round(formData.minOrderValue * 100) : 0,
      maxDiscount: formData.maxDiscount ? Math.round(formData.maxDiscount * 100) : 0,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
    };
    if (!payload._id) delete (payload as any)._id;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast(`Coupon ${formData._id ? 'updated' : 'created'} successfully`, 'success');
        setShowAddModal(false);
        fetchCoupons();
      } else {
        showToast(data.error || 'Failed to save', 'error');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (coupon: any) => {
    try {
      const res = await fetch(`/api/coupons/${coupon._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !coupon.isActive })
      });
      if (res.ok) {
        setCoupons(coupons.map(c => c._id === coupon._id ? { ...c, isActive: !c.isActive } : c));
        showToast(`Coupon ${!coupon.isActive ? 'enabled' : 'disabled'}`, 'success');
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch (e) {
      showToast('Error updating status', 'error');
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>COUPONS</h1>
        <button 
          onClick={() => { setFormData(initialFormState); setShowAddModal(true); }} 
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
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Discount</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Min Order</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Usage</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Expiry</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center' }}>Loading...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#6C757D' }}>No coupons found.</td></tr>
            ) : (
              coupons.map(coupon => {
                const isExpired = coupon.expiresAt && new Date() > new Date(coupon.expiresAt);
                return (
                  <tr key={coupon._id} style={{ borderBottom: '1px solid #E9ECEF' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--espresso)' }}>{coupon.code}</td>
                    <td style={{ padding: '16px 24px' }}>
                      {coupon.type === 'percent' ? `${coupon.value}%` : `₹${(coupon.value/100).toLocaleString('en-IN')}`}
                      {coupon.maxDiscount > 0 && <span style={{ display: 'block', fontSize: '11px', color: '#6C757D' }}>Up to ₹{(coupon.maxDiscount/100).toLocaleString('en-IN')}</span>}
                    </td>
                    <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)' }}>
                      {coupon.minOrderValue > 0 ? `₹${(coupon.minOrderValue/100).toLocaleString('en-IN')}` : 'None'}
                    </td>
                    <td style={{ padding: '16px 24px', color: '#6C757D' }}>
                      {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                    </td>
                    <td style={{ padding: '16px 24px', color: isExpired ? 'var(--error)' : '#6C757D' }}>
                      {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', backgroundColor: coupon.isActive ? '#E8F5E9' : '#FDECEA', color: coupon.isActive ? 'var(--success)' : 'var(--error)', cursor: 'pointer' }} onClick={() => handleToggleActive(coupon)}>
                        {coupon.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button onClick={() => handleEdit(coupon)} style={{ background: 'none', border: 'none', color: '#1976D2', cursor: 'pointer', fontSize: '13px', marginRight: '12px' }}>Edit</button>
                      <button onClick={() => setConfirmDelete(coupon._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', width: '400px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--espresso)', marginBottom: '16px' }}>Delete Coupon?</h3>
            <p style={{ color: '#6C757D', marginBottom: '24px' }}>Are you sure you want to delete this coupon? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: '12px', border: '1px solid var(--linen)', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--error)', color: '#fff', border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleSave} style={{ backgroundColor: '#fff', padding: '32px', width: '100%', maxWidth: '600px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: 'var(--espresso)' }}>{formData._id ? 'Edit Coupon' : 'Add Coupon'}</h2>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>COUPON CODE *</label>
                <input required type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', textTransform: 'uppercase' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>DESCRIPTION</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>DISCOUNT TYPE *</label>
                <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }}>
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>DISCOUNT VALUE *</label>
                <input required type="number" min="0.01" step="0.01" value={formData.value} onChange={(e) => setFormData({...formData, value: Number(e.target.value)})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>MIN ORDER VALUE (₹)</label>
                <input type="number" min="0" value={formData.minOrderValue} onChange={(e) => setFormData({...formData, minOrderValue: Number(e.target.value)})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>MAX DISCOUNT (₹, for % type)</label>
                <input type="number" min="0" value={formData.maxDiscount} onChange={(e) => setFormData({...formData, maxDiscount: Number(e.target.value)})} disabled={formData.type === 'fixed'} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', backgroundColor: formData.type === 'fixed' ? '#f5f5f5' : '#fff' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>USAGE LIMIT</label>
                <input type="number" min="0" value={formData.usageLimit || ''} onChange={(e) => setFormData({...formData, usageLimit: Number(e.target.value)})} placeholder="Leave empty for unlimited" style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>EXPIRY DATE</label>
                <input type="date" value={formData.expiresAt} onChange={(e) => setFormData({...formData, expiresAt: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
              </div>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} /> Active Coupon
              </label>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', border: '1px solid var(--linen)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
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
