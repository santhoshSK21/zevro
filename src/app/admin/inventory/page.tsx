'use client';

import React, { useEffect, useState } from 'react';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [adjusting, setAdjusting] = useState<{ productId: string, variantId: string, size: string, name: string, currentStock: number } | null>(null);
  const [adjustForm, setAdjustForm] = useState({ quantityChange: 0, type: 'STOCK_ADJUSTMENT', reason: '' });
  const [saving, setSaving] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/inventory${search ? `?q=${search}` : ''}`);
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [search]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjusting || adjustForm.quantityChange === 0) return;
    
    if (adjusting.currentStock + adjustForm.quantityChange < 0) {
      showToast('Resulting stock cannot be negative', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: adjusting.productId,
          variantId: adjusting.variantId,
          size: adjusting.size,
          ...adjustForm
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      showToast('Stock adjusted successfully', 'success');
      setAdjusting(null);
      setAdjustForm({ quantityChange: 0, type: 'STOCK_ADJUSTMENT', reason: '' });
      fetchInventory();
    } catch (err: any) {
      showToast(err.message || 'Failed to adjust stock', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Flatten the products -> variants -> sizes for a table view
  const rows: any[] = [];
  products.forEach(p => {
    p.variants?.forEach((v: any) => {
      v.sizes?.forEach((s: any) => {
        rows.push({
          productId: p._id,
          variantId: v._id,
          name: p.name,
          image: v.images?.[0] || p.images?.[0] || '',
          color: v.colorName || v.color,
          size: s.size,
          sku: s.sku || 'N/A',
          stock: s.stock
        });
      });
    });
  });

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '16px 24px', borderRadius: '4px', color: '#fff', backgroundColor: toast.type === 'success' ? 'var(--success)' : 'var(--error)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>INVENTORY</h1>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px 16px', border: '1px solid #E9ECEF', borderRadius: '4px', outline: 'none', width: '250px' }} 
        />
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E9ECEF', textAlign: 'left', backgroundColor: '#F8F9FA' }}>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Product</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>SKU</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Color</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Size</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Current Stock</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center' }}>Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#6C757D' }}>No inventory found.</td></tr>
            ) : rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #E9ECEF' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={r.image || ''} alt={r.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', background: 'var(--color-surface)' }} />
                    <span style={{ fontWeight: 500, color: 'var(--espresso)' }}>{r.name}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>{r.sku}</td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>{r.color}</td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>{r.size}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                    backgroundColor: r.stock > 5 ? '#E8F5E9' : (r.stock > 0 ? '#FFF3E0' : '#FDECEA'),
                    color: r.stock > 5 ? 'var(--success)' : (r.stock > 0 ? 'var(--warning)' : 'var(--error)')
                  }}>
                    {r.stock}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <button onClick={() => setAdjusting({ productId: r.productId, variantId: r.variantId, size: r.size, name: r.name, currentStock: r.stock })} style={{ background: 'none', border: '1px solid #E9ECEF', padding: '6px 12px', borderRadius: '4px', color: 'var(--espresso)', cursor: 'pointer', fontSize: '12px' }}>Adjust Stock</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {adjusting && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleAdjustSubmit} style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', width: '400px' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--espresso)', marginBottom: '8px' }}>Adjust Inventory</h3>
            <p style={{ color: '#6C757D', marginBottom: '24px', fontSize: '14px' }}>{adjusting.name} (Size: {adjusting.size})</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F8F9FA', borderRadius: '4px' }}>
                <span style={{ color: '#6C757D', fontSize: '14px' }}>Current Stock</span>
                <span style={{ fontWeight: 600, fontSize: '16px' }}>{adjusting.currentStock}</span>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>TRANSACTION TYPE</label>
                <select value={adjustForm.type} onChange={e => setAdjustForm({...adjustForm, type: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid var(--linen)', borderRadius: '4px' }}>
                  <option value="STOCK_RECEIVED">Stock Received (Add)</option>
                  <option value="STOCK_ADJUSTMENT">Manual Adjustment</option>
                  <option value="STOCK_DAMAGED">Damaged (Remove)</option>
                  <option value="STOCK_RETURNED">Returned (Add)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>QUANTITY CHANGE (Use - for decrease)</label>
                <input required type="number" value={adjustForm.quantityChange} onChange={e => setAdjustForm({...adjustForm, quantityChange: Number(e.target.value)})} style={{ width: '100%', padding: '10px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>REASON (Optional)</label>
                <input type="text" value={adjustForm.reason} onChange={e => setAdjustForm({...adjustForm, reason: e.target.value})} placeholder="e.g. Found in warehouse" style={{ width: '100%', padding: '10px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#E8F5E9', borderRadius: '4px', marginTop: '8px' }}>
                <span style={{ color: 'var(--success)', fontSize: '14px', fontWeight: 500 }}>New Stock Will Be</span>
                <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--success)' }}>{adjusting.currentStock + adjustForm.quantityChange}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <button type="button" onClick={() => setAdjusting(null)} style={{ flex: 1, padding: '12px', border: '1px solid var(--linen)', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={saving || adjustForm.quantityChange === 0 || (adjusting.currentStock + adjustForm.quantityChange < 0)} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--espresso)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                {saving ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
