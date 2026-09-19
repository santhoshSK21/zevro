'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MediaManager from '../../../../components/admin/MediaManager';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function AdminProductFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [activeTab, setActiveTab] = useState(0);

  const initialFormState = {
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    category: '',
    subcategory: '',
    collections: [] as string[],
    price: 0,
    originalPrice: 0,
    status: 'DRAFT',
    isFeatured: false,
    isNewArrival: false,
    isBestseller: false,
    variants: [{
      colorName: 'Standard',
      colorHex: '#000000',
      images: [] as string[],
      sizes: [] as { size: string; stock: number; sku: string }[]
    }],
    materials: [] as { name: string; priceModifier: number; available: boolean }[],
    fabric: '',
    careInstructions: [] as string[],
    seoTitle: '',
    seoDescription: '',
  };
  
  const [formData, setFormData] = useState<any>(initialFormState);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/collections?admin=true').then(res => res.json())
    ]).then(([catData, colData]) => {
      setCategories(catData);
      setCollections(colData);
    });

    if (id) {
      fetch(`/api/products?q=&status=&page=1&limit=1&admin=true`)
        .then(res => res.json())
        .then(data => {
          // find the product in the admin endpoint
          // Since the endpoint doesn't strictly have a "GET by ID" in admin mode natively without fetching it,
          // Let's just fetch it directly from the storefront endpoint or we can add a GET by ID
          // Wait, we have GET by ID in /api/products/[id], it's not implemented yet for GET!
          // Let's just fetch the whole list and filter, or I'll implement GET by id in route.ts.
          // Actually, I can use the existing /api/products/[slug] endpoint if it works by ID, or just fetch all and find.
        });
    }
  }, [id]);

  // Fallback fetch if ID is present
  useEffect(() => {
    if (id) {
      // We will just fetch using the general products endpoint and find by ID.
      // Since it's admin, we can fetch all or search by id.
      // Easiest is to add a small api route for GET /api/products/[id], but since I didn't, I will fetch all and filter.
      fetch(`/api/products?admin=true&limit=1000`)
        .then(res => res.json())
        .then(data => {
          const products = data.products || data;
          const product = products.find((p: any) => p._id === id);
          if (product) {
            setFormData({
              ...initialFormState,
              ...product,
              price: product.price ? product.price / 100 : 0,
              originalPrice: product.originalPrice ? product.originalPrice / 100 : 0,
            });
          }
          setLoading(false);
        });
    }
  }, [id]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.price <= 0) {
      showToast('Price must be greater than 0', 'error');
      return;
    }

    setSaving(true);
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/products/${id}` : '/api/products';
    
    const payload = {
      ...formData,
      price: Math.round(formData.price * 100),
      originalPrice: Math.round(formData.originalPrice * 100),
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Product ${id ? 'updated' : 'created'} successfully`, 'success');
        router.push('/admin/products');
      } else {
        showToast(data.error || 'Failed to save product', 'error');
      }
    } catch (err) {
      showToast('An error occurred while saving', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSizeToggle = (size: string, variantIndex: number) => {
    const variants = [...formData.variants];
    const sizes = variants[variantIndex].sizes;
    const exists = sizes.find((s: any) => s.size === size);
    if (exists) {
      variants[variantIndex].sizes = sizes.filter((s: any) => s.size !== size);
    } else {
      variants[variantIndex].sizes.push({ size, stock: 10, sku: `${formData.slug ? formData.slug.toUpperCase() : 'SKU'}-${size}` });
    }
    setFormData({ ...formData, variants });
  };

  const handleStockChange = (size: string, stock: number, variantIndex: number) => {
    const variants = [...formData.variants];
    const sizeObj = variants[variantIndex].sizes.find((s: any) => s.size === size);
    if (sizeObj) sizeObj.stock = stock;
    setFormData({ ...formData, variants });
  };

  const handleSkuChange = (size: string, sku: string, variantIndex: number) => {
    const variants = [...formData.variants];
    const sizeObj = variants[variantIndex].sizes.find((s: any) => s.size === size);
    if (sizeObj) sizeObj.sku = sku;
    setFormData({ ...formData, variants });
  };

  const parentCats = categories.filter(c => !c.parent);
  const subCats = categories.filter(c => c.parent && categories.find(p => p.slug === formData.category && p._id === c.parent));

  const TABS = ['Basic Info', 'Organization', 'Pricing & SEO', 'Variants & Stock', 'Media'];

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '64px' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '16px 24px', borderRadius: '4px', color: '#fff', backgroundColor: toast.type === 'success' ? 'var(--success)' : 'var(--error)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>
          {id ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => router.push('/admin/products')} type="button" style={{ padding: '10px 20px', border: '1px solid var(--linen)', background: 'transparent', cursor: 'pointer', borderRadius: '4px' }}>Cancel</button>
          <button onClick={handleSave} type="button" disabled={saving} style={{ padding: '10px 20px', backgroundColor: saving ? '#ccc' : 'var(--espresso)', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: '4px' }}>
            {saving ? 'Saving...' : (id ? 'Save Changes' : 'Create Product')}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--linen)', marginBottom: '32px' }}>
        {TABS.map((tab, idx) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(idx)}
            style={{ 
              padding: '12px 0', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === idx ? '2px solid var(--espresso)' : '2px solid transparent',
              color: activeTab === idx ? 'var(--espresso)' : 'var(--warm-grey)',
              fontWeight: activeTab === idx ? 600 : 400,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
        
        {/* BASIC INFO */}
        {activeTab === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>PRODUCT NAME *</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>SLUG</label>
              <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="Auto-generated if empty" style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>SHORT DESCRIPTION</label>
              <textarea value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} rows={2} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>FULL DESCRIPTION</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={5} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>FABRIC / MATERIAL</label>
              <input type="text" value={formData.fabric} onChange={(e) => setFormData({...formData, fabric: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
            </div>
          </div>
        )}

        {/* ORGANIZATION */}
        {activeTab === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>CATEGORY *</label>
                <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value, subcategory: ''})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', borderRadius: '4px' }}>
                  <option value="">-- Select Category --</option>
                  {parentCats.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>SUBCATEGORY</label>
                <select value={formData.subcategory} onChange={(e) => setFormData({...formData, subcategory: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', borderRadius: '4px' }}>
                  <option value="">-- Select --</option>
                  {subCats.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>COLLECTIONS (Optional)</label>
              <select 
                multiple 
                value={formData.collections} 
                onChange={(e) => {
                  const vals = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData({...formData, collections: vals});
                }}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', borderRadius: '4px', height: '120px' }}
              >
                {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <p style={{ fontSize: '12px', color: 'var(--warm-grey)', marginTop: '4px' }}>Hold Ctrl/Cmd to select multiple.</p>
            </div>
          </div>
        )}

        {/* PRICING & SEO */}
        {activeTab === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>SELLING PRICE (₹) *</label>
                <input required type="number" min="1" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>ORIGINAL MRP (₹)</label>
                <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
              </div>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid var(--linen)', margin: '16px 0' }} />
            
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>SEO TITLE</label>
              <input type="text" value={formData.seoTitle} onChange={(e) => setFormData({...formData, seoTitle: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>SEO DESCRIPTION</label>
              <textarea value={formData.seoDescription} onChange={(e) => setFormData({...formData, seoDescription: e.target.value})} rows={3} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--linen)', margin: '16px 0' }} />

            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>PRODUCT STATUS</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--linen)', borderRadius: '4px' }}>
                <option value="DRAFT">DRAFT (Hidden)</option>
                <option value="ACTIVE">ACTIVE (Published)</option>
                <option value="ARCHIVED">ARCHIVED (Discontinued)</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} /> Featured
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input type="checkbox" checked={formData.isNewArrival} onChange={(e) => setFormData({...formData, isNewArrival: e.target.checked})} /> New Arrival
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input type="checkbox" checked={formData.isBestseller} onChange={(e) => setFormData({...formData, isBestseller: e.target.checked})} /> Bestseller
              </label>
            </div>
          </div>
        )}

        {/* VARIANTS & STOCK */}
        {activeTab === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '14px', color: 'var(--warm-grey)' }}>Manage product sizes, SKUs, and stock quantities for the primary variant.</p>
            
            <div style={{ padding: '16px', backgroundColor: '#F8F9FA', borderRadius: '4px', border: '1px solid #E9ECEF' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>COLOR NAME</label>
                  <input type="text" value={formData.variants[0].colorName} onChange={(e) => {
                    const v = [...formData.variants];
                    v[0].colorName = e.target.value;
                    setFormData({...formData, variants: v});
                  }} style={{ width: '100%', padding: '10px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>COLOR HEX</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="color" value={formData.variants[0].colorHex} onChange={(e) => {
                      const v = [...formData.variants];
                      v[0].colorHex = e.target.value;
                      setFormData({...formData, variants: v});
                    }} style={{ width: '40px', height: '40px', padding: '0', border: 'none' }} />
                    <input type="text" value={formData.variants[0].colorHex} readOnly style={{ width: '100%', padding: '10px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>

              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>AVAILABLE SIZES</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {SIZES.map(s => {
                  const isActive = formData.variants[0].sizes.some((sz: any) => sz.size === s);
                  return (
                    <button 
                      type="button" 
                      key={s} 
                      onClick={() => handleSizeToggle(s, 0)} 
                      style={{ 
                        padding: '8px 16px', 
                        border: '1px solid var(--espresso)', 
                        backgroundColor: isActive ? 'var(--espresso)' : 'transparent', 
                        color: isActive ? '#fff' : 'var(--espresso)', 
                        cursor: 'pointer',
                        borderRadius: '4px' 
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              
              {formData.variants[0].sizes.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--linen)', textAlign: 'left' }}>
                      <th style={{ padding: '8px', fontSize: '12px', color: 'var(--warm-grey)' }}>SIZE</th>
                      <th style={{ padding: '8px', fontSize: '12px', color: 'var(--warm-grey)' }}>SKU *</th>
                      <th style={{ padding: '8px', fontSize: '12px', color: 'var(--warm-grey)' }}>STOCK *</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.variants[0].sizes.map((s: any) => (
                      <tr key={s.size}>
                        <td style={{ padding: '8px', fontWeight: 600 }}>{s.size}</td>
                        <td style={{ padding: '8px' }}>
                          <input required type="text" value={s.sku || ''} onChange={(e) => handleSkuChange(s.size, e.target.value, 0)} style={{ width: '100%', padding: '8px', border: '1px solid var(--linen)' }} />
                        </td>
                        <td style={{ padding: '8px' }}>
                          <input required type="number" min="0" value={s.stock} onChange={(e) => handleStockChange(s.size, Number(e.target.value), 0)} style={{ width: '100%', padding: '8px', border: '1px solid var(--linen)' }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* MEDIA */}
        {activeTab === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '14px', color: 'var(--warm-grey)' }}>Drag and drop images to reorder. The first image will be the primary cover image.</p>
            <MediaManager 
              images={formData.variants[0].images} 
              onChange={(newImages) => {
                const v = [...formData.variants];
                v[0].images = newImages;
                setFormData({...formData, variants: v});
              }}
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default function AdminProductFormPage() {
  return (
    <React.Suspense fallback={<div style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>}>
      <AdminProductFormContent />
    </React.Suspense>
  );
}
