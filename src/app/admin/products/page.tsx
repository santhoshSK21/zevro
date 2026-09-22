'use client';

import React, { useEffect, useState } from 'react';
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
  const [statusFilter, setStatusFilter] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        admin: 'true',
        paginate: 'true',
        page: page.toString(),
        limit: '20'
      });
      if (search) query.append('q', search);
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
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
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
  }, [page, search, statusFilter, categoryFilter]);

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
      
      {/* Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, padding: '14px 24px', borderRadius: '6px', color: '#fff', backgroundColor: toast.type === 'success' ? '#16A34A' : '#EF4444', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontSize: '13px', fontWeight: 600 }}>
          {toast.message}
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '26px', color: '#0F172A', margin: '0 0 4px 0' }}>
            PRODUCT CATALOG & INVENTORY
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            Manage garment listings, real-time stock levels, pricing, and bulk operations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setConfirmDelete(selectedIds)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: '#EF4444', color: '#FFF', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
            >
              <Trash2 size={14} />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          <Link 
            href="/admin/products/form" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#0F172A', color: '#FAF8F5', border: '1px solid #C5A880', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s' }}
          >
            <Plus size={15} color="#C5A880" /> Add Product
          </Link>
        </div>
      </div>

      {/* Inventory KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#FFF', padding: '18px 20px', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#64748B', textTransform: 'uppercase' }}>Total Products</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginTop: '6px' }}>{products.length}</div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>In current catalog view</div>
        </div>

        <div style={{ backgroundColor: '#FFF', padding: '18px 20px', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#64748B', textTransform: 'uppercase' }}>Available Stock Units</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', marginTop: '6px' }}>{stockSummary.totalUnits} <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>units</span></div>
          <div style={{ fontSize: '12px', color: '#16A34A', marginTop: '4px', fontWeight: 500 }}>Ready for fulfillment</div>
        </div>

        <div style={{ backgroundColor: '#FFF', padding: '18px 20px', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#64748B', textTransform: 'uppercase' }}>In Stock</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#16A34A', marginTop: '6px' }}>{stockSummary.inStockCount}</div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Healthy inventory (&gt;10 units)</div>
        </div>

        <div style={{ backgroundColor: '#FFF', padding: '18px 20px', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#64748B', textTransform: 'uppercase' }}>Low / Out of Stock</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#D97706' }}>{stockSummary.lowStockCount}</span>
            <span style={{ fontSize: '13px', color: '#64748B' }}>low</span>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444', marginLeft: '8px' }}>{stockSummary.outOfStockCount}</span>
            <span style={{ fontSize: '13px', color: '#64748B' }}>out</span>
          </div>
          <div style={{ fontSize: '12px', color: '#D97706', marginTop: '4px' }}>Requires restock attention</div>
        </div>
      </div>

      {/* Bulk Selection Notice Bar */}
      {selectedIds.length > 0 && (
        <div style={{ backgroundColor: '#0F172A', color: '#FAF8F5', padding: '12px 20px', borderRadius: '6px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: '#C5A880', color: '#0F172A', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
              {selectedIds.length} SELECTED
            </span>
            <span>You have selected {selectedIds.length} product(s) on this page.</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={() => setSelectedIds([])}
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear Selection
            </button>
            <button
              onClick={() => setConfirmDelete(selectedIds)}
              style={{ backgroundColor: '#EF4444', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Trash2 size={13} /> Delete All Selected
            </button>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input 
            type="text" 
            placeholder="Search by product name or slug..." 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFF', fontSize: '13px', outline: 'none' }}
          />
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        </div>

        <select 
          value={statusFilter} 
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFF', fontSize: '13px', outline: 'none' }}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        <select 
          value={categoryFilter} 
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          style={{ padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFF', fontSize: '13px', outline: 'none' }}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c._id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div style={{ backgroundColor: '#FFF', borderRadius: '6px', border: '1px solid #E2E8F0', overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
              <th style={{ padding: '14px 16px', width: '48px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#0F172A' }}
                  title="Select / Deselect all on this page"
                />
              </th>
              <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600, width: '60px' }}>Image</th>
              <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>Product Details</th>
              <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>Available Stock</th>
              <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>Price</th>
              <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>Loading products...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>No products found.</td></tr>
            ) : products.map(product => {
              const isSelected = selectedIds.includes(product._id);
              const { total: stockTotal, sizeDetails } = getProductStock(product);
              
              const isOutOfStock = stockTotal === 0;
              const isLowStock = stockTotal > 0 && stockTotal <= 10;
              
              return (
                <tr 
                  key={product._id} 
                  style={{ 
                    borderBottom: '1px solid #F1F5F9',
                    backgroundColor: isSelected ? 'rgba(197, 168, 128, 0.08)' : 'transparent',
                    transition: 'background-color 0.15s'
                  }}
                >
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(product._id)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#0F172A' }}
                    />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {(product.variants?.[0]?.images?.[0] || product.images?.[0] || product.image) ? (
                      <img 
                        src={product.variants?.[0]?.images?.[0] || product.images?.[0] || product.image} 
                        alt={product.name} 
                        style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#F1F5F9' }} 
                      />
                    ) : (
                      <div style={{ width: '42px', height: '42px', borderRadius: '4px', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>
                        No Img
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '13px' }}>{product.name}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{product.slug}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569' }}>
                    <span style={{ textTransform: 'capitalize' }}>
                      {product.category?.replace(/-/g, ' ') || 'General'}
                    </span>
                    {product.subcategory && (
                      <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8', textTransform: 'capitalize' }}>
                        {product.subcategory.replace(/-/g, ' ')}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: isOutOfStock ? '#EF4444' : (isLowStock ? '#D97706' : '#0F172A') }}>
                        {stockTotal} units
                      </span>
                      <span style={{ 
                        fontSize: '10px', 
                        padding: '2px 6px', 
                        borderRadius: '10px', 
                        fontWeight: 700, 
                        letterSpacing: '0.04em',
                        backgroundColor: isOutOfStock ? '#FEE2E2' : (isLowStock ? '#FEF3C7' : '#DCFCE7'), 
                        color: isOutOfStock ? '#DC2626' : (isLowStock ? '#B45309' : '#16A34A') 
                      }}>
                        {isOutOfStock ? 'OUT OF STOCK' : (isLowStock ? 'LOW STOCK' : 'IN STOCK')}
                      </span>
                    </div>
                    {sizeDetails.length > 0 && (
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {sizeDetails.map((sz, idx) => (
                          <span key={idx} style={{ backgroundColor: '#F1F5F9', padding: '1px 5px', borderRadius: '3px' }}>
                            {sz.size}: {sz.stock}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0F172A' }}>₹{((product.price||0)/100).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', fontWeight: 600, backgroundColor: product.status === 'ACTIVE' || product.isActive ? '#DCFCE7' : (product.status === 'ARCHIVED' ? '#F1F5F9' : '#FEF3C7'), color: product.status === 'ACTIVE' || product.isActive ? '#16A34A' : (product.status === 'ARCHIVED' ? '#64748B' : '#D97706') }}>
                      {product.status || (product.isActive ? 'ACTIVE' : 'DRAFT')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button 
                        onClick={() => router.push(`/admin/products/form?id=${product._id}`)} 
                        title="Edit Product"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0F172A', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      <button 
                        onClick={() => setConfirmDelete([product._id])} 
                        title="Delete Product"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#EF4444', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}
                      >
                        <Trash2 size={13} /> Delete
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          <button 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
            style={{ padding: '8px 16px', border: '1px solid #CBD5E1', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', borderRadius: '4px', fontSize: '12px', color: '#0F172A' }}
          >Prev</button>
          <span style={{ padding: '8px 16px', color: '#64748B', fontSize: '13px' }}>Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(page + 1)}
            style={{ padding: '8px 16px', border: '1px solid #CBD5E1', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', borderRadius: '4px', fontSize: '12px', color: '#0F172A' }}
          >Next</button>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              Delete {confirmDelete.length} Product{confirmDelete.length > 1 ? 's' : ''}?
            </h3>
            <p style={{ color: '#64748B', fontSize: '13px', lineHeight: 1.5, marginBottom: '24px' }}>
              This action will permanently delete the selected item(s) from your store catalog. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setConfirmDelete(null)} 
                disabled={isDeleting}
                style={{ flex: 1, padding: '12px', border: '1px solid #CBD5E1', background: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#475569' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleExecuteDelete} 
                disabled={isDeleting}
                style={{ flex: 1, padding: '12px', backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: isDeleting ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 700 }}
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
