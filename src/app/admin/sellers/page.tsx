'use client';

import React, { useEffect, useState } from 'react';
import {
  Store,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Building2,
  MapPin,
  Landmark,
  X,
  RefreshCw,
  Sliders,
  ShieldCheck
} from 'lucide-react';

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (statusFilter !== 'all') query.append('status', statusFilter);
      if (search) query.append('search', search);

      const res = await fetch(`/api/admin/sellers?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSellers(data.sellers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [statusFilter]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const updateStatus = async (sellerId: string, newStatus: string, rejectionReason?: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/sellers/${sellerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, rejectionReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      showToast(`Seller status updated to ${newStatus}`);
      if (selectedSeller && selectedSeller._id === sellerId) {
        setSelectedSeller(data.seller);
      }
      fetchSellers();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return { label: 'Approved', bg: '#E8F5E9', color: '#2E7D32', icon: CheckCircle2 };
      case 'PENDING_VERIFICATION':
        return { label: 'Verification Pending', bg: '#FFF3E0', color: '#E65100', icon: Clock };
      case 'REJECTED':
        return { label: 'Rejected', bg: '#FDECEA', color: '#C62828', icon: XCircle };
      case 'SUSPENDED':
        return { label: 'Suspended', bg: '#ECEFF1', color: '#455A64', icon: AlertTriangle };
      default:
        return { label: status, bg: '#F5F1E8', color: '#1C1C1A', icon: Clock };
    }
  };

  const filtered = sellers.filter((s) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      s.storeName?.toLowerCase().includes(term) ||
      s.contactEmail?.toLowerCase().includes(term) ||
      s.businessDetails?.legalName?.toLowerCase().includes(term) ||
      s.businessDetails?.gstin?.toLowerCase().includes(term)
    );
  });

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

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
            Seller Accounts & Onboarding
          </h1>
          <p style={{ color: '#68645C', fontSize: '14px', margin: 0 }}>
            Moderate merchant applications, review business documents, and manage platform permissions.
          </p>
        </div>

        <button
          onClick={fetchSellers}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FAF8F5',
            border: '1px solid #DDD6C8',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          background: '#FAF8F5',
          border: '1px solid #DDD6C8',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#68645C" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by store name, GSTIN, legal name, or email..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'PENDING_VERIFICATION', 'APPROVED', 'SUSPENDED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                background: statusFilter === st ? '#1C1C1A' : 'transparent',
                color: statusFilter === st ? '#FAF8F5' : '#68645C',
                border: statusFilter === st ? 'none' : '1px solid #DDD6C8',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {st === 'all' ? 'All Sellers' : st === 'PENDING_VERIFICATION' ? 'Under Review' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Sellers Table */}
      <div
        style={{
          background: '#FAF8F5',
          border: '1px solid #DDD6C8',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
        }}
      >
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#68645C' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #DDD6C8', borderTopColor: '#1C1C1A', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            Loading registered sellers...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#68645C' }}>
            <Store size={36} color="#B49A68" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1C1C1A' }}>No sellers found</div>
            <p style={{ fontSize: '13px', margin: '4px 0 0' }}>
              No seller accounts match your current filter criteria.
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#F5F1E8', borderBottom: '1px solid #DDD6C8', color: '#68645C', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                <th style={{ padding: '14px 20px' }}>Store & Brand</th>
                <th style={{ padding: '14px 20px' }}>Legal Entity & Tax</th>
                <th style={{ padding: '14px 20px' }}>Pickup City</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px' }}>Registered On</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const badge = getStatusBadge(s.status);
                const BadgeIcon = badge.icon;
                return (
                  <tr key={s._id} style={{ borderBottom: '1px solid #EAE4D8', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 600, color: '#1C1C1A', fontSize: '14px' }}>{s.storeName}</div>
                      <div style={{ fontSize: '12px', color: '#68645C' }}>{s.contactEmail} • {s.contactPhone}</div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 500 }}>{s.businessDetails?.legalName || 'N/A'}</div>
                      <div style={{ fontSize: '11px', color: '#68645C' }}>
                        GSTIN: {s.businessDetails?.gstin || 'None'} | PAN: {s.businessDetails?.pan || 'None'}
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <div>{s.pickupAddress?.city || 'N/A'}, {s.pickupAddress?.state}</div>
                      <div style={{ fontSize: '11px', color: '#68645C' }}>PIN: {s.pickupAddress?.pincode}</div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: badge.bg,
                          color: badge.color,
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        <BadgeIcon size={12} />
                        {badge.label}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px', color: '#68645C' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedSeller(s)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#1C1C1A',
                          color: '#FAF8F5',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <Eye size={13} /> Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Slide-over Inspection Drawer */}
      {selectedSeller && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setSelectedSeller(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              height: '100%',
              background: '#FAF8F5',
              borderLeft: '1px solid #DDD6C8',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid #DDD6C8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#F5F1E8',
              }}
            >
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>{selectedSeller.storeName}</div>
                <div style={{ fontSize: '12px', color: '#68645C' }}>
                  Seller ID: {selectedSeller._id}
                </div>
              </div>
              <button
                onClick={() => setSelectedSeller(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1C1A' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
              {/* Approval Action Box */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: '#EAE4D8',
                  border: '1px solid #DDD6C8',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                  Moderation Actions
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedSeller.status !== 'APPROVED' && (
                    <button
                      disabled={actionLoading}
                      onClick={() => updateStatus(selectedSeller._id, 'APPROVED')}
                      style={{
                        background: '#2E7D32',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Approve Seller
                    </button>
                  )}

                  {selectedSeller.status !== 'SUSPENDED' && (
                    <button
                      disabled={actionLoading}
                      onClick={() => updateStatus(selectedSeller._id, 'SUSPENDED')}
                      style={{
                        background: '#C62828',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Suspend Account
                    </button>
                  )}
                </div>
              </div>

              {/* Business Entity */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Building2 size={16} color="#B49A68" />
                  <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#68645C' }}>
                    Business & Tax Details
                  </span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                  <div><strong>Legal Entity:</strong> {selectedSeller.businessDetails?.legalName}</div>
                  <div><strong>Structure:</strong> {selectedSeller.businessDetails?.businessType}</div>
                  <div><strong>GSTIN:</strong> {selectedSeller.businessDetails?.gstin || 'None'}</div>
                  <div><strong>PAN:</strong> {selectedSeller.businessDetails?.pan || 'None'}</div>
                </div>
              </div>

              {/* Pickup Address */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <MapPin size={16} color="#B49A68" />
                  <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#68645C' }}>
                    Pickup & Courier Hub
                  </span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                  <div><strong>Contact:</strong> {selectedSeller.pickupAddress?.contactPerson} ({selectedSeller.pickupAddress?.phone})</div>
                  <div><strong>Address:</strong> {selectedSeller.pickupAddress?.line1} {selectedSeller.pickupAddress?.line2}</div>
                  <div><strong>Location:</strong> {selectedSeller.pickupAddress?.city}, {selectedSeller.pickupAddress?.state} - {selectedSeller.pickupAddress?.pincode}</div>
                </div>
              </div>

              {/* Bank Settlement */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Landmark size={16} color="#B49A68" />
                  <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#68645C' }}>
                    Settlement Bank Account
                  </span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                  <div><strong>Beneficiary:</strong> {selectedSeller.bankDetails?.accountHolderName}</div>
                  <div><strong>Bank Name:</strong> {selectedSeller.bankDetails?.bankName} ({selectedSeller.bankDetails?.branchName || 'Branch'})</div>
                  <div><strong>Account Number:</strong> {selectedSeller.bankDetails?.accountNumber}</div>
                  <div><strong>IFSC Code:</strong> {selectedSeller.bankDetails?.ifscCode}</div>
                  <div><strong>Account Type:</strong> {selectedSeller.bankDetails?.accountType?.toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
