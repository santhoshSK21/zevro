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
    
    const variantImages = formData.variants?.[0]?.images || [];
    const payload = {
      ...formData,
      images: variantImages,
      image: variantImages[0] || '',
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

  const CATEGORY_PRESETS: Record<string, { name: string; slug: string; subcategories: { name: string; slug: string }[] }> = {
    'western-wear': {
      name: 'Western Wear',
      slug: 'western-wear',
      subcategories: [
        { name: 'Dresses & Gowns', slug: 'dresses-gowns' },
        { name: 'Co-ord Sets', slug: 'coord-sets' },
        { name: 'Tops & Shirts', slug: 'tops-shirts' },
        { name: 'Trousers & Skirts', slug: 'trousers-skirts' },
        { name: 'Blazers & Jackets', slug: 'blazers-jackets' },
        { name: 'Jumpsuits', slug: 'jumpsuits' }
      ]
    },
    'ethnic-wear': {
      name: 'Ethnic Wear',
      slug: 'ethnic-wear',
      subcategories: [
        { name: 'Sarees & Drapes', slug: 'sarees-drapes' },
        { name: 'Anarkali Suits', slug: 'anarkali-suits' },
        { name: 'Lehengas & Sets', slug: 'lehengas-sets' },
        { name: 'Kurta Sets', slug: 'kurta-sets' },
        { name: 'Festive Dupattas', slug: 'festive-dupattas' }
      ]
    },
    'indo-western': {
      name: 'Indo-Western',
      slug: 'indo-western',
      subcategories: [
        { name: 'Cape Gowns', slug: 'cape-gowns' },
        { name: 'Draped Dhoti Sets', slug: 'dhoti-sets' },
        { name: 'Fusion Co-ords', slug: 'fusion-coords' },
        { name: 'Crop Top & Skirt', slug: 'crop-top-skirt' }
      ]
    },
    'accessories': {
      name: 'Accessories',
      slug: 'accessories',
      subcategories: [
        { name: 'Jewelry & Kundan Sets', slug: 'jewelry' },
        { name: 'Handcrafted Clutches & Potlis', slug: 'clutches' },
        { name: 'Belts & Embellishments', slug: 'belts' },
        { name: 'Footwear & Juttis', slug: 'footwear' }
      ]
    },
    'new-in': {
      name: 'New Arrivals',
      slug: 'new-in',
      subcategories: [
        { name: 'Runway Highlights', slug: 'runway-highlights' },
        { name: 'Seasonal Drop', slug: 'seasonal-drop' },
        { name: 'Limited Edition', slug: 'limited-edition' }
      ]
    }
  };

  const normalizeCatSlug = (cat: string) => {
    if (!cat) return '';
    const lower = cat.toLowerCase().trim();
    if (lower.includes('indo')) return 'indo-western';
    if (lower.includes('west')) return 'western-wear';
    if (lower.includes('ethn') || lower.includes('saree') || lower.includes('lehenga')) return 'ethnic-wear';
    if (lower.includes('access') || lower.includes('jewel') || lower.includes('clutch')) return 'accessories';
    if (lower.includes('new') || lower.includes('drop') || lower.includes('arrival')) return 'new-in';
    return lower.replace(/[^a-z0-9]+/g, '-');
  };

  const parentCatsFromDb = Array.isArray(categories) ? categories.filter(c => !c.parent) : [];
  const allParentCategories = [
    ...parentCatsFromDb.map(c => ({ name: c.name, slug: c.slug, _id: c._id })),
    ...Object.values(CATEGORY_PRESETS).map(c => ({ name: c.name, slug: c.slug, _id: c.slug }))
  ].filter((item, index, self) => index === self.findIndex(t => t.slug === item.slug));

  const selectedCatObj = Array.isArray(categories) ? categories.find(c => c.slug === formData.category || String(c._id) === String(formData.category)) : null;
  const dbSubCats = Array.isArray(categories) ? categories.filter(c => {
    if (!c.parent) return false;
    const parentIdStr = typeof c.parent === 'object' ? String(c.parent._id || c.parent) : String(c.parent);
    const targetIdStr = selectedCatObj ? String(selectedCatObj._id) : '';
    return parentIdStr === targetIdStr || c.parentSlug === formData.category;
  }) : [];

  const normalizedCategory = normalizeCatSlug(formData.category);
  const presetSubCats = CATEGORY_PRESETS[normalizedCategory]?.subcategories || 
                        CATEGORY_PRESETS[formData.category]?.subcategories || [];
  
  const subCats = [
    ...dbSubCats.map((c: any) => ({ name: c.name, slug: c.slug })),
    ...presetSubCats
  ].filter((item, index, self) => index === self.findIndex(t => t.slug === item.slug));

  const TABS = ['Basic Info', 'Organization', 'Pricing & SEO', 'Variants & Stock', 'Media'];

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '64px' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '16px 24px', borderRadius: '4px', color: '#fff', backgroundColor: toast.type === 'success' ? '#16A34A' : '#EF4444', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#0F172A' }}>
          {id ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => router.push('/admin/products')} type="button" style={{ padding: '10px 20px', border: '1px solid #CBD5E1', background: 'transparent', cursor: 'pointer', borderRadius: '4px', color: '#475569' }}>Cancel</button>
          <button onClick={handleSave} type="button" disabled={saving} style={{ padding: '10px 20px', backgroundColor: saving ? '#94A3B8' : '#0F172A', color: '#FAF8F5', border: '1px solid #C5A880', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: '4px', fontWeight: 600 }}>
            {saving ? 'Saving...' : (id ? 'Save Changes' : 'Create Product')}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #E2E8F0', marginBottom: '32px' }}>
        {TABS.map((tab, idx) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(idx)}
            style={{ 
              padding: '12px 0', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === idx ? '2px solid #C5A880' : '2px solid transparent',
              color: activeTab === idx ? '#0F172A' : '#64748B',
              fontWeight: activeTab === idx ? 700 : 400,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
        
        {/* BASIC INFO */}
        {activeTab === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600, color: '#0F172A' }}>PRODUCT NAME *</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600, color: '#0F172A' }}>SLUG</label>
              <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="Auto-generated if empty" style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600, color: '#0F172A' }}>SHORT DESCRIPTION</label>
              <textarea value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} rows={2} style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600, color: '#0F172A' }}>FULL DESCRIPTION</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={5} style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600, color: '#0F172A' }}>FABRIC / MATERIAL</label>
              <input type="text" value={formData.fabric} onChange={(e) => setFormData({...formData, fabric: e.target.value})} placeholder="e.g. 100% Pure Mulberry Silk" style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
            </div>
          </div>
        )}

        {/* ORGANIZATION */}
        {activeTab === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600, color: '#0F172A' }}>CATEGORY *</label>
                <select 
                  required 
                  value={formData.category} 
                  onChange={(e) => {
                    const newCat = e.target.value;
                    const normalized = normalizeCatSlug(newCat);
                    const defaultSub = CATEGORY_PRESETS[normalized]?.subcategories?.[0]?.slug || '';
                    setFormData({ ...formData, category: newCat, subcategory: defaultSub });
                  }} 
                  style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFF', fontSize: '13px' }}
                >
                  <option value="">-- Select Category --</option>
                  {allParentCategories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ flex: '1 1 300px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600, color: '#0F172A' }}>
                  SUBCATEGORY {subCats.length > 0 && `(${subCats.length} options)`}
                </label>
                <select 
                  value={formData.subcategory} 
                  onChange={(e) => setFormData({...formData, subcategory: e.target.value})} 
                  style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFF', fontSize: '13px' }}
                >
                  <option value="">-- Select Subcategory --</option>
                  {subCats.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
                
                {/* Quick Select Buttons */}
                {subCats.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.04em' }}>QUICK SELECT:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {subCats.map(c => {
                        const isSelected = formData.subcategory === c.slug || formData.subcategory === c.name;
                        return (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => setFormData({ ...formData, subcategory: c.slug })}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '16px',
                              fontSize: '11px',
                              border: isSelected ? '1px solid #0F172A' : '1px solid #CBD5E1',
                              backgroundColor: isSelected ? '#0F172A' : '#F8FAFC',
                              color: isSelected ? '#FAF8F5' : '#334155',
                              cursor: 'pointer',
                              fontWeight: isSelected ? 700 : 500,
                              transition: 'all 0.15s'
                            }}
                          >
                            {c.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {formData.category && subCats.length === 0 && (
                  <p style={{ fontSize: '11px', color: '#64748B', marginTop: '6px' }}>No subcategories registered for this category.</p>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 600, color: '#0F172A' }}>COLLECTIONS (Optional)</label>
              <select 
                multiple 
                value={formData.collections} 
                onChange={(e) => {
                  const vals = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData({...formData, collections: vals});
                }}
                style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '4px', height: '120px', backgroundColor: '#FFF' }}
              >
                {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Hold Ctrl/Cmd to select multiple collections.</p>
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
