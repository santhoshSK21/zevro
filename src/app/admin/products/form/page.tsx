'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MediaManager from '../../../../components/admin/MediaManager';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function generateChildSku(parentSku: string, colorName: string, size: string) {
  const p = (parentSku || 'SKU').toUpperCase().replace(/\s+/g, '-');
  const c = colorName.toUpperCase().replace(/\s+/g, '-').replace(/[^A-Z0-9-]/g, '');
  return `${p}-${c}-${size}`;
}

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
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);

  const initialFormState = {
    name: '',
    slug: '',
    parentSku: '',
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
      colorName: 'Default',
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
  }, []);

  useEffect(() => {
    if (id) {
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
    if (formData.price <= 0) { showToast('Price must be greater than 0', 'error'); return; }
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
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) {
        showToast(`Product ${id ? 'updated' : 'created'} successfully`, 'success');
        router.push('/admin/products');
      } else {
        showToast(data.error || 'Failed to save product', 'error');
      }
    } catch {
      showToast('An error occurred while saving', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Variant helpers ────────────────────────────────────────────────────────
  const addVariant = () => {
    const v = [...formData.variants, { colorName: '', colorHex: '#888888', images: [], sizes: [] }];
    setFormData({ ...formData, variants: v });
    setActiveVariantIdx(v.length - 1);
  };

  const removeVariant = (idx: number) => {
    if (formData.variants.length === 1) return;
    const v = formData.variants.filter((_: any, i: number) => i !== idx);
    setFormData({ ...formData, variants: v });
    setActiveVariantIdx(Math.max(0, idx - 1));
  };

  const updateVariantField = (idx: number, field: string, value: string) => {
    const v = [...formData.variants];
    v[idx] = { ...v[idx], [field]: value };
    if (field === 'colorName') {
      v[idx].sizes = v[idx].sizes.map((s: any) => ({
        ...s,
        sku: generateChildSku(formData.parentSku, value, s.size)
      }));
    }
    setFormData({ ...formData, variants: v });
  };

  const handleSizeToggle = (size: string, variantIdx: number) => {
    const v = [...formData.variants];
    const sizes = v[variantIdx].sizes;
    const exists = sizes.find((s: any) => s.size === size);
    if (exists) {
      v[variantIdx].sizes = sizes.filter((s: any) => s.size !== size);
    } else {
      v[variantIdx].sizes = [
        ...sizes,
        { size, stock: 10, sku: generateChildSku(formData.parentSku, v[variantIdx].colorName, size) }
      ];
    }
    setFormData({ ...formData, variants: v });
  };

  const handleStockChange = (size: string, stock: number, variantIdx: number) => {
    const v = [...formData.variants];
    const sizeObj = v[variantIdx].sizes.find((s: any) => s.size === size);
    if (sizeObj) sizeObj.stock = stock;
    setFormData({ ...formData, variants: v });
  };

  const handleSkuChange = (size: string, sku: string, variantIdx: number) => {
    const v = [...formData.variants];
    const sizeObj = v[variantIdx].sizes.find((s: any) => s.size === size);
    if (sizeObj) sizeObj.sku = sku;
    setFormData({ ...formData, variants: v });
  };

  const handleParentSkuChange = (newParentSku: string) => {
    const v = formData.variants.map((variant: any) => ({
      ...variant,
      sizes: variant.sizes.map((s: any) => ({
        ...s,
        sku: generateChildSku(newParentSku, variant.colorName, s.size)
      }))
    }));
    setFormData({ ...formData, parentSku: newParentSku, variants: v });
  };

  // ── Category helpers ───────────────────────────────────────────────────────
  const CATEGORY_PRESETS: Record<string, { name: string; slug: string; subcategories: { name: string; slug: string }[] }> = {
    'western-wear': { name: 'Western Wear', slug: 'western-wear', subcategories: [{ name: 'Dresses & Gowns', slug: 'dresses-gowns' }, { name: 'Co-ord Sets', slug: 'coord-sets' }, { name: 'Tops & Shirts', slug: 'tops-shirts' }, { name: 'Trousers & Skirts', slug: 'trousers-skirts' }, { name: 'Blazers & Jackets', slug: 'blazers-jackets' }, { name: 'Jumpsuits', slug: 'jumpsuits' }] },
    'ethnic-wear': { name: 'Ethnic Wear', slug: 'ethnic-wear', subcategories: [{ name: 'Sarees & Drapes', slug: 'sarees-drapes' }, { name: 'Anarkali Suits', slug: 'anarkali-suits' }, { name: 'Lehengas & Sets', slug: 'lehengas-sets' }, { name: 'Kurta Sets', slug: 'kurta-sets' }, { name: 'Festive Dupattas', slug: 'festive-dupattas' }] },
    'indo-western': { name: 'Indo-Western', slug: 'indo-western', subcategories: [{ name: 'Cape Gowns', slug: 'cape-gowns' }, { name: 'Draped Dhoti Sets', slug: 'dhoti-sets' }, { name: 'Fusion Co-ords', slug: 'fusion-coords' }, { name: 'Crop Top & Skirt', slug: 'crop-top-skirt' }] },
    'accessories': { name: 'Accessories', slug: 'accessories', subcategories: [{ name: 'Jewelry & Kundan Sets', slug: 'jewelry' }, { name: 'Handcrafted Clutches & Potlis', slug: 'clutches' }, { name: 'Belts & Embellishments', slug: 'belts' }, { name: 'Footwear & Juttis', slug: 'footwear' }] },
    'new-in': { name: 'New Arrivals', slug: 'new-in', subcategories: [{ name: 'Runway Highlights', slug: 'runway-highlights' }, { name: 'Seasonal Drop', slug: 'seasonal-drop' }, { name: 'Limited Edition', slug: 'limited-edition' }] }
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
  const presetSubCats = CATEGORY_PRESETS[normalizedCategory]?.subcategories || CATEGORY_PRESETS[formData.category]?.subcategories || [];
  const subCats = [
    ...dbSubCats.map((c: any) => ({ name: c.name, slug: c.slug })),
    ...presetSubCats
  ].filter((item, index, self) => index === self.findIndex(t => t.slug === item.slug));

  const TABS = ['Basic Info', 'Organization', 'Pricing & SEO', 'Variants & Stock', 'Media'];
  const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', marginBottom: '6px', fontWeight: 700, color: '#64748B', letterSpacing: '0.06em' };

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>;

  const activeVariant = formData.variants[activeVariantIdx] || formData.variants[0];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '64px' }}>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '14px 22px', borderRadius: '6px', color: '#fff', backgroundColor: toast.type === 'success' ? '#16A34A' : '#EF4444', boxShadow: '0 4px 16px rgba(0,0,0,0.18)', fontSize: '14px' }}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#0F172A', margin: 0 }}>
          {id ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => router.push('/admin/products')} type="button" style={{ padding: '10px 20px', border: '1px solid #CBD5E1', background: 'transparent', cursor: 'pointer', borderRadius: '6px', color: '#475569', fontSize: '13px' }}>Cancel</button>
          <button onClick={handleSave} type="button" disabled={saving} style={{ padding: '10px 24px', backgroundColor: saving ? '#94A3B8' : '#0F172A', color: '#FAF8F5', border: '1px solid #C5A880', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: '6px', fontWeight: 600, fontSize: '13px' }}>
            {saving ? 'Saving...' : (id ? 'Save Changes' : 'Create Product')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '2px solid #E2E8F0', marginBottom: '32px' }}>
        {TABS.map((tab, idx) => (
          <button key={tab} onClick={() => setActiveTab(idx)} style={{ padding: '12px 0', background: 'none', border: 'none', borderBottom: activeTab === idx ? '2px solid #C5A880' : '2px solid transparent', color: activeTab === idx ? '#0F172A' : '#94A3B8', fontWeight: activeTab === idx ? 700 : 500, cursor: 'pointer', fontSize: '13px', marginBottom: '-2px', transition: 'color 0.15s' }}>
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>

        {/* ── BASIC INFO ─────────────────────────────────────────── */}
        {activeTab === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>PRODUCT NAME *</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>SLUG</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="Auto-generated if empty" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>PARENT SKU</label>
                <input
                  type="text"
                  value={formData.parentSku}
                  onChange={e => handleParentSkuChange(e.target.value)}
                  placeholder="e.g. DRESS-001"
                  style={inputStyle}
                />
                <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '5px', margin: '5px 0 0' }}>
                  Child SKUs auto-generate as: <strong style={{ color: '#64748B' }}>{(formData.parentSku || 'DRESS-001').toUpperCase()}-RED-M</strong>
                </p>
              </div>
            </div>

            <div>
              <label style={labelStyle}>SHORT DESCRIPTION</label>
              <textarea value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>FULL DESCRIPTION</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>FABRIC / MATERIAL</label>
              <input type="text" value={formData.fabric} onChange={e => setFormData({ ...formData, fabric: e.target.value })} placeholder="e.g. 100% Pure Mulberry Silk" style={inputStyle} />
            </div>
          </div>
        )}

        {/* ── ORGANIZATION ───────────────────────────────────────── */}
        {activeTab === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label style={labelStyle}>CATEGORY *</label>
                <select required value={formData.category} onChange={e => {
                  const newCat = e.target.value;
                  const normalized = normalizeCatSlug(newCat);
                  const defaultSub = CATEGORY_PRESETS[normalized]?.subcategories?.[0]?.slug || '';
                  setFormData({ ...formData, category: newCat, subcategory: defaultSub });
                }} style={inputStyle}>
                  <option value="">-- Select Category --</option>
                  {allParentCategories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ flex: '1 1 300px' }}>
                <label style={labelStyle}>SUBCATEGORY {subCats.length > 0 && `(${subCats.length} options)`}</label>
                <select value={formData.subcategory} onChange={e => setFormData({ ...formData, subcategory: e.target.value })} style={inputStyle}>
                  <option value="">-- Select Subcategory --</option>
                  {subCats.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
                {subCats.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '6px', fontWeight: 700, letterSpacing: '0.05em' }}>QUICK SELECT:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {subCats.map(c => {
                        const isSelected = formData.subcategory === c.slug || formData.subcategory === c.name;
                        return (
                          <button key={c.slug} type="button" onClick={() => setFormData({ ...formData, subcategory: c.slug })}
                            style={{ padding: '5px 12px', borderRadius: '16px', fontSize: '11px', border: isSelected ? '1px solid #0F172A' : '1px solid #CBD5E1', backgroundColor: isSelected ? '#0F172A' : '#F8FAFC', color: isSelected ? '#FAF8F5' : '#334155', cursor: 'pointer', fontWeight: isSelected ? 700 : 500, transition: 'all 0.15s' }}>
                            {c.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {formData.category && subCats.length === 0 && (
                  <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>No subcategories registered for this category.</p>
                )}
              </div>
            </div>
            <div>
              <label style={labelStyle}>COLLECTIONS (Optional)</label>
              <select multiple value={formData.collections} onChange={e => {
                const vals = Array.from(e.target.selectedOptions, o => o.value);
                setFormData({ ...formData, collections: vals });
              }} style={{ ...inputStyle, height: '120px' }}>
                {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Hold Ctrl/Cmd to select multiple collections.</p>
            </div>
          </div>
        )}

        {/* ── PRICING & SEO ──────────────────────────────────────── */}
        {activeTab === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>SELLING PRICE (₹) *</label>
                <input required type="number" min="1" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>ORIGINAL MRP (₹)</label>
                <input type="number" value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })} style={inputStyle} />
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0' }} />
            <div>
              <label style={labelStyle}>SEO TITLE</label>
              <input type="text" value={formData.seoTitle} onChange={e => setFormData({ ...formData, seoTitle: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>SEO DESCRIPTION</label>
              <textarea value={formData.seoDescription} onChange={e => setFormData({ ...formData, seoDescription: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0' }} />
            <div>
              <label style={labelStyle}>PRODUCT STATUS</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={inputStyle}>
                <option value="DRAFT">DRAFT (Hidden)</option>
                <option value="ACTIVE">ACTIVE (Published)</option>
                <option value="ARCHIVED">ARCHIVED (Discontinued)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[['isFeatured', 'Featured'], ['isNewArrival', 'New Arrival'], ['isBestseller', 'Bestseller']].map(([field, label]) => (
                <label key={field} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input type="checkbox" checked={formData[field]} onChange={e => setFormData({ ...formData, [field]: e.target.checked })} /> {label}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ── VARIANTS & STOCK ──────────────────────────────────── */}
        {activeTab === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Parent SKU banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>PARENT SKU</span>
              {formData.parentSku
                ? <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: '#0F172A', background: '#E2E8F0', padding: '3px 10px', borderRadius: '4px' }}>{formData.parentSku.toUpperCase()}</span>
                : <span style={{ fontSize: '13px', color: '#94A3B8' }}>Not set — go to <strong>Basic Info</strong> tab to add a Parent SKU</span>
              }
            </div>

            {/* Color variant tab bar */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', marginRight: '4px' }}>COLOR VARIANTS</span>
                {formData.variants.map((v: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'stretch' }}>
                    <button type="button" onClick={() => setActiveVariantIdx(idx)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: activeVariantIdx === idx ? '1.5px solid #0F172A' : '1px solid #CBD5E1', borderRadius: formData.variants.length > 1 ? '6px 0 0 6px' : '6px', background: activeVariantIdx === idx ? '#0F172A' : '#F8FAFC', color: activeVariantIdx === idx ? '#fff' : '#334155', cursor: 'pointer', fontSize: '12px', fontWeight: 600, transition: 'all 0.15s' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: v.colorHex, border: '1px solid rgba(0,0,0,0.2)', display: 'inline-block', flexShrink: 0 }} />
                      {v.colorName || `Color ${idx + 1}`}
                      {v.sizes.length > 0 && <span style={{ opacity: 0.65, fontWeight: 400 }}>({v.sizes.length})</span>}
                    </button>
                    {formData.variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(idx)} title="Remove color"
                        style={{ padding: '0 9px', border: activeVariantIdx === idx ? '1.5px solid #0F172A' : '1px solid #CBD5E1', borderLeft: 'none', borderRadius: '0 6px 6px 0', background: '#FEE2E2', color: '#EF4444', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addVariant}
                  style={{ padding: '6px 14px', border: '1px dashed #C5A880', borderRadius: '6px', background: 'transparent', color: '#C5A880', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  + Add Color
                </button>
              </div>

              {/* Active variant editor */}
              <div style={{ padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>COLOR NAME</label>
                    <input type="text" value={activeVariant.colorName} onChange={e => updateVariantField(activeVariantIdx, 'colorName', e.target.value)} placeholder="e.g. Midnight Blue" style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>COLOR SWATCH</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="color" value={activeVariant.colorHex} onChange={e => updateVariantField(activeVariantIdx, 'colorHex', e.target.value)}
                        style={{ width: '44px', height: '44px', padding: '2px', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }} />
                      <input type="text" value={activeVariant.colorHex} onChange={e => updateVariantField(activeVariantIdx, 'colorHex', e.target.value)}
                        style={{ ...inputStyle, fontFamily: 'monospace' }} />
                    </div>
                  </div>
                </div>

                <label style={labelStyle}>SELECT SIZES</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {SIZES.map(s => {
                    const isActive = activeVariant.sizes.some((sz: any) => sz.size === s);
                    return (
                      <button key={s} type="button" onClick={() => handleSizeToggle(s, activeVariantIdx)}
                        style={{ padding: '8px 18px', borderRadius: '6px', border: isActive ? '1.5px solid #0F172A' : '1px solid #CBD5E1', background: isActive ? '#0F172A' : '#fff', color: isActive ? '#fff' : '#64748B', cursor: 'pointer', fontWeight: 600, fontSize: '13px', transition: 'all 0.15s' }}>
                        {s}
                      </button>
                    );
                  })}
                </div>

                {activeVariant.sizes.length > 0 ? (
                  <div>
                    <label style={{ ...labelStyle, marginBottom: '10px' }}>SKU & STOCK PER SIZE</label>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '6px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                      <thead>
                        <tr style={{ background: '#F1F5F9' }}>
                          <th style={{ padding: '10px 14px', fontSize: '11px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textAlign: 'left', width: '70px' }}>SIZE</th>
                          <th style={{ padding: '10px 14px', fontSize: '11px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textAlign: 'left' }}>
                            CHILD SKU <span style={{ color: '#94A3B8', fontWeight: 400, textTransform: 'none' }}>(auto-generated · editable)</span>
                          </th>
                          <th style={{ padding: '10px 14px', fontSize: '11px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textAlign: 'left', width: '110px' }}>STOCK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeVariant.sizes.map((s: any, si: number) => (
                          <tr key={s.size} style={{ borderTop: si > 0 ? '1px solid #E2E8F0' : 'none' }}>
                            <td style={{ padding: '10px 14px' }}>
                              <span style={{ fontWeight: 700, fontSize: '13px', fontFamily: 'monospace', background: '#E2E8F0', padding: '3px 8px', borderRadius: '4px' }}>{s.size}</span>
                            </td>
                            <td style={{ padding: '8px 14px' }}>
                              <input type="text" value={s.sku || ''} onChange={e => handleSkuChange(s.size, e.target.value, activeVariantIdx)}
                                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '12px' }} />
                            </td>
                            <td style={{ padding: '8px 14px' }}>
                              <input type="number" min="0" value={s.stock} onChange={e => handleStockChange(s.size, Number(e.target.value), activeVariantIdx)}
                                style={{ ...inputStyle, width: '90px' }} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '13px', padding: '12px 0', margin: 0 }}>
                    Select at least one size above to manage SKUs and stock.
                  </p>
                )}
              </div>
            </div>

            {/* All-variants summary */}
            {formData.variants.some((v: any) => v.sizes.length > 0) && (
              <div style={{ padding: '16px 20px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', letterSpacing: '0.05em', marginBottom: '12px' }}>ALL VARIANTS SUMMARY</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '6px 10px', fontSize: '11px', color: '#92400E', textAlign: 'left', fontWeight: 700 }}>COLOR</th>
                      <th style={{ padding: '6px 10px', fontSize: '11px', color: '#92400E', textAlign: 'left', fontWeight: 700 }}>SIZES</th>
                      <th style={{ padding: '6px 10px', fontSize: '11px', color: '#92400E', textAlign: 'right', fontWeight: 700 }}>TOTAL STOCK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.variants.filter((v: any) => v.sizes.length > 0).map((v: any, idx: number) => (
                      <tr key={idx} style={{ borderTop: '1px solid #FDE68A' }}>
                        <td style={{ padding: '8px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: v.colorHex, border: '1px solid rgba(0,0,0,0.15)', display: 'inline-block' }} />
                            <span style={{ fontWeight: 600, fontSize: '13px' }}>{v.colorName || `Color ${idx + 1}`}</span>
                          </div>
                        </td>
                        <td style={{ padding: '8px 10px', fontSize: '12px', color: '#374151' }}>{v.sizes.map((s: any) => s.size).join(', ')}</td>
                        <td style={{ padding: '8px 10px', fontSize: '13px', fontWeight: 700, textAlign: 'right', color: '#374151' }}>
                          {v.sizes.reduce((acc: number, s: any) => acc + (s.stock || 0), 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── MEDIA ─────────────────────────────────────────────── */}
        {activeTab === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {formData.variants.map((v: any, idx: number) => (
                <button key={idx} type="button" onClick={() => setActiveVariantIdx(idx)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: activeVariantIdx === idx ? '1.5px solid #0F172A' : '1px solid #CBD5E1', borderRadius: '6px', background: activeVariantIdx === idx ? '#0F172A' : '#F8FAFC', color: activeVariantIdx === idx ? '#fff' : '#334155', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: v.colorHex, border: '1px solid rgba(0,0,0,0.15)', display: 'inline-block' }} />
                  {v.colorName || `Color ${idx + 1}`}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Managing images for <strong>{activeVariant.colorName || `Color ${activeVariantIdx + 1}`}</strong>. Drag to reorder — first image is the cover.
            </p>
            <MediaManager
              images={activeVariant.images}
              onChange={newImages => {
                const v = [...formData.variants];
                v[activeVariantIdx].images = newImages;
                setFormData({ ...formData, variants: v });
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
