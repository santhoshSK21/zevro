'use client';

import React, { useEffect, useState } from 'react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews/admin');
      const data = await res.json();
      setReviews(data);
    } catch (e) {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/reviews/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`Review marked as ${status}`, 'success');
        fetchReviews();
      } else {
        throw new Error('Failed to update');
      }
    } catch (e) {
      showToast('Error updating review', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      const res = await fetch(`/api/reviews/admin/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Review deleted', 'success');
        fetchReviews();
      }
    } catch (e) {
      showToast('Error deleting review', 'error');
    }
  };

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '16px 24px', borderRadius: '4px', color: '#fff', backgroundColor: toast.type === 'success' ? 'var(--success)' : 'var(--error)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>REVIEWS</h1>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E9ECEF', textAlign: 'left', backgroundColor: '#F8F9FA' }}>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Product</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Rating</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Review</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '48px', textAlign: 'center' }}>Loading...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#6C757D' }}>No reviews found.</td></tr>
            ) : reviews.map(r => (
              <tr key={r._id} style={{ borderBottom: '1px solid #E9ECEF' }}>
                <td style={{ padding: '16px 24px', fontWeight: 500 }}>{r.productId?.name || 'Unknown Product'}</td>
                <td style={{ padding: '16px 24px', color: 'var(--espresso)' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</td>
                <td style={{ padding: '16px 24px' }}>
                  <p style={{ fontWeight: 600, marginBottom: '4px' }}>{r.title || 'No Title'}</p>
                  <p style={{ color: '#6C757D', fontSize: '12px' }}>{r.body}</p>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    fontSize: '11px', padding: '4px 8px', borderRadius: '12px', fontWeight: 600,
                    backgroundColor: r.status === 'APPROVED' ? '#E8F5E9' : r.status === 'REJECTED' ? '#FDECEA' : '#FFF3E0',
                    color: r.status === 'APPROVED' ? 'var(--success)' : r.status === 'REJECTED' ? 'var(--error)' : 'var(--warning)'
                  }}>
                    {r.status || (r.isApproved ? 'APPROVED' : 'PENDING')}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  {r.status !== 'APPROVED' && (
                    <button onClick={() => handleUpdateStatus(r._id, 'APPROVED')} style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', fontSize: '13px', marginRight: '12px', fontWeight: 600 }}>Approve</button>
                  )}
                  {r.status !== 'REJECTED' && (
                    <button onClick={() => handleUpdateStatus(r._id, 'REJECTED')} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '13px', marginRight: '12px', fontWeight: 600 }}>Reject</button>
                  )}
                  <button onClick={() => handleDelete(r._id)} style={{ background: 'none', border: 'none', color: '#6C757D', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
