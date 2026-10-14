'use client';

import React, { useEffect, useState } from 'react';
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Plus,
  Minus,
  Save,
  ArrowUpDown,
  Filter,
  Check
} from 'lucide-react';

interface InventoryItem {
  productId: string;
  productName: string;
  productSlug: string;
  category: string;
  variantId: string;
  colorName: string;
  colorHex: string;
  image: string;
  size: string;
  sku: string;
  stock: number;
  price: number;
  status: string;
  isLow: boolean;
  isOos: boolean;
}

export default function SellerInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'oos'>('all');
  const [editedStock, setEditedStock] = useState<{ [key: string]: number }>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/seller/inventory?q=${encodeURIComponent(search)}&filter=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStockChange = (key: string, value: number) => {
    setEditedStock((prev) => ({
      ...prev,
      [key]: Math.max(0, value),
    }));
  };

  const saveStock = async (item: InventoryItem) => {
    const key = `${item.productId}-${item.variantId}-${item.size}`;
    const newQty = editedStock[key] !== undefined ? editedStock[key] : item.stock;

    setSavingKey(key);
    try {
      const res = await fetch('/api/seller/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: item.productId,
          variantId: item.variantId,
          size: item.size,
          newStock: newQty,
          reason: 'Quick update from Seller Inventory Hub',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update stock');

      // Update local state
      setItems((prev) =>
        prev.map((it) => {
          if (it.productId === item.productId && it.variantId === item.variantId && it.size === item.size) {
            return {
              ...it,
              stock: newQty,
              isLow: newQty > 0 && newQty <= 5,
              isOos: newQty === 0,
            };
          }
          return it;
        })
      );

      // Remove from edited state
      setEditedStock((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });

      showToast(`Updated stock for ${item.sku} to ${newQty}`);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 9999,
            background: toast.type === 'success' ? '#1C1C1A' : '#9E2A2B',
            color: '#FAF8F5',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 600, margin: '0 0 6px', letterSpacing: '-0.02em', color: '#1C1C1A' }}>
            Inventory & Stock Manager
          </h1>
          <p style={{ color: '#68645C', fontSize: '14px', margin: 0 }}>
            Quickly monitor stock levels across size variants and adjust inventory in real time.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            padding: '9px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#1C1C1A',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <RefreshCw size={14} /> Refresh Stock
        </button>
      </div>

      {/* Search and Filters */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8E2D6',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#68645C" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchInventory()}
            placeholder="Search by product title or SKU..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: '#1C1C1A',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              background: filter === 'all' ? '#1C1C1A' : 'transparent',
              color: filter === 'all' ? '#FAF8F5' : '#68645C',
              border: filter === 'all' ? 'none' : '1px solid #E8E2D6',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            All SKUs
          </button>
          <button
            onClick={() => setFilter('low')}
            style={{
              background: filter === 'low' ? '#E65100' : 'transparent',
              color: filter === 'low' ? '#FFFFFF' : '#68645C',
              border: filter === 'low' ? 'none' : '1px solid #E8E2D6',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Low Stock (&le; 5)
          </button>
          <button
            onClick={() => setFilter('oos')}
            style={{
              background: filter === 'oos' ? '#C62828' : 'transparent',
              color: filter === 'oos' ? '#FFFFFF' : '#68645C',
              border: filter === 'oos' ? 'none' : '1px solid #E8E2D6',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8E2D6',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
        }}
      >
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#68645C' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid #E8E2D6',
                borderTopColor: '#1C1C1A',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px',
              }}
            />
            Loading SKU inventory...
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#68645C' }}>
            <Boxes size={40} color="#B49A68" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1C1C1A' }}>No inventory items found</div>
            <p style={{ fontSize: '13px', margin: '4px 0 0' }}>Try adjusting your search or stock filter.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr
                style={{
                  background: '#F8F6F0',
                  borderBottom: '1px solid #E8E2D6',
                  color: '#68645C',
                  textTransform: 'uppercase',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                }}
              >
                <th style={{ padding: '14px 20px' }}>Item & SKU</th>
                <th style={{ padding: '14px 20px' }}>Variant</th>
                <th style={{ padding: '14px 20px' }}>Size</th>
                <th style={{ padding: '14px 20px' }}>Price</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', width: '220px' }}>Available Quantity</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const key = `${item.productId}-${item.variantId}-${item.size}`;
                const currentVal = editedStock[key] !== undefined ? editedStock[key] : item.stock;
                const isDirty = editedStock[key] !== undefined && editedStock[key] !== item.stock;
                const isSaving = savingKey === key;

                return (
                  <tr
                    key={key}
                    style={{
                      borderBottom: '1px solid #F0ECE4',
                      background: isDirty ? '#FFFDF8' : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 600, color: '#1C1C1A', fontSize: '14px' }}>{item.productName}</div>
                      <div style={{ fontSize: '12px', color: '#68645C', fontFamily: 'monospace', marginTop: '2px' }}>
                        {item.sku}
                      </div>
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: item.colorHex || '#1C1C1A',
                            border: '1px solid #DDD',
                          }}
                        />
                        <span>{item.colorName}</span>
                      </div>
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          background: '#F0ECE4',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          fontSize: '12px',
                        }}
                      >
                        {item.size}
                      </span>
                    </td>

                    <td style={{ padding: '14px 20px', fontWeight: 600 }}>₹{item.price.toLocaleString('en-IN')}</td>

                    <td style={{ padding: '14px 20px' }}>
                      {item.isOos ? (
                        <span
                          style={{
                            background: '#FDECEA',
                            color: '#C62828',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          Out of Stock
                        </span>
                      ) : item.isLow ? (
                        <span
                          style={{
                            background: '#FFF3E0',
                            color: '#E65100',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          Low Stock
                        </span>
                      ) : (
                        <span
                          style={{
                            background: '#E8F5E9',
                            color: '#2E7D32',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          In Stock
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleStockChange(key, currentVal - 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #DDD6C8',
                            background: '#FAF8F5',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Minus size={12} />
                        </button>

                        <input
                          type="number"
                          min={0}
                          value={currentVal}
                          onChange={(e) => handleStockChange(key, parseInt(e.target.value) || 0)}
                          style={{
                            width: '64px',
                            padding: '4px 8px',
                            textAlign: 'center',
                            border: isDirty ? '2px solid #B49A68' : '1px solid #DDD6C8',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 600,
                            outline: 'none',
                          }}
                        />

                        <button
                          onClick={() => handleStockChange(key, currentVal + 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #DDD6C8',
                            background: '#FAF8F5',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </td>

                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      {isDirty && (
                        <button
                          disabled={isSaving}
                          onClick={() => saveStock(item)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#1C1C1A',
                            color: '#FAF8F5',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          }}
                        >
                          <Save size={13} /> {isSaving ? 'Saving...' : 'Save'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
