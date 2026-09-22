'use client';

import React, { useEffect, useState } from 'react';
import { 
  Trash2, 
  Search, 
  AlertTriangle, 
  Users, 
  ShoppingBag, 
  Calendar,
  X
} from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Selection & Delete state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string[] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCustomers = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchCustomers();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

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

  // Select all / Deselect all on current paginated view
  const handleSelectAll = () => {
    if (paginated.length > 0 && paginated.every(c => selectedIds.includes(c._id))) {
      setSelectedIds(prev => prev.filter(id => !paginated.some(c => c._id === id)));
    } else {
      const newIds = Array.from(new Set([...selectedIds, ...paginated.map(c => c._id)]));
      setSelectedIds(newIds);
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
      const res = await fetch('/api/customers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: confirmDelete })
      });

      if (res.ok) {
        showToast(`Successfully removed ${confirmDelete.length} customer account(s)`, 'success');
        setSelectedIds(prev => prev.filter(id => !confirmDelete.includes(id)));
        setConfirmDelete(null);
        fetchCustomers();
      } else {
        throw new Error();
      }
    } catch (e) {
      showToast('Failed to delete selected customer(s)', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const isCurrentPageAllSelected = paginated.length > 0 && paginated.every(c => selectedIds.includes(c._id));

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', fontFamily: 'var(--font-body, sans-serif)' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, padding: '14px 24px', borderRadius: '6px', color: '#fff', backgroundColor: toast.type === 'success' ? '#16A34A' : '#EF4444', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontSize: '13px', fontWeight: 600 }}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '26px', color: '#0F172A', margin: '0 0 4px 0' }}>
            REGISTERED CUSTOMERS
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            Inspect client accounts, order history, lifetime value, and batch deletion.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setConfirmDelete(selectedIds)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', backgroundColor: '#EF4444', color: '#FFF', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
            >
              <Trash2 size={14} />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          <div style={{ position: 'relative', width: '260px' }}>
            <input 
              type="text" 
              placeholder="Search Name or Email..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFF', fontSize: '13px', outline: 'none' }} 
            />
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          </div>

          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            style={{ padding: '10px 14px', border: '1px solid #CBD5E1', borderRadius: '4px', backgroundColor: '#FFF', fontSize: '13px', outline: 'none' }}
          >
            <option value="desc">Newest Customers First</option>
            <option value="asc">Oldest Customers First</option>
          </select>
        </div>
      </div>

      {/* Bulk Selection Notification Bar */}
      {selectedIds.length > 0 && (
        <div style={{ backgroundColor: '#0F172A', color: '#FAF8F5', padding: '12px 20px', borderRadius: '6px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: '#C5A880', color: '#0F172A', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
              {selectedIds.length} SELECTED
            </span>
            <span>You have selected {selectedIds.length} customer record(s).</span>
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

      {/* Customers Table */}
      <div style={{ backgroundColor: '#FFF', borderRadius: '6px', border: '1px solid #E2E8F0', overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        {error && <div style={{ padding: '16px', color: '#EF4444' }}>{error}</div>}
        
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
              <th style={{ padding: '14px 16px', width: '48px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={isCurrentPageAllSelected}
                  onChange={handleSelectAll}
                  style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#0F172A' }}
                  title="Select / Deselect all on this page"
                />
              </th>
              <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>Customer Name</th>
              <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>Email Address</th>
              <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>Join Date</th>
              <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>Total Orders</th>
              <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>Total Spend</th>
              <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>Last Order</th>
              <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>
                  Loading customer records...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>No customer profiles found.</td></tr>
            ) : (
              paginated.map(cust => {
                const isSelected = selectedIds.includes(cust._id);
                return (
                  <tr 
                    key={cust._id} 
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
                        onChange={() => handleToggleSelect(cust._id)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#0F172A' }}
                      />
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0F172A' }}>
                      {cust.name || 'Anonymous Guest'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#1E40AF', fontWeight: 500 }}>
                      {cust.email}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748B' }}>
                      {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#0F172A', fontWeight: 600 }}>
                      {cust.orderCount || 0}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#0F172A', fontWeight: 600 }}>
                      ₹{((cust.totalSpend || 0) / 100).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748B' }}>
                      {cust.lastOrder ? new Date(cust.lastOrder).toLocaleDateString() : 'No orders yet'}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => setConfirmDelete([cust._id])}
                        title="Delete customer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#EF4444', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        {!loading && paginated.length > 0 && (
          <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', color: '#64748B', fontSize: '12px', backgroundColor: '#F8FAFC' }}>
            <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} style={{ padding: '6px 14px', border: '1px solid #CBD5E1', background: '#FFF', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', borderRadius: '4px', fontSize: '12px', color: '#0F172A' }}>Prev</button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)} style={{ padding: '6px 14px', border: '1px solid #CBD5E1', background: '#FFF', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', borderRadius: '4px', fontSize: '12px', color: '#0F172A' }}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '8px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              Delete {confirmDelete.length} Customer{confirmDelete.length > 1 ? 's' : ''}?
            </h3>
            <p style={{ color: '#64748B', fontSize: '13px', lineHeight: 1.5, marginBottom: '24px' }}>
              This will remove customer profile login credentials and account history.
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
