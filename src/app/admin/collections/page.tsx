'use client';

import React, { useEffect, useState } from 'react';
import ImageUpload from '../../../components/admin/ImageUpload';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const initialFormState = {
    _id: '',
    name: '',
    slug: '',
    description: '',
    image: '',
    sortOrder: 0,
    isActive: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections?admin=true');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCollections(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (collection: any) => {
    setFormData({
      ...initialFormState,
      ...collection,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showToast('Collection deleted', 'success');
        setCollections(collections.filter(c => c._id !== id));
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
    const url = formData._id ? `/api/collections/${formData._id}` : '/api/collections';
    
    const payload = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
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
        showToast(`Collection ${formData._id ? 'updated' : 'created'} successfully`, 'success');
        setShowAddModal(false);
        fetchCollections();
      } else {
        showToast(data.error || 'Failed to save', 'error');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>COLLECTIONS</h1>
        <button 
          onClick={() => { setFormData(initialFormState); setShowAddModal(true); }} 
          style={{ padding: '8px 16px', backgroundColor: 'var(--espresso)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          + Add Collection
        </button>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E9ECEF', textAlign: 'left', backgroundColor: '#F8F9FA' }}>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Image</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Slug</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Order</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center' }}>Loading...</td></tr>
            ) : collections.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#6C757D' }}>No collections found.</td></tr>
            ) : (
              collections.map(col => (
                <tr key={col._id} style={{ borderBottom: '1px solid #E9ECEF' }}>
                  <td style={{ padding: '16px 24px' }}>
                    {col.image ? (
                      <img src={col.image} alt={col.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#eee', borderRadius: '4px' }} />
                    )}
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--espresso)' }}>{col.name}</td>
                  <td style={{ padding: '16px 24px', color: '#6C757D' }}>{col.slug}</td>
                  <td style={{ padding: '16px 24px', color: '#6C757D' }}>{col.sortOrder}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', backgroundColor: col.isActive ? '#E8F5E9' : '#FDECEA', color: col.isActive ? 'var(--success)' : 'var(--error)' }}>
                      {col.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button onClick={() => handleEdit(col)} style={{ background: 'none', border: 'none', color: '#1976D2', cursor: 'pointer', fontSize: '13px', marginRight: '12px' }}>Edit</button>
                    <button onClick={() => setConfirmDelete(col._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', width: '400px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--espresso)', marginBottom: '16px' }}>Delete Collection?</h3>
            <p style={{ color: '#6C757D', marginBottom: '24px' }}>Are you sure you want to delete this collection?</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: '12px', border: '1px solid var(--linen)', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--error)', color: '#fff', border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleSave} style={{ backgroundColor: '#fff', padding: '32px', width: '100%', maxWidth: '500px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: 'var(--espresso)' }}>{formData._id ? 'Edit Collection' : 'Add Collection'}</h2>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>NAME *</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>SLUG</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="Auto-generated if empty" style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>DESCRIPTION</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>COVER IMAGE (Cloudinary)</label>
                {formData.image && (
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '8px' }}>
                    <img src={formData.image} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                    <button type="button" onClick={() => setFormData({...formData, image: ''})} style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--error)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px' }}>✕</button>
                  </div>
                )}
                {!formData.image && (
                  <ImageUpload onUploadSuccess={(url) => setFormData({...formData, image: url})} maxFiles={1} />
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>SORT ORDER</label>
                <input type="number" value={formData.sortOrder} onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
              </div>
              
              <div style={{ marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} /> Active Collection
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', border: '1px solid var(--linen)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '12px', backgroundColor: saving ? '#ccc' : 'var(--espresso)', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving...' : 'Save Collection'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
