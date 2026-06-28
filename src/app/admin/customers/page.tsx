'use client';

import React, { useEffect, useState } from 'react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customers');
        if (!res.ok) throw new Error('Failed to fetch customers');
        const data = await res.json();
        setCustomers(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  let filtered = customers.filter(c => {
    const s = search.toLowerCase();
    const name = (c.name || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    return name.includes(s) || email.includes(s);
  });

  filtered = filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>CUSTOMERS</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Search Name or Email..." 
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
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Email</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Join Date</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Orders</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Total Spend</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Last Order</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid var(--linen)', borderTopColor: 'var(--espresso)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#6C757D' }}>No customers found.</td></tr>
            ) : (
              paginated.map(cust => (
                <tr key={cust._id} style={{ borderBottom: '1px solid #E9ECEF' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--espresso)' }}>{cust.name}</td>
                  <td style={{ padding: '16px 24px', color: '#1976D2' }}>{cust.email}</td>
                  <td style={{ padding: '16px 24px', color: '#6C757D' }}>{new Date(cust.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 24px' }}>{cust.orderCount}</td>
                  <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)' }}>₹{(cust.totalSpend / 100).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '16px 24px', color: '#6C757D' }}>{cust.lastOrder ? new Date(cust.lastOrder).toLocaleDateString() : '-'}</td>
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
