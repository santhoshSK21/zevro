'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MediaManager from '../../../../components/admin/MediaManager';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

/**
 * Calls POST /api/sku/generate to build a proper BRAND-STYLE-COLOR-SIZE code.
 * Falls back to a simple local format when the API is unavailable (e.g. no DB).
 */
async function fetchGeneratedSku(
  brand: string,
  category: string,
  color: string,
  size: string,
  serialNumber: number,
): Promise<string> {
  try {
    const res = await fetch('/api/sku/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, category, serialNumber, color, size }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.sku as string;
    }
  } catch {
    // Network error — fall through to local fallback
  }
  // Local fallback: BRAND-COLOR-SIZE (no serial, no category prefix)
  const b = (brand || 'SKU').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 3).padEnd(3, 'X');
  const c = (color || 'CLR').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 3).padEnd(3, 'X');
  const sz = size.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `${b}-${c}-${sz}`;
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
    brand: '',           // used for BRAND segment of the SKU
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

  // Maps "variantIdx-size" → error message string (empty string = no error)
  const [skuErrors, setSkuErrors] = useState<Record<string, string>>({});
  // Tracks in-flight SKU validation calls to avoid stale responses
  const skuValidationRef = useRef<Record<string, number>>({});

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
      // Direct single product fetch — avoids downloading the entire 1,000 product catalog
      fetch(`/api/products/${id}`)
        .then(res => res.json())
        .then(product => {
          if (product && !product.error) {
            setFormData({
              ...initialFormState,
              ...product,
              price: product.price ? product.price / 100 : 0,
              originalPrice: product.originalPrice ? product.originalPrice / 100 : 0,
            });
          }
          setLoading(false);
        })
        .catch(() => {
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

  /**
   * Re-generates the SKU for a single size entry using the /api/sku/generate
   * endpoint, then patches that size object in the variants array.
   * Returns the updated variants array so callers can batch-apply it.
   */
  const regenerateSkusForVariant = useCallback(
    async (variants: any[], variantIdx: number, currentFormData: any): Promise<any[]> => {
      const variant = variants[variantIdx];
      if (!variant || variant.sizes.length === 0) return variants;

      // Count existing products in the same category to derive the serial number
      let serial = 1;
      try {
        const catSlug = currentFormData.category || currentFormData.subcategory || 'general';
        const res = await fetch(`/api/products?admin=true&category=${encodeURIComponent(catSlug)}&limit=1000`);
        if (res.ok) {
          const data = await res.json();
          const count = data.total ?? (data.products?.length ?? 0);
          // +1 so the new product gets the next number; for edits keep their number
          serial = id ? Math.max(1, count) : Math.max(1, count + 1);
        }
      } catch {
        // ignore — serial defaults to 1
      }

      const updatedVariants = [...variants];
      const updatedSizes = await Promise.all(
        variant.sizes.map(async (s: any) => {
          const generatedSku = await fetchGeneratedSku(
            currentFormData.brand || 'SKU',
            currentFormData.subcategory || currentFormData.category || 'general',
            variant.colorName || 'Default',
            s.size,
            serial,
          );
          return { ...s, sku: generatedSku };
        }),
      );
      updatedVariants[variantIdx] = { ...variant, sizes: updatedSizes };
      return updatedVariants;
    },
    [id],
  );

  const updateVariantField = async (idx: number, field: string, value: string) => {
    const v = [...formData.variants];
    v[idx] = { ...v[idx], [field]: value };
    if (field === 'colorName') {
      // Re-generate SKUs when the color name changes
      const updatedVariants = await regenerateSkusForVariant(
        v, idx, { ...formData, variants: v },
      );
      setFormData((prev: any) => ({ ...prev, variants: updatedVariants }));
      return;
    }
    setFormData((prev: any) => ({ ...prev, variants: v }));
  };

  const handleSizeToggle = async (size: string, variantIdx: number) => {
    const v = [...formData.variants];
    const sizes = v[variantIdx].sizes;
    const exists = sizes.find((s: any) => s.size === size);
    if (exists) {
      v[variantIdx].sizes = sizes.filter((s: any) => s.size !== size);
      // Clear any SKU error for the removed size
      setSkuErrors(prev => {
        const next = { ...prev };
        delete next[`${variantIdx}-${size}`];
        return next;
      });
      setFormData((prev: any) => ({ ...prev, variants: v }));
    } else {
      // Add with a placeholder; regenerate will replace it
      v[variantIdx].sizes = [...sizes, { size, stock: 10, sku: '' }];
      const updatedVariants = await regenerateSkusForVariant(v, variantIdx, formData);
      setFormData((prev: any) => ({ ...prev, variants: updatedVariants }));
    }
  };

  const handleStockChange = (size: string, stock: number, variantIdx: number) => {
    const v = [...formData.variants];
    const sizeObj = v[variantIdx].sizes.find((s: any) => s.size === size);
    if (sizeObj) sizeObj.stock = stock;
    setFormData({ ...formData, variants: v });
  };

  /** Seller edits a SKU manually — update state immediately, validate on blur */
  const handleSkuChange = (size: string, sku: string, variantIdx: number) => {
    const v = [...formData.variants];
    const sizeObj = v[variantIdx].sizes.find((s: any) => s.size === size);
    if (sizeObj) sizeObj.sku = sku;
    setFormData({ ...formData, variants: v });
    // Clear any stale error while the seller is typing
    const key = `${variantIdx}-${size}`;
    setSkuErrors(prev => ({ ...prev, [key]: '' }));
  };

  /**
   * On blur: validate the SKU the seller typed against format + uniqueness.
   * Uses a generation counter per key so only the latest response applies.
   */
  const handleSkuBlur = async (size: string, sku: string, variantIdx: number) => {
    const key = `${variantIdx}-${size}`;
    if (!sku) return;
    const gen = (skuValidationRef.current[key] ?? 0) + 1;
    skuValidationRef.current[key] = gen;
    try {
      const res = await fetch('/api/sku/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, excludeProductId: id || null }),
      });
      if (skuValidationRef.current[key] !== gen) return; // stale response
      const data = await res.json();
      setSkuErrors(prev => ({ ...prev, [key]: data.valid ? '' : (data.error || 'Invalid SKU') }));
    } catch {
      // Network failure — don't block the seller
    }
  };

  /**
   * Re-generates all SKUs for all variants when the brand field changes.
   * Called after the brand input is blurred (not on every keystroke).
   */
  const handleBrandBlur = async (brand: string) => {
    if (!brand.trim()) return;
    let updatedVariants = [...formData.variants];
    for (let i = 0; i < updatedVariants.length; i++) {
      updatedVariants = await regenerateSkusForVariant(
        updatedVariants, i, { ...formData, brand },
      );
    }
    setFormData((prev: any) => ({ ...prev, brand, variants: updatedVariants }));
  };

  const handleParentSkuChange = (newParentSku: string) => {
    // parentSku is now informational only; SKUs are driven by brand+category+color+size
    setFormData((prev: any) => ({ ...prev, parentSku: newParentSku }));
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

  const allParentCategories = useMemo(() => {
    const parentCatsFromDb = Array.isArray(categories) ? categories.filter(c => !c.parent) : [];
    return [
      ...parentCatsFromDb.map(c => ({ name: c.name, slug: c.slug, _id: c._id })),
      ...Object.values(CATEGORY_PRESETS).map(c => ({ name: c.name, slug: c.slug, _id: c.slug }))
    ].filter((item, index, self) => index === self.findIndex(t => t.slug === item.slug));
  }, [categories]);

  const subCats = useMemo(() => {
    const selectedCatObj = Array.isArray(categories) ? categories.find(c => c.slug === formData.category || String(c._id) === String(formData.category)) : null;
    const dbSubCats = Array.isArray(categories) ? categories.filter(c => {
      if (!c.parent) return false;
      const parentIdStr = typeof c.parent === 'object' ? String(c.parent._id || c.parent) : String(c.parent);
      const targetIdStr = selectedCatObj ? String(selectedCatObj._id) : '';
      return parentIdStr === targetIdStr || c.parentSlug === formData.category;
    }) : [];
    const normalizedCategory = normalizeCatSlug(formData.category);
    const presetSubCats = CATEGORY_PRESETS[normalizedCategory]?.subcategories || CATEGORY_PRESETS[formData.category]?.subcategories || [];
    return [
      ...dbSubCats.map((c: any) => ({ name: c.name, slug: c.slug })),
      ...presetSubCats
    ].filter((item, index, self) => index === self.findIndex(t => t.slug === item.slug));
  }, [categories, formData.category]);

  const TABS = ['Basic Info', 'Organization', 'Pricing & SEO', 'Variants & Stock', 'Media'];

  const inputStyle: React.CSSProperties = { 
    width: '100%', 
    padding: '11px 14px', 
    backgroundColor: '#FAF7F0', 
    color: '#1C1C1A', 
    border: '1px solid #DDD6C8', 
    borderRadius: '6px', 
    fontSize: '13px', 
    outline: 'none', 
    boxSizing: 'border-box' 
  };
  const labelStyle: React.CSSProperties = { 
    display: 'block', 
    fontSize: '11px', 
    marginBottom: '7px', 
    fontWeight: 700, 
    color: '#1C1C1A', 
    letterSpacing: '0.08em', 
    textTransform: 'uppercase' 
  };

  if (loading) return (
    <div style={{ padding: '80px 20px', textAlign: 'center', color: '#68645C', fontSize: '14px', letterSpacing: '0.05em' }}>
      <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '2px solid rgba(180, 154, 104, 0.3)', borderTopColor: '#B49A68', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '12px' }} />
      <div>Loading atelier piece...</div>
    </div>
  );

  const activeVariant = formData.variants[activeVariantIdx] || formData.variants[0];

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', paddingBottom: '64px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .adm-form-card input::placeholder, .adm-form-card textarea::placeholder {
          color: #9E988D;
        }
        .adm-form-card input:focus, .adm-form-card textarea:focus, .adm-form-card select:focus {
          border-color: #B49A68 !important;
          box-shadow: 0 0 0 2px rgba(180, 154, 104, 0.2);
        }
        .adm-form-card option {
          background-color: #FFFFFF;
          color: #1C1C1A;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />

      {toast && (
        <div style={{ 
          position: 'fixed', 
          top: '24px', 
          right: '24px', 
          zIndex: 9999, 
          padding: '14px 22px', 
          borderRadius: '8px', 
          color: toast.type === 'success' ? '#065F46' : '#991B1B', 
          backgroundColor: toast.type === 'success' ? '#ECFDF5' : '#FEF2F2', 
          border: toast.type === 'success' ? '1px solid #10B981' : '1px solid #EF4444',
          boxShadow: '0 8px 24px rgba(28, 28, 26, 0.12)', 
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{toast.type === 'success' ? '✓' : '⚠'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', borderBottom: '1px solid #DDD6C8', paddingBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B49A68' }}>ATELIER CATALOG CONSOLE</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display, "Playfair Display", Georgia, serif)', fontSize: '28px', color: '#1C1C1A', margin: 0, fontWeight: 700, letterSpacing: '0.04em' }}>
            {id ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => router.push('/admin/products')} 
            type="button" 
            style={{ 
              padding: '10px 20px', 
              border: '1px solid #DDD6C8', 
              background: '#FAF7F0', 
              cursor: 'pointer', 
              borderRadius: '6px', 
              color: '#1C1C1A', 
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              transition: 'all 0.15s ease'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            type="button" 
            disabled={saving} 
            style={{ 
              padding: '10px 24px', 
              backgroundColor: saving ? '#A8A29E' : '#1C1C1A', 
              color: '#FAF8F5', 
              border: 'none', 
              cursor: saving ? 'not-allowed' : 'pointer', 
              borderRadius: '6px', 
              fontWeight: 700, 
              fontSize: '12px',
              letterSpacing: '0.08em',
              boxShadow: '0 4px 14px rgba(28, 28, 26, 0.15)',
              transition: 'all 0.15s ease'
            }}
          >
            {saving ? 'Saving...' : (id ? 'Save Changes' : 'Create Product')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '28px', borderBottom: '1px solid #DDD6C8', marginBottom: '28px' }}>
        {TABS.map((tab, idx) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(idx)} 
            style={{ 
              padding: '12px 0', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === idx ? '2px solid #B49A68' : '2px solid transparent', 
              color: activeTab === idx ? '#1C1C1A' : '#78716C', 
              fontWeight: activeTab === idx ? 700 : 500, 
              cursor: 'pointer', 
              fontSize: '13px', 
              letterSpacing: '0.04em', 
              marginBottom: '-1px', 
              transition: 'all 0.15s ease' 
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="adm-form-card" style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(28, 28, 26, 0.04)', border: '1px solid #DDD6C8' }}>

        {/* ── BASIC INFO ─────────────────────────────────────────── */}
        {activeTab === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div>
              <label style={labelStyle}>PRODUCT NAME *</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} placeholder="e.g. Royal Handwoven Zari Anarkali" />
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <label style={labelStyle}>SLUG</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="Auto-generated if empty" style={inputStyle} />
              </div>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <label style={labelStyle}>BRAND NAME <span style={{ color: '#B49A68' }}>*</span></label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  onBlur={e => handleBrandBlur(e.target.value)}
                  placeholder="e.g. Zara, Sabyasachi, Fabindia"
                  style={inputStyle}
                />
                <p style={{ fontSize: '11px', color: '#68645C', margin: '6px 0 0' }}>
                  First 3 letters determine the SKU prefix — e.g. <strong style={{ color: '#8A704C' }}>ZAR</strong>-TOP001-RED-M
                </p>
              </div>
            </div>

            <div>
              <label style={labelStyle}>SHORT DESCRIPTION</label>
              <textarea value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Brief luxury summary for previews..." />
            </div>
            <div>
              <label style={labelStyle}>FULL DESCRIPTION</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={5} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Detailed garment craftsmanship, silhouettes, embellishment and heritage..." />
            </div>
            <div>
              <label style={labelStyle}>FABRIC / MATERIAL</label>
              <input type="text" value={formData.fabric} onChange={e => setFormData({ ...formData, fabric: e.target.value })} placeholder="e.g. 100% Pure Mulberry Raw Silk, Handcrafted Zardozi" style={inputStyle} />
            </div>
          </div>
        )}

        {/* ── ORGANIZATION ───────────────────────────────────────── */}
        {activeTab === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
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
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#68645C', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.05em' }}>QUICK SELECT:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {subCats.map(c => {
                        const isSelected = formData.subcategory === c.slug || formData.subcategory === c.name;
                        return (
                          <button key={c.slug} type="button" onClick={() => setFormData({ ...formData, subcategory: c.slug })}
                            style={{ 
                              padding: '6px 14px', 
                              borderRadius: '20px', 
                              fontSize: '11px', 
                              border: isSelected ? '1px solid #1C1C1A' : '1px solid #DDD6C8', 
                              backgroundColor: isSelected ? '#1C1C1A' : '#FAF7F0', 
                              color: isSelected ? '#FAF8F5' : '#1C1C1A', 
                              cursor: 'pointer', 
                              fontWeight: isSelected ? 700 : 500, 
                              transition: 'all 0.15s ease' 
                            }}>
                            {c.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {formData.category && subCats.length === 0 && (
                  <p style={{ fontSize: '11px', color: '#68645C', marginTop: '6px' }}>No subcategories registered for this category.</p>
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
              <p style={{ fontSize: '11px', color: '#68645C', marginTop: '6px' }}>Hold Ctrl/Cmd to select multiple collections.</p>
            </div>
          </div>
        )}

        {/* ── PRICING & SEO ──────────────────────────────────────── */}
        {activeTab === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>SELLING PRICE (₹) *</label>
                <input required type="number" min="1" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} style={inputStyle} />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={labelStyle}>ORIGINAL MRP (₹)</label>
                <input type="number" value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })} style={inputStyle} />
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #DDD6C8' }} />
            <div>
              <label style={labelStyle}>SEO TITLE</label>
              <input type="text" value={formData.seoTitle} onChange={e => setFormData({ ...formData, seoTitle: e.target.value })} style={inputStyle} placeholder="Browser tab and search engine title" />
            </div>
            <div>
              <label style={labelStyle}>SEO DESCRIPTION</label>
              <textarea value={formData.seoDescription} onChange={e => setFormData({ ...formData, seoDescription: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Search snippet description..." />
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #DDD6C8' }} />
            <div>
              <label style={labelStyle}>PRODUCT STATUS</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={inputStyle}>
                <option value="DRAFT">DRAFT (Hidden from storefront)</option>
                <option value="ACTIVE">ACTIVE (Published in catalog)</option>
                <option value="ARCHIVED">ARCHIVED (Discontinued)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
              {[['isFeatured', 'Featured in Atelier Showcase'], ['isNewArrival', 'New Arrival Drop'], ['isBestseller', 'Bestseller Haute Couture']].map(([field, label]) => (
                <label key={field} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1C1C1A' }}>
                  <input type="checkbox" checked={formData[field]} onChange={e => setFormData({ ...formData, [field]: e.target.checked })} style={{ accentColor: '#1C1C1A', width: '16px', height: '16px', cursor: 'pointer' }} /> {label}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ── VARIANTS & STOCK ──────────────────────────────────── */}
        {activeTab === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Parent SKU banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', backgroundColor: '#FAF7F0', borderRadius: '8px', border: '1px solid #DDD6C8' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#8A704C', letterSpacing: '0.08em' }}>PARENT SKU</span>
              {formData.parentSku
                ? <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#1C1C1A', background: '#EAE4D8', border: '1px solid #DDD6C8', padding: '4px 10px', borderRadius: '4px' }}>{formData.parentSku.toUpperCase()}</span>
                : <span style={{ fontSize: '12px', color: '#68645C' }}>Informational code — driven by brand and color combinations.</span>
              }
            </div>

            {/* Color variant tab bar */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#8A704C', letterSpacing: '0.08em', marginRight: '4px' }}>COLOR ATELIERS</span>
                {formData.variants.map((v: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'stretch' }}>
                    <button type="button" onClick={() => setActiveVariantIdx(idx)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '7px 16px', 
                        border: activeVariantIdx === idx ? '1px solid #1C1C1A' : '1px solid #DDD6C8', 
                        borderRadius: formData.variants.length > 1 ? '6px 0 0 6px' : '6px', 
                        background: activeVariantIdx === idx ? '#1C1C1A' : '#FAF7F0', 
                        color: activeVariantIdx === idx ? '#FAF8F5' : '#1C1C1A', 
                        cursor: 'pointer', 
                        fontSize: '12px', 
                        fontWeight: 600, 
                        transition: 'all 0.15s ease' 
                      }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: v.colorHex, border: '1px solid #DDD6C8', display: 'inline-block', flexShrink: 0 }} />
                      {v.colorName || `Color ${idx + 1}`}
                      {v.sizes.length > 0 && <span style={{ opacity: 0.7, fontWeight: 400 }}>({v.sizes.length})</span>}
                    </button>
                    {formData.variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(idx)} title="Remove color"
                        style={{ padding: '0 10px', border: activeVariantIdx === idx ? '1px solid #1C1C1A' : '1px solid #DDD6C8', borderLeft: 'none', borderRadius: '0 6px 6px 0', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addVariant}
                  style={{ padding: '7px 16px', border: '1px dashed #B49A68', borderRadius: '6px', background: 'transparent', color: '#8A704C', cursor: 'pointer', fontSize: '12px', fontWeight: 600, transition: 'all 0.15s ease' }}>
                  + Add Color
                </button>
              </div>

              {/* Active variant editor */}
              <div style={{ padding: '24px', backgroundColor: '#FAF7F0', borderRadius: '10px', border: '1px solid #DDD6C8' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '22px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={labelStyle}>COLOR NAME</label>
                    <input type="text" value={activeVariant.colorName} onChange={e => updateVariantField(activeVariantIdx, 'colorName', e.target.value)} placeholder="e.g. Midnight Blue, Champagne Ivory" style={inputStyle} />
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={labelStyle}>COLOR SWATCH</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="color" value={activeVariant.colorHex} onChange={e => updateVariantField(activeVariantIdx, 'colorHex', e.target.value)}
                        style={{ width: '44px', height: '44px', padding: '2px', border: '1px solid #DDD6C8', borderRadius: '6px', cursor: 'pointer', flexShrink: 0, backgroundColor: '#FFFFFF' }} />
                      <input type="text" value={activeVariant.colorHex} onChange={e => updateVariantField(activeVariantIdx, 'colorHex', e.target.value)}
                        style={{ ...inputStyle, fontFamily: 'monospace' }} />
                    </div>
                  </div>
                </div>

                <label style={labelStyle}>SELECT SIZES</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '22px' }}>
                  {SIZES.map(s => {
                    const isActive = activeVariant.sizes.some((sz: any) => sz.size === s);
                    return (
                      <button key={s} type="button" onClick={() => handleSizeToggle(s, activeVariantIdx)}
                        style={{ 
                          padding: '8px 18px', 
                          borderRadius: '6px', 
                          border: isActive ? '1px solid #1C1C1A' : '1px solid #DDD6C8', 
                          background: isActive ? '#1C1C1A' : '#FFFFFF', 
                          color: isActive ? '#FAF8F5' : '#1C1C1A', 
                          cursor: 'pointer', 
                          fontWeight: 700, 
                          fontSize: '12px', 
                          transition: 'all 0.15s ease' 
                        }}>
                        {s}
                      </button>
                    );
                  })}
                </div>

                {activeVariant.sizes.length > 0 ? (
                  <div>
                    <label style={{ ...labelStyle, marginBottom: '12px' }}>SKU &amp; STOCK PER SIZE</label>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#FFFFFF', borderRadius: '8px', overflow: 'hidden', border: '1px solid #DDD6C8' }}>
                      <thead>
                        <tr style={{ background: '#FAF7F0', borderBottom: '1px solid #DDD6C8' }}>
                          <th style={{ padding: '12px 14px', fontSize: '11px', color: '#1C1C1A', fontWeight: 700, letterSpacing: '0.08em', textAlign: 'left', width: '70px' }}>SIZE</th>
                          <th style={{ padding: '12px 14px', fontSize: '11px', color: '#1C1C1A', fontWeight: 700, letterSpacing: '0.08em', textAlign: 'left' }}>
                            SKU <span style={{ color: '#68645C', fontWeight: 400, textTransform: 'none' }}>(auto-generated · editable · validated on blur)</span>
                          </th>
                          <th style={{ padding: '12px 14px', fontSize: '11px', color: '#1C1C1A', fontWeight: 700, letterSpacing: '0.08em', textAlign: 'left', width: '110px' }}>STOCK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeVariant.sizes.map((s: any, si: number) => {
                          const errKey = `${activeVariantIdx}-${s.size}`;
                          const skuErr = skuErrors[errKey] || '';
                          return (
                            <tr key={s.size} style={{ borderTop: si > 0 ? '1px solid #EAE4D8' : 'none' }}>
                              <td style={{ padding: '12px 14px' }}>
                                <span style={{ fontWeight: 700, fontSize: '13px', fontFamily: 'monospace', background: '#FAF7F0', color: '#1C1C1A', border: '1px solid #DDD6C8', padding: '4px 10px', borderRadius: '4px' }}>{s.size}</span>
                              </td>
                              <td style={{ padding: '10px 14px' }}>
                                <input
                                  type="text"
                                  value={s.sku || ''}
                                  onChange={e => handleSkuChange(s.size, e.target.value, activeVariantIdx)}
                                  onBlur={e => handleSkuBlur(s.size, e.target.value, activeVariantIdx)}
                                  style={{
                                    ...inputStyle,
                                    backgroundColor: '#FFFFFF',
                                    fontFamily: 'monospace',
                                    fontSize: '12px',
                                    borderColor: skuErr ? '#EF4444' : (s.sku ? '#10B981' : '#DDD6C8'),
                                    outline: 'none',
                                  }}
                                  placeholder="e.g. ZAR-TOP001-RED-M"
                                />
                                {skuErr && (
                                  <p style={{ margin: '5px 0 0', fontSize: '11px', color: '#DC2626' }}>{skuErr}</p>
                                )}
                                {!skuErr && s.sku && (
                                  <p style={{ margin: '5px 0 0', fontSize: '11px', color: '#059669' }}>&#10003; Format &amp; uniqueness verified</p>
                                )}
                              </td>
                              <td style={{ padding: '10px 14px' }}>
                                <input type="number" min="0" value={s.stock} onChange={e => handleStockChange(s.size, Number(e.target.value), activeVariantIdx)}
                                  style={{ ...inputStyle, width: '90px', backgroundColor: '#FFFFFF' }} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#68645C', fontSize: '13px', padding: '16px 0', margin: 0 }}>
                    Select at least one size above to assign SKUs and inventory units.
                  </p>
                )}
              </div>
            </div>

            {/* All-variants summary */}
            {formData.variants.some((v: any) => v.sizes.length > 0) && (
              <div style={{ padding: '18px 22px', backgroundColor: '#FAF7F0', border: '1px solid #DDD6C8', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#1C1C1A', letterSpacing: '0.08em', marginBottom: '12px' }}>ALL VARIANTS SUMMARY</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '8px 10px', fontSize: '11px', color: '#68645C', textAlign: 'left', fontWeight: 700 }}>COLOR</th>
                      <th style={{ padding: '8px 10px', fontSize: '11px', color: '#68645C', textAlign: 'left', fontWeight: 700 }}>SIZES</th>
                      <th style={{ padding: '8px 10px', fontSize: '11px', color: '#68645C', textAlign: 'right', fontWeight: 700 }}>TOTAL UNITS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.variants.filter((v: any) => v.sizes.length > 0).map((v: any, idx: number) => (
                      <tr key={idx} style={{ borderTop: '1px solid #DDD6C8' }}>
                        <td style={{ padding: '10px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: v.colorHex, border: '1px solid #DDD6C8', display: 'inline-block' }} />
                            <span style={{ fontWeight: 600, fontSize: '13px', color: '#1C1C1A' }}>{v.colorName || `Color ${idx + 1}`}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 10px', fontSize: '12px', color: '#68645C' }}>{v.sizes.map((s: any) => s.size).join(', ')}</td>
                        <td style={{ padding: '10px 10px', fontSize: '13px', fontWeight: 700, textAlign: 'right', color: '#1C1C1A' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {formData.variants.map((v: any, idx: number) => (
                <button key={idx} type="button" onClick={() => setActiveVariantIdx(idx)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '7px 16px', 
                    border: activeVariantIdx === idx ? '1px solid #1C1C1A' : '1px solid #DDD6C8', 
                    borderRadius: '6px', 
                    background: activeVariantIdx === idx ? '#1C1C1A' : '#FAF7F0', 
                    color: activeVariantIdx === idx ? '#FAF8F5' : '#1C1C1A', 
                    cursor: 'pointer', 
                    fontSize: '12px', 
                    fontWeight: 600 
                  }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: v.colorHex, border: '1px solid #DDD6C8', display: 'inline-block' }} />
                  {v.colorName || `Color ${idx + 1}`}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: '#68645C', margin: 0 }}>
              Managing haute imagery for <strong style={{ color: '#1C1C1A' }}>{activeVariant.colorName || `Color ${activeVariantIdx + 1}`}</strong>. Drag to reorder — first position is editorial cover.
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
