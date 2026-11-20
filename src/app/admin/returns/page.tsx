'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  XCircle,
  Package,
  Layers,
  ArrowRight,
  Filter,
  Search,
  Check,
  X,
  Sparkles,
  RefreshCw,
  Printer,
  ChevronRight,
  Boxes,
  Eye,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Calendar,
  CreditCard,
  User,
  ExternalLink,
} from 'lucide-react';

interface ReturnRequestItem {
  _id: string;
  orderId: string;
  orderNumber: string;
  sellerId: string;
  sellerStoreName: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  item: {
    productId: string;
    name: string;
    image: string;
    color?: string;
    size?: string;
    quantity: number;
    price: number; // in paise
    sku?: string;
  };
  type: 'RETURN' | 'EXCHANGE';
  resolutionType: 'REFUND' | 'REPLACEMENT';
  reason: string;
  details?: string;
  photos: string[];
  exchangePreference?: {
    size?: string;
    color?: string;
  };
  status:
    | 'REQUESTED'
    | 'APPROVED'
    | 'REJECTED'
    | 'PICKUP_SCHEDULED'
    | 'IN_TRANSIT'
    | 'RECEIVED'
    | 'INSPECTION_PENDING'
    | 'REFUND_PENDING'
    | 'REFUNDED'
    | 'REPLACEMENT_PROCESSING'
    | 'COMPLETED';
  rejectionReason?: string;
  reverseCourier?: {
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    scheduledPickupDate?: string;
    actualPickupDate?: string;
    receivedDate?: string;
  };
  inspection?: {
    condition?: 'SELLABLE' | 'DAMAGED' | 'DEFECTIVE' | 'QUARANTINE';
    inspectedBy?: string;
    inspectedAt?: string;
    notes?: string;
    inventoryAction?: 'RESTOCKED_TO_SELLABLE' | 'SCRAPPED_DAMAGED' | 'HELD_IN_QUARANTINE' | 'NONE';
  };
  inventoryRestocked: boolean;
  restockedAt?: string;
  refund?: {
    amount: number;
    status: string;
    method?: string;
    transactionId?: string;
    refundedAt?: string;
  };
  replacement?: {
    size?: string;
    color?: string;
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    status?: string;
    dispatchedAt?: string;
    deliveredAt?: string;
  };
  auditLog?: Array<{
    status: string;
    action: string;
    performedBy: string;
    notes?: string;
    timestamp: string;
  }>;
  slaDeadline: string;
  createdAt: string;
}

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequestItem[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    requested: 0,
    approved: 0,
    pickupScheduled: 0,
    inTransit: 0,
    received: 0,
    inspectionPending: 0,
    refundPending: 0,
    refunded: 0,
    replacementProcessing: 0,
    completed: 0,
    rejected: 0,
  });
  const [filterOptions, setFilterOptions] = useState<{ reasons: string[]; sellers: any[] }>({
    reasons: [],
    sellers: [],
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('all');
  const [sellerFilter, setSellerFilter] = useState('ALL');
  const [reasonFilter, setReasonFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Action States
  const [activeItem, setActiveItem] = useState<ReturnRequestItem | null>(null);
  const [actionType, setActionType] = useState<
    'APPROVE' | 'REJECT' | 'INSPECT' | 'REFUND' | 'REPLACEMENT' | 'AUDIT' | 'PHOTOS' | null
  >(null);

  // Modal Form Inputs
  const [courierName, setCourierName] = useState('Delhivery Reverse Logistics');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [scheduledPickupDate, setScheduledPickupDate] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [condition, setCondition] = useState<'SELLABLE' | 'DAMAGED' | 'DEFECTIVE' | 'QUARANTINE'>('SELLABLE');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [inspectorName, setInspectorName] = useState('ZEVRO Atelier Quality Officer');
  const [refundAmountPaise, setRefundAmountPaise] = useState(0);
  const [refundMethod, setRefundMethod] = useState('original_source');
  const [refundTxnId, setRefundTxnId] = useState('');
  const [replacementCourier, setReplacementCourier] = useState('BlueDart Express');
  const [replacementAwb, setReplacementAwb] = useState('');

  const [actionProcessing, setActionProcessing] = useState(false);
  const [actionBanner, setActionBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'ALL') params.set('status', statusFilter);
      if (dateFilter && dateFilter !== 'all') params.set('dateRange', dateFilter);
      if (sellerFilter && sellerFilter !== 'ALL') params.set('sellerId', sellerFilter);
      if (reasonFilter && reasonFilter !== 'ALL') params.set('reason', reasonFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/admin/returns?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load returns');
      const data = await res.json();
      setReturns(data.returns || []);
      if (data.counts) setCounts(data.counts);
      if (data.filterOptions) setFilterOptions(data.filterOptions);
    } catch (err: any) {
      console.error(err);
      setActionBanner({ type: 'error', message: err.message || 'Failed to load returns' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFilter, sellerFilter, reasonFilter, searchQuery]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  // Execute Backend API Action
  const handleExecuteAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem || !actionType) return;

    setActionProcessing(true);
    setActionBanner(null);

    let payload: any = {
      returnId: activeItem._id,
      action: actionType,
    };

    if (actionType === 'APPROVE') {
      payload = {
        ...payload,
        action: 'APPROVE',
        courierName,
        trackingNumber: trackingNumber || `REV-${Date.now().toString().slice(-6)}`,
        scheduledPickupDate: scheduledPickupDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
    } else if (actionType === 'REJECT') {
      if (!rejectionReason.trim()) {
        alert('Please provide a rejection reason');
        setActionProcessing(false);
        return;
      }
      payload = {
        ...payload,
        action: 'REJECT',
        rejectionReason: rejectionReason.trim(),
      };
    } else if (actionType === 'INSPECT') {
      payload = {
        ...payload,
        action: 'INSPECT',
        condition,
        inspectionNotes,
        inspectorName,
      };
    } else if (actionType === 'REFUND') {
      payload = {
        ...payload,
        action: 'PROCESS_REFUND',
        refundAmount: refundAmountPaise,
        refundMethod,
        refundTxnId: refundTxnId || `RFND-${Date.now().toString().slice(-8)}`,
      };
    } else if (actionType === 'REPLACEMENT') {
      payload = {
        ...payload,
        action: 'DISPATCH_REPLACEMENT',
        replacementCourier,
        replacementAwb: replacementAwb || `RPL-${Date.now().toString().slice(-6)}`,
      };
    }

    try {
      const res = await fetch('/api/admin/returns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update return');
      }

      setActionBanner({ type: 'success', message: data.message });
      closeModal();
      fetchReturns();
    } catch (err: any) {
      console.error(err);
      setActionBanner({ type: 'error', message: err.message || 'Error executing action' });
    } finally {
      setActionProcessing(false);
    }
  };

  // Quick Direct Actions (Mark Received, Mark In Transit, Complete)
  const handleQuickAction = async (item: ReturnRequestItem, actionName: string) => {
    setActionProcessing(true);
    try {
      const res = await fetch('/api/admin/returns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnId: item._id,
          action: actionName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      setActionBanner({ type: 'success', message: data.message });
      fetchReturns();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionProcessing(false);
    }
  };

  // Open Modal Helpers
  const openApproveModal = (item: ReturnRequestItem) => {
    setActiveItem(item);
    setCourierName('Delhivery Reverse Logistics');
    setTrackingNumber(`REV-${Date.now().toString().slice(-6)}`);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    setScheduledPickupDate(tomorrow.toISOString().split('T')[0]);
    setActionType('APPROVE');
  };

  const openRejectModal = (item: ReturnRequestItem) => {
    setActiveItem(item);
    setRejectionReason('');
    setActionType('REJECT');
  };

  const openInspectModal = (item: ReturnRequestItem) => {
    setActiveItem(item);
    setCondition('SELLABLE');
    setInspectionNotes('');
    setInspectorName('ZEVRO Atelier Quality Officer');
    setActionType('INSPECT');
  };

  const openRefundModal = (item: ReturnRequestItem) => {
    setActiveItem(item);
    setRefundAmountPaise(item.item.price * item.item.quantity);
    setRefundMethod('original_source');
    setRefundTxnId(`RFND-${Date.now().toString().slice(-8)}`);
    setActionType('REFUND');
  };

  const openReplacementModal = (item: ReturnRequestItem) => {
    setActiveItem(item);
    setReplacementCourier('BlueDart Express');
    setReplacementAwb(`RPL-${Date.now().toString().slice(-6)}`);
    setActionType('REPLACEMENT');
  };

  const openAuditModal = (item: ReturnRequestItem) => {
    setActiveItem(item);
    setActionType('AUDIT');
  };

  const openPhotosModal = (item: ReturnRequestItem) => {
    setActiveItem(item);
    setActionType('PHOTOS');
  };

  const closeModal = () => {
    setActiveItem(null);
    setActionType(null);
  };

  // Status Badge Styling Helper
  const renderStatusBadge = (status: ReturnRequestItem['status']) => {
    const config: Record<string, { label: string; bg: string; color: string; border: string }> = {
      REQUESTED: { label: 'REQUESTED', bg: '#FEF3C7', color: '#92400E', border: '#FCD34D' },
      APPROVED: { label: 'APPROVED', bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' },
      PICKUP_SCHEDULED: { label: 'PICKUP SCHEDULED', bg: '#E0E7FF', color: '#3730A3', border: '#C7D2FE' },
      IN_TRANSIT: { label: 'IN TRANSIT', bg: '#F3E8FF', color: '#6B21A8', border: '#E9D5FF' },
      RECEIVED: { label: 'RECEIVED', bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' },
      INSPECTION_PENDING: { label: 'INSPECTING', bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
      REFUND_PENDING: { label: 'REFUND PENDING', bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
      REFUNDED: { label: 'REFUNDED', bg: '#DCFCE7', color: '#166534', border: '#86EFAC' },
      REPLACEMENT_PROCESSING: { label: 'REPLACEMENT PREP', bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD' },
      COMPLETED: { label: 'COMPLETED', bg: '#F1F5F9', color: '#334155', border: '#CBD5E1' },
      REJECTED: { label: 'REJECTED', bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' },
    };

    const c = config[status] || { label: status, bg: '#F3F4F6', color: '#374151', border: '#E5E7EB' };

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          backgroundColor: c.bg,
          color: c.color,
          border: `1px solid ${c.border}`,
          whiteSpace: 'nowrap',
        }}
      >
        {c.label}
      </span>
    );
  };

  return (
    <div className="adm-returns-container">
      {/* Page Title & Top Actions */}
      <div className="adm-returns-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8A704C', fontWeight: 700 }}>
              ZEVRO ERP • INVENTORY INTELLIGENCE
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '26px', color: '#111827', margin: 0, fontWeight: 600 }}>
            Return & Resolution Management
          </h1>
          <p style={{ fontSize: '13px', color: '#595F69', marginTop: '4px', margin: 0 }}>
            Manage customer return requests, reverse logistics, warehouse condition inspections, strict inventory restock workflows, and refund/replacement disbursement.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchReturns}
            disabled={loading}
            className="adm-btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionBanner && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: actionBanner.type === 'success' ? '#F0FDF4' : '#FEF2F2',
            border: `1px solid ${actionBanner.type === 'success' ? '#86EFAC' : '#FCA5A5'}`,
            color: actionBanner.type === 'success' ? '#166534' : '#991B1B',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {actionBanner.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{actionBanner.message}</span>
          </div>
          <button onClick={() => setActionBanner(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* KPI Summary Strip */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi-card" onClick={() => setStatusFilter('ALL')} style={{ cursor: 'pointer' }}>
          <span className="adm-kpi-title">Total Returns</span>
          <span className="adm-kpi-val">{counts.total}</span>
          <span className="adm-kpi-sub">All-time logged</span>
        </div>

        <div className="adm-kpi-card is-urgent" onClick={() => setStatusFilter('REQUESTED')} style={{ cursor: 'pointer', borderColor: counts.requested > 0 ? '#F59E0B' : '#E5E7EB' }}>
          <span className="adm-kpi-title" style={{ color: '#B45309' }}>Action Required</span>
          <span className="adm-kpi-val" style={{ color: '#B45309' }}>{counts.requested}</span>
          <span className="adm-kpi-sub">Under 48h SLA</span>
        </div>

        <div className="adm-kpi-card" onClick={() => setStatusFilter('PICKUP_SCHEDULED')} style={{ cursor: 'pointer' }}>
          <span className="adm-kpi-title">Pickup Scheduled</span>
          <span className="adm-kpi-val">{counts.pickupScheduled}</span>
          <span className="adm-kpi-sub">Assigned to courier</span>
        </div>

        <div className="adm-kpi-card" onClick={() => setStatusFilter('IN_TRANSIT')} style={{ cursor: 'pointer' }}>
          <span className="adm-kpi-title">In Transit</span>
          <span className="adm-kpi-val">{counts.inTransit}</span>
          <span className="adm-kpi-sub">En route to warehouse</span>
        </div>

        <div className="adm-kpi-card" onClick={() => setStatusFilter('INSPECTION_PENDING')} style={{ cursor: 'pointer' }}>
          <span className="adm-kpi-title">Quality Inspection</span>
          <span className="adm-kpi-val" style={{ color: '#4338CA' }}>{counts.inspectionPending + counts.received}</span>
          <span className="adm-kpi-sub">Receipt & Condition audit</span>
        </div>

        <div className="adm-kpi-card" onClick={() => setStatusFilter('REFUND_PENDING')} style={{ cursor: 'pointer' }}>
          <span className="adm-kpi-title">Refund Queue</span>
          <span className="adm-kpi-val" style={{ color: '#DC2626' }}>{counts.refundPending}</span>
          <span className="adm-kpi-sub">Inspected, awaiting payout</span>
        </div>

        <div className="adm-kpi-card" onClick={() => setStatusFilter('REFUNDED')} style={{ cursor: 'pointer' }}>
          <span className="adm-kpi-title">Refunded / Settled</span>
          <span className="adm-kpi-val" style={{ color: '#166534' }}>{counts.refunded}</span>
          <span className="adm-kpi-sub">Payment settled</span>
        </div>

        <div className="adm-kpi-card" onClick={() => setStatusFilter('COMPLETED')} style={{ cursor: 'pointer' }}>
          <span className="adm-kpi-title">Completed</span>
          <span className="adm-kpi-val" style={{ color: '#475569' }}>{counts.completed}</span>
          <span className="adm-kpi-sub">Closed cycle</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="adm-filter-bar">
        {/* Status Tab Selector */}
        <div className="adm-status-tabs">
          {[
            { id: 'ALL', label: 'All Returns', count: counts.total },
            { id: 'REQUESTED', label: 'Requested', count: counts.requested },
            { id: 'APPROVED', label: 'Approved', count: counts.approved },
            { id: 'PICKUP_SCHEDULED', label: 'Pickup', count: counts.pickupScheduled },
            { id: 'IN_TRANSIT', label: 'In Transit', count: counts.inTransit },
            { id: 'INSPECTION_PENDING', label: 'Inspection', count: counts.inspectionPending + counts.received },
            { id: 'REFUND_PENDING', label: 'Refund Pending', count: counts.refundPending },
            { id: 'REFUNDED', label: 'Refunded', count: counts.refunded },
            { id: 'REPLACEMENT_PROCESSING', label: 'Replacement', count: counts.replacementProcessing },
            { id: 'COMPLETED', label: 'Completed', count: counts.completed },
            { id: 'REJECTED', label: 'Rejected', count: counts.rejected },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`adm-status-tab-btn ${isActive ? 'is-active' : ''}`}
              >
                <span>{tab.label}</span>
                <span className="adm-tab-pill">{tab.count}</span>
              </button>
            );
          })}
        </div>

        {/* Multi-faceted Selectors */}
        <div className="adm-filter-controls-row">
          {/* Search Input */}
          <div className="adm-search-box">
            <Search size={14} className="adm-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order #, SKU, Customer, AWB..."
              className="adm-filter-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="adm-clear-btn">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Date Range Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="adm-filter-select"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>

          {/* Seller Filter */}
          <select
            value={sellerFilter}
            onChange={(e) => setSellerFilter(e.target.value)}
            className="adm-filter-select"
          >
            <option value="ALL">All Sellers / Ateliers</option>
            {filterOptions.sellers?.map((s: any) => (
              <option key={s._id} value={s._id}>
                {s.storeName}
              </option>
            ))}
          </select>

          {/* Reason Filter */}
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="adm-filter-select"
          >
            <option value="ALL">All Return Reasons</option>
            {filterOptions.reasons?.map((r, i) => (
              <option key={i} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Returns Data Table */}
      <div className="adm-table-wrap">
        {loading ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#595F69' }}>
            <div style={{ width: '28px', height: '28px', border: '2px solid #C5A869', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: '13px', margin: 0 }}>Loading return and resolution records...</p>
          </div>
        ) : returns.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <RotateCcw size={36} color="#9CA3AF" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '18px', color: '#111827', margin: '0 0 8px' }}>
              No Return Requests Found
            </h3>
            <p style={{ fontSize: '13px', color: '#595F69', maxWidth: '420px', margin: '0 auto 16px' }}>
              No return orders match your selected status, search, or date filter parameters.
            </p>
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setDateFilter('all');
                setSellerFilter('ALL');
                setReasonFilter('ALL');
                setSearchQuery('');
              }}
              className="adm-btn-secondary"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order & Return Info</th>
                <th>Customer</th>
                <th>Item & Variant</th>
                <th>Type & Reason</th>
                <th>Status</th>
                <th>Reverse Logistics</th>
                <th>Inspection & Stock</th>
                <th>Refund / Exchange</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((ret) => (
                <tr key={ret._id}>
                  {/* Order & Return Info */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>
                        #{ret.orderNumber}
                      </span>
                      <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace' }}>
                        ID: {ret._id.slice(-6).toUpperCase()}
                      </span>
                      <span style={{ fontSize: '11px', color: '#8A704C' }}>
                        {ret.sellerStoreName}
                      </span>
                      <span style={{ fontSize: '10px', color: '#9CA3AF' }}>
                        {new Date(ret.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </td>

                  {/* Customer */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: 600, fontSize: '12px', color: '#111827' }}>
                        {ret.userName}
                      </span>
                      <span style={{ fontSize: '11px', color: '#6B7280' }}>
                        {ret.userEmail}
                      </span>
                      {ret.userPhone && (
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>
                          {ret.userPhone}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Item & Variant */}
                  <td>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <img
                        src={ret.item.image || '/pdp_hero_1.png'}
                        alt={ret.item.name}
                        style={{ width: '42px', height: '52px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E5E7EB' }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: 600, fontSize: '12px', color: '#111827', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ret.item.name}
                        </span>
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>
                          Size: {ret.item.size || 'M'} | Color: {ret.item.color || 'Standard'}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#111827' }}>
                          ₹{((ret.item.price * ret.item.quantity) / 100).toLocaleString('en-IN')} (Qty: {ret.item.quantity})
                        </span>
                        {ret.item.sku && (
                          <span style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'monospace' }}>
                            SKU: {ret.item.sku}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Type & Reason */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '3px',
                          backgroundColor: ret.resolutionType === 'REPLACEMENT' ? '#EFF6FF' : '#FEF3C7',
                          color: ret.resolutionType === 'REPLACEMENT' ? '#1E40AF' : '#92400E',
                          width: 'fit-content',
                        }}
                      >
                        {ret.resolutionType || (ret.type === 'EXCHANGE' ? 'REPLACEMENT' : 'REFUND')}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: '#111827' }}>
                        {ret.reason}
                      </span>
                      {ret.details && (
                        <p style={{ fontSize: '11px', color: '#6B7280', margin: 0, fontStyle: 'italic', maxWidth: '180px' }}>
                          "{ret.details}"
                        </p>
                      )}
                      {ret.photos && ret.photos.length > 0 && (
                        <button
                          type="button"
                          onClick={() => openPhotosModal(ret)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            color: '#2563EB',
                            fontSize: '11px',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          View {ret.photos.length} Photo{ret.photos.length > 1 ? 's' : ''}
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {renderStatusBadge(ret.status)}
                      {ret.rejectionReason && (
                        <span style={{ fontSize: '10px', color: '#DC2626', maxWidth: '140px' }}>
                          Decline reason: {ret.rejectionReason}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Reverse Logistics */}
                  <td>
                    {ret.reverseCourier?.trackingNumber ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px' }}>
                        <span style={{ fontWeight: 600, color: '#111827' }}>
                          {ret.reverseCourier.courierName || 'Courier Assigned'}
                        </span>
                        <a
                          href={ret.reverseCourier.trackingUrl || `https://track.delhivery.com/p/${ret.reverseCourier.trackingNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#2563EB', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                        >
                          AWB: {ret.reverseCourier.trackingNumber}
                          <ExternalLink size={10} />
                        </a>
                        {ret.reverseCourier.scheduledPickupDate && (
                          <span style={{ fontSize: '10px', color: '#6B7280' }}>
                            Pickup: {new Date(ret.reverseCourier.scheduledPickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Not assigned</span>
                    )}
                  </td>

                  {/* Inspection & Stock */}
                  <td>
                    {ret.inspection?.condition ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '3px',
                            backgroundColor:
                              ret.inspection.condition === 'SELLABLE'
                                ? '#DCFCE7'
                                : ret.inspection.condition === 'QUARANTINE'
                                ? '#FEF3C7'
                                : '#FEE2E2',
                            color:
                              ret.inspection.condition === 'SELLABLE'
                                ? '#166534'
                                : ret.inspection.condition === 'QUARANTINE'
                                ? '#92400E'
                                : '#991B1B',
                            width: 'fit-content',
                          }}
                        >
                          {ret.inspection.condition}
                        </span>
                        <span style={{ fontSize: '10px', color: ret.inventoryRestocked ? '#166534' : '#6B7280', fontWeight: ret.inventoryRestocked ? 600 : 400 }}>
                          {ret.inventoryRestocked ? '✓ Restocked (+Qty)' : 'No stock added'}
                        </span>
                        {ret.inspection.inspectedBy && (
                          <span style={{ fontSize: '10px', color: '#9CA3AF' }}>
                            By: {ret.inspection.inspectedBy}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Awaiting Arrival</span>
                    )}
                  </td>

                  {/* Refund / Exchange */}
                  <td>
                    {ret.resolutionType === 'REPLACEMENT' || ret.type === 'EXCHANGE' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px' }}>
                        <span style={{ fontWeight: 600, color: '#1E40AF' }}>
                          Exch: Size {ret.exchangePreference?.size || ret.replacement?.size || ret.item.size}
                        </span>
                        {ret.replacement?.trackingNumber ? (
                          <span style={{ fontSize: '10px', color: '#166534' }}>
                            Dispatched (AWB: {ret.replacement.trackingNumber})
                          </span>
                        ) : (
                          <span style={{ fontSize: '10px', color: '#6B7280' }}>
                            Status: {ret.replacement?.status || 'Pending'}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px' }}>
                        <span style={{ fontWeight: 600, color: '#111827' }}>
                          ₹{((ret.refund?.amount || ret.item.price * ret.item.quantity) / 100).toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: '10px', color: ret.refund?.status === 'processed' ? '#166534' : '#B45309', fontWeight: 600 }}>
                          {ret.refund?.status === 'processed' ? `✓ Paid (${ret.refund.transactionId?.slice(-8) || 'Done'})` : 'Payment Pending'}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      {/* Step 1: Requested -> Approve or Reject */}
                      {ret.status === 'REQUESTED' && (
                        <>
                          <button
                            type="button"
                            onClick={() => openApproveModal(ret)}
                            className="adm-table-action-btn is-approve"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => openRejectModal(ret)}
                            className="adm-table-action-btn is-reject"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* Step 2: Pickup Scheduled -> In Transit */}
                      {ret.status === 'PICKUP_SCHEDULED' && (
                        <button
                          type="button"
                          onClick={() => handleQuickAction(ret, 'MARK_IN_TRANSIT')}
                          disabled={actionProcessing}
                          className="adm-table-action-btn is-transit"
                        >
                          Mark In-Transit
                        </button>
                      )}

                      {/* Step 3: In Transit -> Mark Received at Facility */}
                      {ret.status === 'IN_TRANSIT' && (
                        <button
                          type="button"
                          onClick={() => handleQuickAction(ret, 'MARK_RECEIVED')}
                          disabled={actionProcessing}
                          className="adm-table-action-btn is-receive"
                        >
                          Mark Received
                        </button>
                      )}

                      {/* Step 4: Received / Inspection Pending -> Perform Quality Inspection */}
                      {(ret.status === 'RECEIVED' || ret.status === 'INSPECTION_PENDING') && (
                        <button
                          type="button"
                          onClick={() => openInspectModal(ret)}
                          className="adm-table-action-btn is-inspect"
                        >
                          Inspect Condition
                        </button>
                      )}

                      {/* Step 5: Refund Pending -> Disburse Refund */}
                      {ret.status === 'REFUND_PENDING' && (
                        <button
                          type="button"
                          onClick={() => openRefundModal(ret)}
                          className="adm-table-action-btn is-refund"
                        >
                          Issue Refund
                        </button>
                      )}

                      {/* Step 5b: Replacement Processing -> Dispatch Replacement */}
                      {ret.status === 'REPLACEMENT_PROCESSING' && (
                        <button
                          type="button"
                          onClick={() => openReplacementModal(ret)}
                          className="adm-table-action-btn is-replacement"
                        >
                          Dispatch Replacement
                        </button>
                      )}

                      {/* Step 6: Refunded -> Complete Cycle */}
                      {(ret.status === 'REFUNDED' || ret.replacement?.status === 'DISPATCHED') && (
                        <button
                          type="button"
                          onClick={() => handleQuickAction(ret, 'COMPLETE')}
                          disabled={actionProcessing}
                          className="adm-table-action-btn is-complete"
                        >
                          Close Cycle
                        </button>
                      )}

                      {/* Audit Log Viewer */}
                      <button
                        type="button"
                        onClick={() => openAuditModal(ret)}
                        title="View Complete Audit Log"
                        className="adm-table-action-btn is-ghost"
                      >
                        <FileText size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: APPROVE RETURN & SCHEDULE REVERSE LOGISTICS       */}
      {/* ========================================================= */}
      {actionType === 'APPROVE' && activeItem && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-card">
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Approve Return & Schedule Doorstep Pickup</h3>
              <button onClick={closeModal} className="adm-modal-close">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleExecuteAction}>
              <div className="adm-modal-body">
                <p style={{ fontSize: '13px', color: '#595F69', marginBottom: '16px' }}>
                  Approving return for Order <strong>#{activeItem.orderNumber}</strong> ({activeItem.item.name}). Assign reverse logistics carrier for doorstep collection.
                </p>

                <div className="adm-form-group">
                  <label className="adm-form-label">Reverse Logistics Courier</label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="adm-form-input"
                  >
                    <option value="Delhivery Reverse Logistics">Delhivery Reverse Logistics</option>
                    <option value="BlueDart Apex Reverse">BlueDart Apex Reverse</option>
                    <option value="Shadowfax Doorstep Return">Shadowfax Doorstep Return</option>
                    <option value="ZEVRO White Glove Courier">ZEVRO White Glove Courier</option>
                  </select>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Reverse Tracking AWB Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. REV-948102"
                    required
                    className="adm-form-input"
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Scheduled Doorstep Pickup Date</label>
                  <input
                    type="date"
                    value={scheduledPickupDate}
                    onChange={(e) => setScheduledPickupDate(e.target.value)}
                    required
                    className="adm-form-input"
                  />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" onClick={closeModal} className="adm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={actionProcessing} className="adm-btn-primary">
                  {actionProcessing ? 'Scheduling...' : 'Approve & Schedule Pickup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: REJECT RETURN REQUEST                            */}
      {/* ========================================================= */}
      {actionType === 'REJECT' && activeItem && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-card">
            <div className="adm-modal-header">
              <h3 className="adm-modal-title" style={{ color: '#DC2626' }}>Reject Return Request</h3>
              <button onClick={closeModal} className="adm-modal-close">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleExecuteAction}>
              <div className="adm-modal-body">
                <p style={{ fontSize: '13px', color: '#595F69', marginBottom: '16px' }}>
                  Please provide a clear justification for rejecting the return for <strong>{activeItem.item.name}</strong> (Order #{activeItem.orderNumber}). This explanation will be communicated to the customer.
                </p>

                <div className="adm-form-group">
                  <label className="adm-form-label">Rejection Reason *</label>
                  <select
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="adm-form-input"
                    style={{ marginBottom: '8px' }}
                  >
                    <option value="">Select standard rejection template...</option>
                    <option value="Return policy window expired (exceeded 7 days from delivery date).">Return policy window expired (exceeded 7 days from delivery date)</option>
                    <option value="Item was purchased during final clearance archive (Non-returnable).">Item was purchased during final clearance archive (Non-returnable)</option>
                    <option value="Garment alteration or custom bespoke sizing was performed.">Garment alteration or custom bespoke sizing was performed</option>
                    <option value="Damage reported is normal wear and tear or incorrect laundry washing.">Damage reported is normal wear and tear</option>
                  </select>

                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter or customize rejection reason for customer..."
                    required
                    className="adm-form-input"
                  />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" onClick={closeModal} className="adm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={actionProcessing} className="adm-btn-danger">
                  {actionProcessing ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: WAREHOUSE INSPECTION & INVENTORY CLASSIFICATION   */}
      {/* ========================================================= */}
      {actionType === 'INSPECT' && activeItem && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-card">
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Inspect Condition & Inventory Classification</h3>
              <button onClick={closeModal} className="adm-modal-close">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleExecuteAction}>
              <div className="adm-modal-body">
                <div style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#8A704C', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Critical Inventory Intelligence Rule
                  </div>
                  <p style={{ fontSize: '12px', color: '#111827', margin: 0, lineHeight: 1.5 }}>
                    Stock level is <strong>strictly updated only if classified as SELLABLE</strong>. Damaged, Defective, and Quarantine garments will NOT increase active catalog stock.
                  </p>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Garment Condition Assessment *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {[
                      {
                        val: 'SELLABLE',
                        title: 'Sellable (Pristine)',
                        desc: 'Tags intact, unworn, clean. Restocks variant inventory immediately.',
                        color: '#166534',
                        bg: '#DCFCE7',
                      },
                      {
                        val: 'DAMAGED',
                        title: 'Damaged (Scrap)',
                        desc: 'Torn, soiled, or altered by customer. Written off to salvage.',
                        color: '#991B1B',
                        bg: '#FEE2E2',
                      },
                      {
                        val: 'DEFECTIVE',
                        title: 'Defective (Factory)',
                        desc: 'Manufacturing defect or seam flaw. Logged to vendor defect queue.',
                        color: '#B45309',
                        bg: '#FEF3C7',
                      },
                      {
                        val: 'QUARANTINE',
                        title: 'Quarantine (Hold)',
                        desc: 'Needs specialized dry cleaning or inspection review before decision.',
                        color: '#4338CA',
                        bg: '#E0E7FF',
                      },
                    ].map((c) => {
                      const isSelected = condition === c.val;
                      return (
                        <div
                          key={c.val}
                          onClick={() => setCondition(c.val as any)}
                          style={{
                            border: `2px solid ${isSelected ? c.color : '#E5E7EB'}`,
                            borderRadius: '6px',
                            padding: '10px',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? c.bg : '#FFFFFF',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: c.color }}>
                              {c.title}
                            </span>
                            {isSelected && <Check size={14} color={c.color} />}
                          </div>
                          <p style={{ fontSize: '11px', color: '#6B7280', margin: 0, lineHeight: 1.35 }}>
                            {c.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Inspector Name</label>
                  <input
                    type="text"
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    className="adm-form-input"
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Inspection Notes & Findings</label>
                  <textarea
                    rows={2}
                    value={inspectionNotes}
                    onChange={(e) => setInspectionNotes(e.target.value)}
                    placeholder="Enter fabric condition, odor, tag status, packaging observations..."
                    className="adm-form-input"
                  />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" onClick={closeModal} className="adm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={actionProcessing} className="adm-btn-primary">
                  {actionProcessing ? 'Recording Inspection...' : 'Submit Inspection & Update Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: DISBURSE REFUND                                  */}
      {/* ========================================================= */}
      {actionType === 'REFUND' && activeItem && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-card">
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Disburse Customer Refund</h3>
              <button onClick={closeModal} className="adm-modal-close">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleExecuteAction}>
              <div className="adm-modal-body">
                <p style={{ fontSize: '13px', color: '#595F69', marginBottom: '16px' }}>
                  Issue refund for Order <strong>#{activeItem.orderNumber}</strong> ({activeItem.userName}).
                </p>

                <div className="adm-form-group">
                  <label className="adm-form-label">Refund Amount (in ₹)</label>
                  <input
                    type="number"
                    value={refundAmountPaise / 100}
                    onChange={(e) => setRefundAmountPaise(Math.max(0, Number(e.target.value)) * 100)}
                    required
                    className="adm-form-input"
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Disbursement Method</label>
                  <select
                    value={refundMethod}
                    onChange={(e) => setRefundMethod(e.target.value)}
                    className="adm-form-input"
                  >
                    <option value="original_source">Original Source Payment Method (Razorpay / Card / UPI)</option>
                    <option value="bank_transfer">Direct NEFT / IMPS Bank Transfer (for COD)</option>
                    <option value="store_credit">Instant Atelier Store Credit Wallet</option>
                  </select>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Gateway Transaction Reference ID</label>
                  <input
                    type="text"
                    value={refundTxnId}
                    onChange={(e) => setRefundTxnId(e.target.value)}
                    placeholder="e.g. RFND-91823901"
                    required
                    className="adm-form-input"
                  />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" onClick={closeModal} className="adm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={actionProcessing} className="adm-btn-primary">
                  {actionProcessing ? 'Processing...' : 'Disburse & Close Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: DISPATCH REPLACEMENT PIECE                       */}
      {/* ========================================================= */}
      {actionType === 'REPLACEMENT' && activeItem && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-card">
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Dispatch Replacement Piece</h3>
              <button onClick={closeModal} className="adm-modal-close">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleExecuteAction}>
              <div className="adm-modal-body">
                <p style={{ fontSize: '13px', color: '#595F69', marginBottom: '16px' }}>
                  Dispatching replacement item for <strong>{activeItem.item.name}</strong> (Target Size:{' '}
                  <strong>{activeItem.exchangePreference?.size || activeItem.item.size}</strong>).
                </p>

                <div className="adm-form-group">
                  <label className="adm-form-label">Express Courier Partner</label>
                  <select
                    value={replacementCourier}
                    onChange={(e) => setReplacementCourier(e.target.value)}
                    className="adm-form-input"
                  >
                    <option value="BlueDart Express">BlueDart Express</option>
                    <option value="Delhivery Surface">Delhivery Surface</option>
                    <option value="DTDC Air">DTDC Air</option>
                  </select>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Replacement Tracking AWB Number</label>
                  <input
                    type="text"
                    value={replacementAwb}
                    onChange={(e) => setReplacementAwb(e.target.value)}
                    placeholder="e.g. RPL-198273"
                    required
                    className="adm-form-input"
                  />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" onClick={closeModal} className="adm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={actionProcessing} className="adm-btn-primary">
                  {actionProcessing ? 'Dispatching...' : 'Dispatch Replacement Garment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 6: AUDIT TRAIL VIEWER                                */}
      {/* ========================================================= */}
      {actionType === 'AUDIT' && activeItem && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-card" style={{ maxWidth: '580px' }}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Return Lifecycle Audit Trail</h3>
              <button onClick={closeModal} className="adm-modal-close">
                <X size={16} />
              </button>
            </div>

            <div className="adm-modal-body" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>
                  Order #{activeItem.orderNumber} • Return #{activeItem._id.slice(-6).toUpperCase()}
                </span>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0' }}>
                  Item: {activeItem.item.name} ({activeItem.item.color}, {activeItem.item.size})
                </p>
              </div>

              {(!activeItem.auditLog || activeItem.auditLog.length === 0) ? (
                <p style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>
                  No historical audit entries logged yet.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '16px', borderLeft: '2px solid #E5E7EB' }}>
                  {activeItem.auditLog.map((log, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: '-23px',
                          top: '2px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: '#C5A869',
                          border: '2px solid #FFFFFF',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 700, fontSize: '12px', color: '#111827' }}>
                          {log.action} ({log.status})
                        </span>
                        <span style={{ fontSize: '10px', color: '#9CA3AF' }}>
                          {new Date(log.timestamp).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#8A704C', fontWeight: 600 }}>
                        Actor: {log.performedBy}
                      </span>
                      {log.notes && (
                        <p style={{ fontSize: '12px', color: '#4B5563', margin: '4px 0 0', lineHeight: 1.4 }}>
                          {log.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="adm-modal-footer">
              <button type="button" onClick={closeModal} className="adm-btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 7: CUSTOMER UPLOADED PROOF PHOTOS                   */}
      {/* ========================================================= */}
      {actionType === 'PHOTOS' && activeItem && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-card" style={{ maxWidth: '640px' }}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Customer Submitted Inspection Photos</h3>
              <button onClick={closeModal} className="adm-modal-close">
                <X size={16} />
              </button>
            </div>

            <div className="adm-modal-body">
              <p style={{ fontSize: '12px', color: '#595F69', marginBottom: '12px' }}>
                Supporting images uploaded by customer for reason: <strong>{activeItem.reason}</strong>
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                {activeItem.photos?.map((photoUrl, idx) => (
                  <a key={idx} href={photoUrl} target="_blank" rel="noreferrer" style={{ display: 'block', borderRadius: '6px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                    <img src={photoUrl} alt={`Proof ${idx + 1}`} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  </a>
                ))}
              </div>
            </div>

            <div className="adm-modal-footer">
              <button type="button" onClick={closeModal} className="adm-btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLING */}
      <style dangerouslySetInnerHTML={{ __html: `
        .adm-returns-container {
          padding: 24px clamp(16px, 3vw, 36px) 64px;
          background-color: #F8F9FA;
          min-height: 100vh;
          font-family: var(--font-body, -apple-system, BlinkMacSystemFont, sans-serif);
        }

        .adm-returns-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .adm-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .adm-kpi-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .adm-kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .adm-kpi-title {
          font-size: 11px;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .adm-kpi-val {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }

        .adm-kpi-sub {
          font-size: 10px;
          color: #9CA3AF;
        }

        .adm-filter-bar {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 14px 16px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .adm-status-tabs {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
          white-space: nowrap;
        }

        .adm-status-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 9999px;
          background: #F3F4F6;
          border: 1px solid transparent;
          color: #4B5563;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .adm-status-tab-btn:hover {
          background: #E5E7EB;
          color: #111827;
        }

        .adm-status-tab-btn.is-active {
          background: #111827;
          color: #FFFFFF;
        }

        .adm-tab-pill {
          padding: 1px 6px;
          border-radius: 10px;
          background: rgba(0,0,0,0.08);
          font-size: 10px;
        }

        .adm-status-tab-btn.is-active .adm-tab-pill {
          background: rgba(255,255,255,0.25);
          color: #FFFFFF;
        }

        .adm-filter-controls-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .adm-search-box {
          position: relative;
          flex: 1;
          min-width: 220px;
        }

        .adm-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
        }

        .adm-filter-input {
          width: 100%;
          padding: 7px 10px 7px 30px;
          font-size: 12px;
          border: 1px solid #D1D5DB;
          border-radius: 4px;
          outline: none;
          box-sizing: border-box;
        }

        .adm-filter-input:focus {
          border-color: #111827;
        }

        .adm-clear-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9CA3AF;
        }

        .adm-filter-select {
          padding: 7px 10px;
          font-size: 12px;
          border: 1px solid #D1D5DB;
          border-radius: 4px;
          background: #FFFFFF;
          color: #374151;
          outline: none;
        }

        .adm-table-wrap {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          overflow-x: auto;
        }

        .adm-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          text-align: left;
        }

        .adm-table th {
          background: #F9FAFB;
          color: #4B5563;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 12px 14px;
          border-bottom: 1px solid #E5E7EB;
          white-space: nowrap;
        }

        .adm-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #F3F4F6;
          vertical-align: middle;
        }

        .adm-table tr:hover td {
          background-color: #FAFAFA;
        }

        .adm-table-action-btn {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .adm-table-action-btn.is-approve {
          background: #111827;
          color: #FFFFFF;
        }
        .adm-table-action-btn.is-approve:hover {
          background: #000000;
        }

        .adm-table-action-btn.is-reject {
          background: #FFFFFF;
          color: #DC2626;
          border-color: #FCA5A5;
        }
        .adm-table-action-btn.is-reject:hover {
          background: #FEE2E2;
        }

        .adm-table-action-btn.is-transit {
          background: #F3E8FF;
          color: #6B21A8;
          border-color: #E9D5FF;
        }

        .adm-table-action-btn.is-receive {
          background: #ECFDF5;
          color: #065F46;
          border-color: #A7F3D0;
        }

        .adm-table-action-btn.is-inspect {
          background: #C5A869;
          color: #FFFFFF;
        }
        .adm-table-action-btn.is-inspect:hover {
          background: #A88B4E;
        }

        .adm-table-action-btn.is-refund {
          background: #166534;
          color: #FFFFFF;
        }

        .adm-table-action-btn.is-replacement {
          background: #0369A1;
          color: #FFFFFF;
        }

        .adm-table-action-btn.is-complete {
          background: #334155;
          color: #FFFFFF;
        }

        .adm-table-action-btn.is-ghost {
          background: #F3F4F6;
          color: #4B5563;
          border-color: #E5E7EB;
        }

        .adm-btn-primary {
          background: #111827;
          color: #FFFFFF;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .adm-btn-secondary {
          background: #FFFFFF;
          color: #374151;
          border: 1px solid #D1D5DB;
          padding: 7px 14px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .adm-btn-danger {
          background: #DC2626;
          color: #FFFFFF;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Modals */
        .adm-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
        }

        .adm-modal-card {
          background: #FFFFFF;
          border-radius: 8px;
          width: 100%;
          maxWidth: 520px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .adm-modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .adm-modal-title {
          font-family: var(--font-display, serif);
          font-size: 17px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .adm-modal-close {
          background: none;
          border: none;
          color: #9CA3AF;
          cursor: pointer;
        }

        .adm-modal-body {
          padding: 20px;
        }

        .adm-modal-footer {
          padding: 12px 20px;
          background: #F9FAFB;
          border-top: 1px solid #E5E7EB;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .adm-form-group {
          margin-bottom: 14px;
        }

        .adm-form-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .adm-form-input {
          width: 100%;
          padding: 8px 12px;
          font-size: 13px;
          border: 1px solid #D1D5DB;
          border-radius: 4px;
          box-sizing: border-box;
          outline: none;
        }

        .adm-form-input:focus {
          border-color: #111827;
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}

