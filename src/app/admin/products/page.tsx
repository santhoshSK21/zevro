'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckSquare, 
  Square, 
  AlertTriangle,
  X
} from 'lucide-react';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string[] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  // Debounce search input to avoid re-fetching on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page when filter criteria change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, categoryFilter]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        admin: 'true',
        paginate: 'true',
        page: page.toString(),
        limit: '20'
      });
      if (debouncedSearch) query.append('q', debouncedSearch);
      if (statusFilter) query.append('status', statusFilter);
      if (categoryFilter) query.append('category', categoryFilter);

      const res = await fetch(`/api/products?${query.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
    } catch (e) {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    setSelectedIds([]);
  }, [fetchProducts]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Select all / Deselect all on current page
  const handleSelectAll = () => {
    if (selectedIds.length === products.length && products.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p._id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExecuteDelete = async () => {
    if (!confirmDelete || confirmDelete.length === 0) return;
    setIsDeleting(true);

    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: confirmDelete })
      });

      if (res.ok) {
        showToast(`Successfully deleted ${confirmDelete.length} product(s)`, 'success');
        setSelectedIds(prev => prev.filter(id => !confirmDelete.includes(id)));
        setConfirmDelete(null);
        fetchProducts();
      } else {
        throw new Error();
      }
    } catch (e) {
      showToast('Failed to delete selected product(s)', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStockSummary = () => {
    let totalUnits = 0;
    let inStockCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach(p => {
      let productUnits = 0;
      if (p.variants && Array.isArray(p.variants)) {
        p.variants.forEach((v: any) => {
          if (v.sizes && Array.isArray(v.sizes)) {
            v.sizes.forEach((s: any) => {
              productUnits += Number(s.stock) || 0;
            });
          }
        });
      }
      totalUnits += productUnits;
      if (productUnits === 0) {
        outOfStockCount++;
      } else if (productUnits <= 10) {
        lowStockCount++;
      } else {
        inStockCount++;
      }
    });

    return { totalUnits, inStockCount, lowStockCount, outOfStockCount };
  };

  const getProductStock = (product: any) => {
    const sizeDetails: { size: string; stock: number }[] = [];
    let total = 0;
    if (product.variants && Array.isArray(product.variants)) {
      product.variants.forEach((v: any) => {
        if (v.sizes && Array.isArray(v.sizes)) {
          v.sizes.forEach((s: any) => {
            const count = Number(s.stock) || 0;
            total += count;
            sizeDetails.push({ size: s.size, stock: count });
          });
        }
      });
    }
    return { total, sizeDetails };
  };

  const stockSummary = getStockSummary();
  const isAllSelected = products.length > 0 && selectedIds.length === products.length;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: 'var(--font-body, sans-serif)' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .adm-prod-input::placeholder {
          color: #78716C;
        }
        .adm-prod-input:focus, .adm-prod-select:focus {
          border-color: #B49A68 !important;
          box-shadow: 0 0 0 2px rgba(180, 154, 104, 0.2);
        }
        .adm-prod-select option {
          background-color: #FFFFFF;
          color: #1C1C1A;
        }
      `}} />

      {/* Toast Notification */}
      {toast && (
        <div style={{ 
          position: 'fixed', 
          top: '24px', 
          right: '24px', 
          zIndex: 9999, 
          padding: '14px 22px', 
          borderRadius: '8px', 
          color: '#FAF8F5', 
          backgroundColor: toast.type === 'success' ? '#142E1F' : '#3B1717', 
          border: toast.type === 'success' ? '1px solid #10B981' : '1px solid #EF4444',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)', 
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

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #DDD6C8', paddingBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B49A68' }}>ATELIER INVENTORY CONSOLE</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '28px', color: '#1C1C1A', margin: '0 0 6px 0', fontWeight: 700, letterSpacing: '0.04em' }}>
            PRODUCT CATALOG & INVENTORY
          </h1>
          <p style={{ fontSize: '13px', color: '#68645C', margin: 0 }}>
            Manage haute couture garment listings, SKU variants, real-time inventory levels, and pricing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setConfirmDelete(selectedIds)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: '#DC2626', color: '#FAF8F5', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)' }}
            >
              <Trash2 size={14} />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          <Link 
            href="/admin/products/form" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 22px', 
              backgroundColor: '#1C1C1A', 
              color: '#FAF8F5', 
              border: '1px solid #B49A68', 
              borderRadius: '6px', 
              fontSize: '12px', 
              fontWeight: 700, 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase', 
              textDecoration: 'none', 
              boxShadow: '0 2px 10px rgba(28, 28, 26, 0.15)',
              transition: 'all 0.2s ease' 
            }}
          >
            <Plus size={15} color="#C5A880" /> Add Product
          </Link>
        </div>
      </div>

      {/* Inventory KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px 22px', borderRadius: '10px', border: '1px solid #DDD6C8', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#68645C', textTransform: 'uppercase' }}>Total Garments</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#1C1C1A', marginTop: '6px', fontFamily: 'var(--font-display, serif)' }}>{products.length}</div>
          <div style={{ fontSize: '12px', color: '#78716C', marginTop: '4px' }}>In current catalog view</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '20px 22px', borderRadius: '10px', border: '1px solid #DDD6C8', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#68645C', textTransform: 'uppercase' }}>Available Stock Units</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#1C1C1A', marginTop: '6px', fontFamily: 'var(--font-display, serif)' }}>{stockSummary.totalUnits} <span style={{ fontSize: '14px', fontWeight: 500, color: '#78716C' }}>units</span></div>
          <div style={{ fontSize: '12px', color: '#16A34A', marginTop: '4px', fontWeight: 600 }}>Ready for fulfillment</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '20px 22px', borderRadius: '10px', border: '1px solid #DDD6C8', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#68645C', textTransform: 'uppercase' }}>In Stock</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#16A34A', marginTop: '6px', fontFamily: 'var(--font-display, serif)' }}>{stockSummary.inStockCount}</div>
          <div style={{ fontSize: '12px', color: '#78716C', marginTop: '4px' }}>Healthy inventory (&gt;10 units)</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '20px 22px', borderRadius: '10px', border: '1px solid #DDD6C8', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#68645C', textTransform: 'uppercase' }}>Low / Out of Stock</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '26px', fontWeight: 700, color: '#D97706', fontFamily: 'var(--font-display, serif)' }}>{stockSummary.lowStockCount}</span>
            <span style={{ fontSize: '12px', color: '#78716C' }}>low</span>
            <span style={{ fontSize: '26px', fontWeight: 700, color: '#DC2626', marginLeft: '8px', fontFamily: 'var(--font-display, serif)' }}>{stockSummary.outOfStockCount}</span>
            <span style={{ fontSize: '12px', color: '#78716C' }}>out</span>
          </div>
          <div style={{ fontSize: '12px', color: '#D97706', marginTop: '4px' }}>Requires restock attention</div>
        </div>
      </div>

      {/* Bulk Selection Notice Bar */}
      {selectedIds.length > 0 && (
        <div style={{ backgroundColor: '#FFFFFF', color: '#1C1C1A', padding: '14px 22px', borderRadius: '8px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', border: '1px solid #B49A68', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ backgroundColor: '#B49A68', color: '#FAF8F5', padding: '3px 10px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
              {selectedIds.length} SELECTED
            </span>
            <span>You have selected {selectedIds.length} garment(s) on this page.</span>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button 
              onClick={() => setSelectedIds([])}
              style={{ background: 'transparent', border: 'none', color: '#68645C', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear Selection
            </button>
            <button
              onClick={() => setConfirmDelete(selectedIds)}
              style={{ backgroundColor: '#DC2626', color: '#FFF', border: 'none', padding: '7px 16px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Trash2 size={13} /> Delete All Selected
            </button>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '22px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input 
            type="text" 
            placeholder="Search by garment title or slug..." 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="adm-prod-input"
            style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1px solid #DDD6C8', borderRadius: '6px', backgroundColor: '#FFFFFF', color: '#1C1C1A', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
          />
          <Search size={16} color="#78716C" style={{ position: 'absolute', left: '14px', top: '13px' }} />
        </div>

        <select 
          value={statusFilter} 
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="adm-prod-select"
          style={{ padding: '11px 16px', border: '1px solid #DDD6C8', borderRadius: '6px', backgroundColor: '#FFFFFF', color: '#1C1C1A', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active (Published)</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        <select 
          value={categoryFilter} 
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="adm-prod-select"
          style={{ padding: '11px 16px', border: '1px solid #DDD6C8', borderRadius: '6px', backgroundColor: '#FFFFFF', color: '#1C1C1A', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
        >
          <option value="">All Categories</option>
          {Array.isArray(categories) && categories.map(c => (
            <option key={c._id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #DDD6C8', overflowX: 'auto', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #DDD6C8', backgroundColor: '#FAF7F0' }}>
              <th style={{ padding: '14px 16px', width: '48px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#1C1C1A' }}
                  title="Select / Deselect all on this page"
                />
              </th>
              <th style={{ padding: '14px 16px', color: '#68645C', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', width: '60px' }}>Image</th>
              <th style={{ padding: '14px 16px', color: '#68645C', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Garment Details</th>
              <th style={{ padding: '14px 16px', color: '#68645C', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Category</th>
              <th style={{ padding: '14px 16px', color: '#68645C', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Available Stock</th>
              <th style={{ padding: '14px 16px', color: '#68645C', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Price</th>
              <th style={{ padding: '14px 16px', color: '#68645C', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '14px 16px', color: '#68645C', fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: '#68645C' }}>Loading garments...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: '#68645C' }}>No garments found matching current filters.</td></tr>
            ) : products.map(product => {
              const isSelected = selectedIds.includes(product._id);
              const { total: stockTotal, sizeDetails } = getProductStock(product);
              
              const isOutOfStock = stockTotal === 0;
              const isLowStock = stockTotal > 0 && stockTotal <= 10;
              
              return (
                <tr 
                  key={product._id} 
                  style={{ 
                    borderBottom: '1px solid #EAE4D8',
                    backgroundColor: isSelected ? 'rgba(180, 154, 104, 0.08)' : 'transparent',
                    transition: 'background-color 0.15s'
                  }}
                >
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(product._id)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#1C1C1A' }}
                    />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {(product.variants?.[0]?.images?.[0] || product.images?.[0] || product.image) ? (
                      <img 
                        src={product.variants?.[0]?.images?.[0] || product.images?.[0] || product.image} 
                        alt={product.name} 
                        style={{ width: '44px', height: '54px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#FAF7F0', border: '1px solid #DDD6C8' }} 
                      />
                    ) : (
                      <div style={{ width: '44px', height: '54px', borderRadius: '4px', backgroundColor: '#FAF7F0', border: '1px solid #DDD6C8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 600, color: '#78716C', textTransform: 'uppercase' }}>
                        No Img
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#1C1C1A', fontSize: '13px' }}>{product.name}</div>
                    <div style={{ fontSize: '11px', color: '#78716C', marginTop: '3px' }}>{product.slug}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#68645C' }}>
                    <span style={{ textTransform: 'capitalize' }}>
                      {product.category?.replace(/-/g, ' ') || 'General'}
                    </span>
                    {product.subcategory && (
                      <span style={{ display: 'block', fontSize: '11px', color: '#78716C', textTransform: 'capitalize' }}>
                        {product.subcategory.replace(/-/g, ' ')}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: isOutOfStock ? '#DC2626' : (isLowStock ? '#D97706' : '#1C1C1A') }}>
                        {stockTotal} units
                      </span>
                      <span style={{ 
                        fontSize: '10px', 
                        padding: '2px 8px', 
                        borderRadius: '10px', 
                        fontWeight: 700, 
                        letterSpacing: '0.04em',
                        backgroundColor: isOutOfStock ? '#FEE2E2' : (isLowStock ? '#FEF3C7' : '#DCFCE7'), 
                        color: isOutOfStock ? '#DC2626' : (isLowStock ? '#B45309' : '#16A34A'),
                        border: isOutOfStock ? '1px solid #FCA5A5' : (isLowStock ? '1px solid #FCD34D' : '1px solid #86EFAC')
                      }}>
                        {isOutOfStock ? 'OUT OF STOCK' : (isLowStock ? 'LOW STOCK' : 'IN STOCK')}
                      </span>
                    </div>
                    {sizeDetails.length > 0 && (
                      <div style={{ fontSize: '11px', color: '#78716C', marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {sizeDetails.map((sz, idx) => (
                          <span key={idx} style={{ backgroundColor: '#FAF7F0', border: '1px solid #DDD6C8', color: '#1C1C1A', padding: '1px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 600 }}>
                            {sz.size}: {sz.stock}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1C1C1A' }}>₹{((product.price||0)/100).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ 
                      fontSize: '10px', 
                      padding: '3px 8px', 
                      borderRadius: '12px', 
                      fontWeight: 700, 
                      letterSpacing: '0.04em',
                      backgroundColor: product.status === 'ACTIVE' || product.isActive ? '#DCFCE7' : (product.status === 'ARCHIVED' ? '#F5F5F4' : '#FEF3C7'), 
                      color: product.status === 'ACTIVE' || product.isActive ? '#16A34A' : (product.status === 'ARCHIVED' ? '#78716C' : '#D97706'),
                      border: product.status === 'ACTIVE' || product.isActive ? '1px solid #86EFAC' : (product.status === 'ARCHIVED' ? '1px solid #E7E5E4' : '1px solid #FCD34D')
                    }}>
                      {product.status || (product.isActive ? 'ACTIVE' : 'DRAFT')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <button 
                        onClick={() => router.push(`/admin/products/form?id=${product._id}`)} 
                        title="Edit Product"
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#FAF7F0', border: '1px solid #DDD6C8', color: '#1C1C1A', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600, transition: 'all 0.15s ease' }}
                      >
                        <Edit3 size={12} color="#B49A68" /> Edit
                      </button>
                      <button 
                        onClick={() => setConfirmDelete([product._id])} 
                        title="Remove Product"
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600, transition: 'all 0.15s ease' }}
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '28px' }}>
          <button 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
            style={{ padding: '9px 18px', border: '1px solid #DDD6C8', background: page === 1 ? '#FAF7F0' : '#FFFFFF', cursor: page === 1 ? 'not-allowed' : 'pointer', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: page === 1 ? '#A8A29E' : '#1C1C1A' }}
          >Prev</button>
          <span style={{ padding: '8px 16px', color: '#68645C', fontSize: '13px' }}>Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(page + 1)}
            style={{ padding: '9px 18px', border: '1px solid #DDD6C8', background: page === totalPages ? '#FAF7F0' : '#FFFFFF', cursor: page === totalPages ? 'not-allowed' : 'pointer', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: page === totalPages ? '#A8A29E' : '#1C1C1A' }}
          >Next</button>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(28, 28, 26, 0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '440px', textAlign: 'center', boxShadow: '0 24px 48px rgba(0,0,0,0.15)', border: '1px solid #DDD6C8' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1C1C1A', marginBottom: '8px', fontFamily: 'var(--font-display, serif)' }}>
              Delete {confirmDelete.length} Garment{confirmDelete.length > 1 ? 's' : ''}?
            </h3>
            <p style={{ color: '#68645C', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
              This action will permanently delete the selected item(s) from your atelier catalog. This operation cannot be reversed.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setConfirmDelete(null)} 
                disabled={isDeleting}
                style={{ flex: 1, padding: '12px', border: '1px solid #DDD6C8', background: '#FAF7F0', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#1C1C1A' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleExecuteDelete} 
                disabled={isDeleting}
                style={{ flex: 1, padding: '12px', backgroundColor: '#DC2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: isDeleting ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 700 }}
              >
                {isDeleting ? 'Deleting...' : `Confirm Delete (${confirmDelete.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
