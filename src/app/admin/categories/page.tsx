'use client';

import React, { useEffect, useState } from 'react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
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
    parent: '',
    sortOrder: 0,
    isActive: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCategories(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (category: any) => {
    setFormData({
      ...initialFormState,
      ...category,
      parent: category.parent || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showToast('Category deleted', 'success');
        setCategories(categories.filter(c => c._id !== id));
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
    const url = formData._id ? `/api/categories/${formData._id}` : '/api/categories';
    
    const payload = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    if (!payload.parent) delete (payload as any).parent;
    if (!payload._id) delete (payload as any)._id;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast(`Category ${formData._id ? 'updated' : 'created'} successfully`, 'success');
        setShowAddModal(false);
        fetchCategories();
      } else {
        showToast(data.error || 'Failed to save', 'error');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  const parentCategories = categories.filter(c => !c.parent);

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '16px 24px', borderRadius: '4px', color: '#fff', backgroundColor: toast.type === 'success' ? 'var(--success)' : 'var(--error)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>CATEGORIES</h1>
        <button 
          onClick={() => { setFormData(initialFormState); setShowAddModal(true); }} 
          style={{ padding: '8px 16px', backgroundColor: 'var(--espresso)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          + Add Category
        </button>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E9ECEF', textAlign: 'left', backgroundColor: '#F8F9FA' }}>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Category Name</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Slug</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Type</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Order</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center' }}>Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#6C757D' }}>No categories found.</td></tr>
            ) : (
              categories.map(cat => (
                <tr key={cat._id} style={{ borderBottom: '1px solid #E9ECEF' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--espresso)' }}>{cat.name}</td>
                  <td style={{ padding: '16px 24px', color: '#6C757D' }}>{cat.slug}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', backgroundColor: cat.parent ? '#E3F2FD' : '#E8F5E9', color: cat.parent ? '#1976D2' : 'var(--success)' }}>
                      {cat.parent ? 'Subcategory' : 'Main Category'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#6C757D' }}>{cat.sortOrder}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', backgroundColor: cat.isActive ? '#E8F5E9' : '#FDECEA', color: cat.isActive ? 'var(--success)' : 'var(--error)' }}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button onClick={() => handleEdit(cat)} style={{ background: 'none', border: 'none', color: '#1976D2', cursor: 'pointer', fontSize: '13px', marginRight: '12px' }}>Edit</button>
                    <button onClick={() => setConfirmDelete(cat._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
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
            <h3 style={{ fontSize: '20px', color: 'var(--espresso)', marginBottom: '16px' }}>Delete Category?</h3>
            <p style={{ color: '#6C757D', marginBottom: '24px' }}>Are you sure you want to delete this category? If it contains products, deletion will be rejected by the server.</p>
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
              <h2 style={{ color: 'var(--espresso)' }}>{formData._id ? 'Edit Category' : 'Add Category'}</h2>
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
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>PARENT CATEGORY (Optional)</label>
                  <select value={formData.parent} onChange={(e) => setFormData({...formData, parent: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }}>
                    <option value="">-- None (Main Category) --</option>
                    {parentCategories.map(c => c._id !== formData._id && <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>SORT ORDER</label>
                  <input type="number" value={formData.sortOrder} onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
                </div>
              </div>
              
              <div style={{ marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} /> Active Category
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', border: '1px solid var(--linen)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '12px', backgroundColor: saving ? '#ccc' : 'var(--espresso)', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
