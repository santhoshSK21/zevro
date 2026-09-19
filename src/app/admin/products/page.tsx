'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

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
  }, [page, search, statusFilter, categoryFilter]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Product deleted', 'success');
        fetchProducts();
      } else {
        throw new Error();
      }
    } catch (e) {
      showToast('Failed to delete', 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  const totalStock = (product: any) => {
    return product.variants?.[0]?.sizes?.reduce((sum: number, s: any) => sum + s.stock, 0) || 0;
  };

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '16px 24px', borderRadius: '4px', color: '#fff', backgroundColor: toast.type === 'success' ? 'var(--success)' : 'var(--error)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>PRODUCTS</h1>
        <Link href="/admin/products/form" style={{ padding: '8px 16px', backgroundColor: 'var(--espresso)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', textDecoration: 'none' }}>
          + Add Product
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="Search products..." 
          value={search} 
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: '10px 16px', border: '1px solid var(--linen)', borderRadius: '4px', width: '300px' }}
        />
        <select 
          value={statusFilter} 
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ padding: '10px 16px', border: '1px solid var(--linen)', borderRadius: '4px' }}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select 
          value={categoryFilter} 
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          style={{ padding: '10px 16px', border: '1px solid var(--linen)', borderRadius: '4px' }}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c._id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E9ECEF', textAlign: 'left', backgroundColor: '#F8F9FA' }}>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500, width: '60px' }}>Image</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Product</th>
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
            ) : products.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#6C757D' }}>No products found.</td></tr>
            ) : products.map(product => (
              <tr key={product._id} style={{ borderBottom: '1px solid #E9ECEF' }}>
                <td style={{ padding: '16px 24px' }}>
                  <img src={product.variants?.[0]?.images?.[0] || ''} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', background: 'var(--color-surface)' }} />
                </td>
                <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--espresso)' }}>
                  {product.name}
                  <div style={{ fontSize: '11px', color: '#6C757D', marginTop: '4px' }}>{product.slug}</div>
                </td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>{product.category}</td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>{totalStock(product)}</td>
                <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)' }}>₹{((product.price||0)/100).toLocaleString('en-IN')}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', backgroundColor: product.status === 'ACTIVE' || product.isActive ? '#E8F5E9' : (product.status === 'ARCHIVED' ? '#EEEEEE' : '#FFF3E0'), color: product.status === 'ACTIVE' || product.isActive ? 'var(--success)' : (product.status === 'ARCHIVED' ? '#616161' : '#F57C00') }}>
                    {product.status || (product.isActive ? 'ACTIVE' : 'DRAFT')}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <button onClick={() => router.push(`/admin/products/form?id=${product._id}`)} style={{ background: 'none', border: 'none', color: '#1976D2', cursor: 'pointer', fontSize: '13px', marginRight: '12px' }}>Edit</button>
                  <button onClick={() => setConfirmDelete(product._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          <button 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
            style={{ padding: '8px 16px', border: '1px solid var(--linen)', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >Prev</button>
          <span style={{ padding: '8px 16px', color: 'var(--espresso)' }}>Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(page + 1)}
            style={{ padding: '8px 16px', border: '1px solid var(--linen)', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
          >Next</button>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', width: '400px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--espresso)', marginBottom: '16px' }}>Delete Product?</h3>
            <p style={{ color: '#6C757D', marginBottom: '24px' }}>This may cause issues if the product is in existing orders.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: '12px', border: '1px solid var(--linen)', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--error)', color: '#fff', border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
