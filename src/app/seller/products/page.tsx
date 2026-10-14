'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Plus,
  ExternalLink,
  Edit,
  Trash2,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice: number;
  image: string;
  totalStock: number;
  totalVariants: number;
  isActive: boolean;
  status: string;
  updatedAt: string;
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/seller/products?q=${encodeURIComponent(search)}&status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleStatus = async (product: ProductItem) => {
    const newStatus = !product.isActive;
    try {
      const res = await fetch('/api/seller/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          isActive: newStatus,
          status: newStatus ? 'ACTIVE' : 'DRAFT',
        }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, isActive: newStatus, status: newStatus ? 'ACTIVE' : 'DRAFT' } : p
        )
      );

      showToast(`${product.name} is now ${newStatus ? 'Active' : 'Draft / Paused'}`);
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Toast Alert */}
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
            Products & Listings Catalog
          </h1>
          <p style={{ color: '#68645C', fontSize: '14px', margin: 0 }}>
            Manage published styles, monitor visibility on storefront, and configure catalog listings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchProducts}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFFFFF',
              border: '1px solid #E8E2D6',
              padding: '9px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <Link
            href="/admin/products"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1C1C1A',
              color: '#FAF8F5',
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <Plus size={15} /> Add New Product
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            placeholder="Search products by title or category..."
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
          {[
            { id: 'all', label: 'All Listings' },
            { id: 'ACTIVE', label: 'Active on Store' },
            { id: 'DRAFT', label: 'Drafts / Paused' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              style={{
                background: statusFilter === st.id ? '#1C1C1A' : 'transparent',
                color: statusFilter === st.id ? '#FAF8F5' : '#68645C',
                border: statusFilter === st.id ? 'none' : '1px solid #E8E2D6',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
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
            Loading catalog products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#68645C' }}>
            <ShoppingBag size={40} color="#B49A68" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1C1C1A' }}>No products listed</div>
            <p style={{ fontSize: '13px', margin: '4px 0 0' }}>Get started by listing your first product style.</p>
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
                <th style={{ padding: '14px 20px' }}>Product</th>
                <th style={{ padding: '14px 20px' }}>Category</th>
                <th style={{ padding: '14px 20px' }}>Price</th>
                <th style={{ padding: '14px 20px' }}>Total Stock</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr
                  key={prod._id}
                  style={{
                    borderBottom: '1px solid #F0ECE4',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '52px',
                          borderRadius: '6px',
                          background: '#F0ECE4',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        {prod.image ? (
                          <img src={prod.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '10px' }}>
                            No Img
                          </div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1C1C1A', fontSize: '14px' }}>{prod.name}</div>
                        <div style={{ fontSize: '12px', color: '#68645C', marginTop: '2px' }}>
                          Slug: /{prod.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <span
                      style={{
                        background: '#F0ECE4',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        textTransform: 'capitalize',
                      }}
                    >
                      {prod.category}
                    </span>
                  </td>

                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                    ₹{prod.price.toLocaleString('en-IN')}
                    {prod.originalPrice > prod.price && (
                      <span style={{ fontSize: '11px', color: '#999', textDecoration: 'line-through', marginLeft: '6px' }}>
                        ₹{prod.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 600, color: prod.totalStock <= 5 ? '#E65100' : '#1C1C1A' }}>
                      {prod.totalStock} units
                    </div>
                    <div style={{ fontSize: '11px', color: '#68645C' }}>
                      {prod.totalVariants} variants
                    </div>
                  </td>

                  <td style={{ padding: '14px 20px' }}>
                    <button
                      onClick={() => toggleStatus(prod)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: prod.isActive ? '#E8F5E9' : '#ECEFF1',
                        color: prod.isActive ? '#2E7D32' : '#455A64',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {prod.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      {prod.isActive ? 'Active' : 'Draft / Paused'}
                    </button>
                  </td>

                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <Link
                      href={`/products`}
                      target="_blank"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#68645C',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: 500,
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #E8E2D6',
                        background: '#FAF8F5',
                      }}
                    >
                      <span>Preview</span>
                      <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
