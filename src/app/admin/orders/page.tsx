'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  let filtered = orders.filter(o => {
    const s = search.toLowerCase();
    const id = (o.orderId || o._id).toLowerCase();
    const name = (o.shippingAddress?.name || 'Guest').toLowerCase();
    return id.includes(s) || name.includes(s);
  });

  filtered = filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return { bg: '#E8F5E9', color: 'var(--success)' };
      case 'shipped': case 'out-for-delivery': return { bg: '#E3F2FD', color: '#1976D2' };
      case 'cancelled': case 'return-requested': return { bg: '#FDECEA', color: 'var(--error)' };
      default: return { bg: '#FFF3E0', color: 'var(--warning)' };
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>ORDERS</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Search Order ID or Customer..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            style={{ padding: '8px 16px', border: '1px solid #E9ECEF', borderRadius: '4px', outline: 'none' }} 
          />
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            style={{ padding: '8px 16px', border: '1px solid #E9ECEF', borderRadius: '4px', outline: 'none' }}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF', overflow: 'hidden' }}>
        {error && <div style={{ padding: '16px', color: 'var(--error)' }}>{error}</div>}
        
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E9ECEF', textAlign: 'left', backgroundColor: '#F8F9FA' }}>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Order ID</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Customer</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Date</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Items</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Total</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Payment</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Fulfillment</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ padding: '48px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid var(--linen)', borderTopColor: 'var(--espresso)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#6C757D' }}>No orders found.</td></tr>
            ) : (
              paginated.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid #E9ECEF' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--espresso)' }}>{order.orderId || order._id.slice(-6).toUpperCase()}</td>
                  <td style={{ padding: '16px 24px' }}>
                    {order.shippingAddress?.name || 'Guest'}
                    <div style={{ fontSize: '11px', color: '#6C757D' }}>{order.shippingAddress?.email}</div>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#6C757D' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 24px', color: '#6C757D' }}>{order.items?.length || 0} items</td>
                  <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)' }}>₹{((order.pricing?.total||0) / 100).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '16px 24px', textTransform: 'capitalize' }}>
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', backgroundColor: order.payment?.status === 'paid' ? '#E8F5E9' : '#FFF3E0', color: order.payment?.status === 'paid' ? 'var(--success)' : 'var(--warning)' }}>
                      {order.payment?.status || 'pending'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textTransform: 'capitalize' }}>
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', ...getStatusColor(order.status) }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <button onClick={() => router.push(`/admin/orders/${order._id}`)} style={{ background: 'none', border: 'none', color: '#1976D2', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px' }}>View Details</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {!loading && paginated.length > 0 && (
          <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E9ECEF', color: '#6C757D', fontSize: '13px' }}>
            <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} style={{ padding: '4px 12px', border: '1px solid #E9ECEF', background: '#FFF', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', borderRadius: '4px' }}>Prev</button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)} style={{ padding: '4px 12px', border: '1px solid #E9ECEF', background: '#FFF', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', borderRadius: '4px' }}>Next</button>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
