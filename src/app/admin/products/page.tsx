'use client';

import React, { useEffect, useState } from 'react';
import ImageUpload from '../../../components/admin/ImageUpload';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const initialFormState = {
    _id: '',
    name: '',
    slug: '',
    description: '',
    category: '',
    subcategory: '',
    price: 0,
    originalPrice: 0,
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    variants: [{
      colorName: 'Standard',
      colorHex: '#000000',
      images: [] as string[],
      sizes: [] as { size: string; stock: number }[]
    }]
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const fetchProductsAndCategories = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      setProducts(pData);
      setCategories(cData);
    } catch (e) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (product: any) => {
    setFormData({
      ...initialFormState,
      ...product,
      price: product.price ? product.price / 100 : 0,
      originalPrice: product.originalPrice ? product.originalPrice / 100 : 0,
    });
    setShowAddModal(true);
  };

  const handleDuplicate = async (product: any) => {
    const copy = {
      ...product,
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy-${Date.now()}`
    };
    delete copy._id;
    delete copy.createdAt;
    delete copy.updatedAt;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copy)
      });
      if (res.ok) {
        showToast('Product duplicated', 'success');
        fetchProductsAndCategories();
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to duplicate', 'error');
      }
    } catch (e) {
      showToast('Failed to duplicate', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setProducts(products.filter(p => p._id !== id));
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Product deleted', 'success');
      } else {
        throw new Error();
      }
    } catch (e) {
      showToast('Failed to delete', 'error');
      fetchProductsAndCategories();
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.price <= 0) {
      showToast('Price must be greater than 0', 'error');
      return;
    }

    setSaving(true);
    const method = formData._id ? 'PUT' : 'POST';
    const url = formData._id ? `/api/products/${formData._id}` : '/api/products';
    
    const payload = {
      ...formData,
      price: Math.round(formData.price * 100),
      originalPrice: Math.round(formData.originalPrice * 100),
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    if (!formData._id) delete (payload as any)._id;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Product ${formData._id ? 'updated' : 'created'} successfully`, 'success');
        setShowAddModal(false);
        fetchProductsAndCategories();
      } else {
        showToast(data.error || 'Failed to save product', 'error');
      }
    } catch (err) {
      showToast('An error occurred while saving', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSizeToggle = (size: string) => {
    const variants = [...formData.variants];
    const sizes = variants[0].sizes;
    const exists = sizes.find(s => s.size === size);
    if (exists) {
      variants[0].sizes = sizes.filter(s => s.size !== size);
    } else {
      variants[0].sizes.push({ size, stock: 10 });
    }
    setFormData({ ...formData, variants });
  };

  const handleStockChange = (size: string, stock: number) => {
    const variants = [...formData.variants];
    const sizeObj = variants[0].sizes.find(s => s.size === size);
    if (sizeObj) sizeObj.stock = stock;
    setFormData({ ...formData, variants });
  };

  const totalStock = (product: any) => {
    return product.variants?.[0]?.sizes?.reduce((sum: number, s: any) => sum + s.stock, 0) || 0;
  };

  const parentCats = categories.filter(c => !c.parent);
  const subCats = categories.filter(c => c.parent && categories.find(p => p.slug === formData.category && p._id === c.parent));

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '16px 24px', borderRadius: '4px', color: '#fff', backgroundColor: toast.type === 'success' ? 'var(--success)' : 'var(--error)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', animation: 'fadeIn 0.3s' }}>
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>PRODUCTS</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => { setFormData({...initialFormState, category: parentCats[0]?.slug || ''}); setShowAddModal(true); }} style={{ padding: '8px 16px', backgroundColor: 'var(--espresso)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            + Add Product
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E9ECEF', textAlign: 'left', backgroundColor: '#F8F9FA' }}>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500, width: '60px' }}>Image</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Product Name</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Category</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Stock</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Price</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center' }}>Loading...</td></tr>
            ) : products.map(product => (
              <tr key={product._id} style={{ borderBottom: '1px solid #E9ECEF' }}>
                <td style={{ padding: '16px 24px' }}><img src={product.variants?.[0]?.images?.[0] || ''} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', background: 'var(--color-surface)' }} /></td>
                <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--espresso)' }}>{product.name}<div style={{ fontSize: '11px', color: '#6C757D', marginTop: '4px' }}>{product.slug}</div></td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>{product.category}{product.subcategory && <span style={{ display: 'block', fontSize: '11px', color: '#999' }}>{product.subcategory}</span>}</td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>{totalStock(product)}</td>
                <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)' }}>₹{((product.price||0)/100).toLocaleString('en-IN')}</td>
                <td style={{ padding: '16px 24px' }}><span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', backgroundColor: product.isActive ? '#E8F5E9' : '#FDECEA', color: product.isActive ? 'var(--success)' : 'var(--error)' }}>{product.isActive ? 'Active' : 'Draft'}</span></td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <button onClick={() => handleEdit(product)} style={{ background: 'none', border: 'none', color: '#1976D2', cursor: 'pointer', fontSize: '13px', marginRight: '12px' }}>Edit</button>
                  <button onClick={() => handleDuplicate(product)} style={{ background: 'none', border: 'none', color: '#6C757D', cursor: 'pointer', fontSize: '13px', marginRight: '12px' }}>Duplicate</button>
                  <button onClick={() => setConfirmDelete(product._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', width: '400px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--espresso)', marginBottom: '16px' }}>Delete Product?</h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: '12px', border: '1px solid var(--linen)', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--error)', color: '#fff', border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleSaveProduct} style={{ backgroundColor: '#fff', padding: '32px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: 'var(--espresso)' }}>{formData._id ? 'Edit Product' : 'Add New Product'}</h2>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>PRODUCT NAME *</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>SLUG</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="Auto-generated if empty" style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>PRICE (₹) *</label>
                    <input required type="number" min="1" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>MRP (₹)</label>
                    <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>CATEGORY *</label>
                    <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value, subcategory: ''})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }}>
                      <option value="">-- Select Category --</option>
                      {parentCats.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>SUBCATEGORY</label>
                    <select value={formData.subcategory} onChange={(e) => setFormData({...formData, subcategory: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)' }}>
                      <option value="">-- Select --</option>
                      {subCats.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>IMAGES (Cloudinary)</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {formData.variants[0].images.map((img, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={img} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                        <button type="button" onClick={() => {
                          const v = [...formData.variants];
                          v[0].images = v[0].images.filter((_, idx) => idx !== i);
                          setFormData({...formData, variants: v});
                        }} style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--error)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px' }}>✕</button>
                      </div>
                    ))}
                  </div>
                  <ImageUpload onUploadSuccess={(url) => {
                    const v = [...formData.variants];
                    v[0].images.push(url);
                    setFormData({...formData, variants: v});
                  }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>SIZES & STOCK</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    {SIZES.map(s => {
                      const isActive = formData.variants[0].sizes.some(sz => sz.size === s);
                      return <button type="button" key={s} onClick={() => handleSizeToggle(s)} style={{ padding: '6px 12px', border: '1px solid var(--espresso)', backgroundColor: isActive ? 'var(--espresso)' : 'transparent', color: isActive ? '#fff' : 'var(--espresso)', cursor: 'pointer' }}>{s}</button>;
                    })}
                  </div>
                  {formData.variants[0].sizes.map(s => (
                    <div key={s.size} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ width: '40px', fontWeight: 600 }}>{s.size}</span>
                      <input type="number" min="0" value={s.stock} onChange={(e) => handleStockChange(s.size, Number(e.target.value))} style={{ padding: '8px', border: '1px solid var(--linen)', width: '100px' }} />
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '24px', padding: '16px', backgroundColor: '#F8F9FA', borderRadius: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} /> Active</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} /> Featured</label>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', border: '1px solid var(--linen)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '12px', backgroundColor: saving ? '#ccc' : 'var(--espresso)', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving...' : 'Save Product'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
