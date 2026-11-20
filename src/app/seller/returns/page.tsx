'use client';

import React, { useState, useEffect } from 'react';
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
    price: number;
    sku?: string;
  };
  type: 'RETURN' | 'EXCHANGE';
  reason: string;
  details?: string;
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
    | 'REFUNDED'
    | 'EXCHANGE_SHIPPED'
    | 'COMPLETED';
  rejectionReason?: string;
  reverseCourier?: {
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    scheduledPickupDate?: string;
  };
  inventoryRestocked: boolean;
  restockedAt?: string;
  refund?: {
    amount: number;
    status: string;
    transactionId?: string;
    refundedAt?: string;
  };
  slaDeadline: string;
  createdAt: string;
}

export default function SellerReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequestItem[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    actionRequired: 0,
    activePickup: 0,
    completed: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTION_REQUIRED' | 'ACTIVE_PICKUP' | 'COMPLETED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Decision Modal State
  const [inspectModalItem, setInspectModalItem] = useState<ReturnRequestItem | null>(null);
  const [sellerCondition, setSellerCondition] = useState<'SELLABLE' | 'DAMAGED' | 'DEFECTIVE' | 'QUARANTINE'>('SELLABLE');
  const [sellerInspectionNotes, setSellerInspectionNotes] = useState('');
  const [rejectModalItem, setRejectModalItem] = useState<ReturnRequestItem | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [actionProcessing, setActionProcessing] = useState(false);
  const [actionBanner, setActionBanner] = useState<string | null>(null);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/seller/returns?status=${activeTab}`);
      if (res.ok) {
        const data = await res.json();
        setReturns(data.returns || []);
        if (data.counts) setCounts(data.counts);
      }
    } catch (err) {
      console.error('Failed to load seller returns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [activeTab]);

  // Handle Approve & Schedule Reverse Pickup
  const handleApprove = async (ret: ReturnRequestItem) => {
    setActionProcessing(true);
    try {
      const res = await fetch('/api/seller/returns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnId: ret._id,
          action: 'APPROVE',
          courierName: 'Delhivery Reverse Logistics',
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setActionBanner(json.message);
        await fetchReturns();
        setTimeout(() => setActionBanner(null), 5000);
      } else {
        alert(json.error || 'Failed to approve return');
      }
    } catch (err) {
      console.error('Approve return error:', err);
    } finally {
      setActionProcessing(false);
    }
  };

  // Handle Inspect & Restock Inventory
  const handleConfirmRestock = async () => {
    if (!inspectModalItem) return;
    setActionProcessing(true);
    try {
      const res = await fetch('/api/seller/returns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnId: inspectModalItem._id,
          action: 'INSPECT',
          condition: sellerCondition,
          inspectionNotes: sellerInspectionNotes,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setActionBanner(json.message);
        setInspectModalItem(null);
        await fetchReturns();
        setTimeout(() => setActionBanner(null), 6000);
      } else {
        alert(json.error || 'Failed to complete inspection and restock.');
      }
    } catch (err) {
      console.error('Restock error:', err);
    } finally {
      setActionProcessing(false);
    }
  };

  // Handle Reject Return Request
  const handleConfirmReject = async () => {
    if (!rejectModalItem || !rejectReasonInput.trim()) {
      alert('Please enter a rejection reason.');
      return;
    }
    setActionProcessing(true);
    try {
      const res = await fetch('/api/seller/returns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnId: rejectModalItem._id,
          action: 'REJECT',
          rejectionReason: rejectReasonInput,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setActionBanner(json.message);
        setRejectModalItem(null);
        setRejectReasonInput('');
        await fetchReturns();
        setTimeout(() => setActionBanner(null), 5000);
      } else {
        alert(json.error || 'Failed to reject return');
      }
    } catch (err) {
      console.error('Reject return error:', err);
    } finally {
      setActionProcessing(false);
    }
  };

  const filteredReturns = returns.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      r.orderNumber.toLowerCase().includes(q) ||
      r.userName.toLowerCase().includes(q) ||
      r.item.name.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
              fontSize: '28px',
              fontWeight: 700,
              color: '#1C1C1A',
              margin: '0 0 6px',
            }}
          >
            Returns & Exchanges Center
          </h1>
          <p style={{ color: '#68645C', fontSize: '13px', margin: 0 }}>
            Manage customer returns, approve doorstep reverse collections within 48h, and restock verified pieces into active inventory.
          </p>
        </div>

        <button
          onClick={fetchReturns}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #DDD6C8',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            color: '#1C1C1A',
          }}
        >
          <RefreshCw size={14} color="#B49A68" />
          <span>Refresh Requests</span>
        </button>
      </div>

      {/* Action Notification Banner */}
      {actionBanner && (
        <div
          style={{
            backgroundColor: '#E8F5E9',
            border: '1px solid #A5D6A7',
            color: '#1B5E20',
            padding: '14px 20px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} color="#2E7D32" />
          <span>{actionBanner}</span>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #E8E2D6' }}>
          <div style={{ fontSize: '12px', color: '#68645C', fontWeight: 600, marginBottom: '6px' }}>Action Required (&lt;48h)</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: counts.actionRequired > 0 ? '#C62828' : '#1C1C1A' }}>
            {counts.actionRequired}
          </div>
          <div style={{ fontSize: '11px', color: '#8C857B', marginTop: '4px' }}>Awaiting merchant approval</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #E8E2D6' }}>
          <div style={{ fontSize: '12px', color: '#68645C', fontWeight: 600, marginBottom: '6px' }}>Reverse Pickup Active</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#1565C0' }}>{counts.activePickup}</div>
          <div style={{ fontSize: '11px', color: '#8C857B', marginTop: '4px' }}>Courier in-transit to warehouse</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #E8E2D6' }}>
          <div style={{ fontSize: '12px', color: '#68645C', fontWeight: 600, marginBottom: '6px' }}>Restocked & Refunded</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#2E7D32' }}>{counts.completed}</div>
          <div style={{ fontSize: '11px', color: '#8C857B', marginTop: '4px' }}>Inventory updated & ledger settled</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #E8E2D6' }}>
          <div style={{ fontSize: '12px', color: '#68645C', fontWeight: 600, marginBottom: '6px' }}>Total Return Requests</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#1C1C1A' }}>{counts.total}</div>
          <div style={{ fontSize: '11px', color: '#8C857B', marginTop: '4px' }}>All-time customer requests</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E8E2D6',
          padding: '16px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Requests', count: counts.total },
            { id: 'ACTION_REQUIRED', label: 'Action Required', count: counts.actionRequired },
            { id: 'ACTIVE_PICKUP', label: 'Reverse Pickup', count: counts.activePickup },
            { id: 'COMPLETED', label: 'Restocked & Closed', count: counts.completed },
            { id: 'REJECTED', label: 'Declined', count: counts.rejected },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: active ? 600 : 500,
                  border: active ? '1px solid #1C1C1A' : '1px solid #E8E2D6',
                  backgroundColor: active ? '#1C1C1A' : '#F8F6F0',
                  color: active ? '#FAF8F5' : '#68645C',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    backgroundColor: active ? '#B49A68' : '#E8E2D6',
                    color: active ? '#FAF8F5' : '#1C1C1A',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '10px',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} color="#68645C" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search order #, customer, item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 34px',
              borderRadius: '6px',
              border: '1px solid #DDD6C8',
              fontSize: '12px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Return Requests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D6' }}>
            <p style={{ color: '#68645C', fontSize: '14px' }}>Loading returns and dispute requests...</p>
          </div>
        ) : filteredReturns.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E8E2D6',
            }}
          >
            <RotateCcw size={36} color="#B49A68" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1C1C1A', margin: '0 0 6px' }}>
              No Return Requests in this Category
            </h4>
            <p style={{ fontSize: '13px', color: '#68645C', margin: 0 }}>
              All customer orders are currently fulfilled with zero outstanding disputes.
            </p>
          </div>
        ) : (
          filteredReturns.map((ret) => {
            const isPendingAction = ret.status === 'REQUESTED';
            const isPickupActive = ['APPROVED', 'PICKUP_SCHEDULED', 'IN_TRANSIT'].includes(ret.status);
            const isRestocked = ['RECEIVED', 'REFUNDED', 'COMPLETED'].includes(ret.status);
            const isRejected = ret.status === 'REJECTED';

            const slaHoursRemaining = Math.max(
              0,
              Math.round((new Date(ret.slaDeadline).getTime() - Date.now()) / (1000 * 60 * 60))
            );

            return (
              <div
                key={ret._id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: isPendingAction ? '2px solid #B49A68' : '1px solid #E8E2D6',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', borderBottom: '1px solid #F0ECE4', paddingBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        backgroundColor: ret.type === 'EXCHANGE' ? '#E1F5FE' : '#FFF3E0',
                        color: ret.type === 'EXCHANGE' ? '#0277BD' : '#E65100',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {ret.type === 'EXCHANGE' ? '🔄 SIZE EXCHANGE' : '📦 RETURN FOR REFUND'}
                    </span>

                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C1C1A' }}>
                      Order #{ret.orderNumber}
                    </span>

                    <span style={{ fontSize: '12px', color: '#8C857B' }}>
                      Filed {new Date(ret.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Status Badge & 48h SLA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isPendingAction && (
                      <span
                        style={{
                          backgroundColor: '#FFF8E1',
                          color: '#B78103',
                          border: '1px solid #FFE082',
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Clock size={12} /> Response SLA: {slaHoursRemaining}h remaining
                      </span>
                    )}

                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: isRestocked
                          ? '#E8F5E9'
                          : isPickupActive
                          ? '#E3F2FD'
                          : isRejected
                          ? '#FFEBEE'
                          : '#FFF3E0',
                        color: isRestocked
                          ? '#2E7D32'
                          : isPickupActive
                          ? '#1565C0'
                          : isRejected
                          ? '#C62828'
                          : '#E65100',
                      }}
                    >
                      {ret.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Body: Item Details + Customer Note */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {/* Left: Product Snapshot */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <img
                      src={ret.item.image}
                      alt={ret.item.name}
                      style={{ width: '64px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E8E2D6' }}
                    />
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#1C1C1A', marginBottom: '4px' }}>
                        {ret.item.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#68645C', marginBottom: '4px' }}>
                        Color: {ret.item.color || 'Standard'} • Size: <strong>{ret.item.size}</strong> • Qty: {ret.item.quantity}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C1C1A' }}>
                        ₹{(((ret.item.price || 0) * ret.item.quantity) / 100).toLocaleString('en-IN')}
                      </div>

                      {/* Exchange Specific Pill */}
                      {ret.type === 'EXCHANGE' && ret.exchangePreference?.size && (
                        <div style={{ fontSize: '11px', color: '#0277BD', marginTop: '6px', fontWeight: 600 }}>
                          → Requested Replacement Size: <strong>{ret.exchangePreference.size}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle: Reason & Customer Explanation */}
                  <div style={{ backgroundColor: '#F8F6F0', padding: '14px', borderRadius: '8px', border: '1px solid #E8E2D6' }}>
                    <div style={{ fontSize: '11px', color: '#8C857B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Customer Return Reason
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1A', marginBottom: '6px' }}>
                      "{ret.reason}"
                    </div>
                    {ret.details && (
                      <div style={{ fontSize: '12px', color: '#68645C', fontStyle: 'italic', lineHeight: 1.4 }}>
                        {ret.details}
                      </div>
                    )}
                    <div style={{ fontSize: '11px', color: '#8C857B', marginTop: '8px' }}>
                      Customer: <strong>{ret.userName}</strong> ({ret.userEmail})
                    </div>
                  </div>

                  {/* Right: Reverse Pickup & Restock Status Card */}
                  <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #E8E2D6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#8C857B', fontWeight: 600, textTransform: 'uppercase' }}>
                      Fulfillment Status
                    </div>

                    {ret.reverseCourier?.trackingNumber ? (
                      <div style={{ fontSize: '12px', color: '#1565C0', fontWeight: 600 }}>
                        🚚 {ret.reverseCourier.courierName}
                        <div style={{ fontSize: '11px', color: '#68645C', fontWeight: 400 }}>
                          AWB: {ret.reverseCourier.trackingNumber}
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '12px', color: '#8C857B' }}>No courier assigned yet</div>
                    )}

                    {ret.inventoryRestocked ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2E7D32', fontSize: '12px', fontWeight: 600, marginTop: '6px' }}>
                        <Boxes size={13} />
                        <span>Inventory Restocked (+{ret.item.quantity} to Size {ret.item.size})</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: '11px', color: '#8C857B', marginTop: '4px' }}>
                        Stock not yet restored
                      </div>
                    )}

                    {ret.refund?.transactionId && (
                      <div style={{ fontSize: '11px', color: '#2E7D32', marginTop: '4px' }}>
                        Refund Settled: Ref {ret.refund.transactionId}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #F0ECE4' }}>
                  {/* Action 1: Pending Approval -> Approve or Reject */}
                  {isPendingAction && (
                    <>
                      <button
                        onClick={() => {
                          setRejectModalItem(ret);
                          setRejectReasonInput('');
                        }}
                        disabled={actionProcessing}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: '#FFF0F0',
                          color: '#C62828',
                          border: '1px solid #FFCDD2',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={13} /> Decline Return
                      </button>

                      <button
                        onClick={() => handleApprove(ret)}
                        disabled={actionProcessing}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 18px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: '#1C1C1A',
                          color: '#FAF8F5',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        }}
                      >
                        <Truck size={14} color="#E4D5B7" />
                        <span>Approve & Schedule Reverse Pickup</span>
                      </button>
                    </>
                  )}

                  {/* Action 2: Reverse Pickup Active -> Inspect & Restock Inventory */}
                  {isPickupActive && (
                    <button
                      onClick={() => setInspectModalItem(ret)}
                      disabled={actionProcessing}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 20px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: '#2E7D32',
                        color: '#FFFFFF',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(46, 125, 50, 0.25)',
                      }}
                    >
                      <Boxes size={14} />
                      <span>Inspect Item & Restock Inventory</span>
                    </button>
                  )}

                  {/* Action 3: Restocked & Completed Badge */}
                  {isRestocked && (
                    <span style={{ fontSize: '12px', color: '#2E7D32', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Return Cycle Fully Resolved
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: Inspect Item & Restock Inventory Confirmation */}
      {inspectModalItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Boxes size={24} color="#2E7D32" />
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
                fontSize: '20px',
                fontWeight: 600,
                color: '#1C1C1A',
                textAlign: 'center',
                margin: '0 0 8px',
              }}
            >
              Warehouse Inspection & Inventory Classification
            </h3>

            <p style={{ fontSize: '13px', color: '#68645C', textAlign: 'center', lineHeight: 1.5, margin: '0 0 16px' }}>
              Inspect returned piece <strong>{inspectModalItem.item.name}</strong> (Size: {inspectModalItem.item.size}). Stock is only increased if verified as Sellable.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '8px' }}>
                Classification Condition *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { id: 'SELLABLE', label: 'Sellable (Restock Stock)', desc: 'Unworn, tags intact. Restocks active catalog.', color: '#166534', bg: '#DCFCE7' },
                  { id: 'DAMAGED', label: 'Damaged (No Restock)', desc: 'Soiled, torn, or washed. Scrapped to salvage.', color: '#991B1B', bg: '#FEE2E2' },
                  { id: 'DEFECTIVE', label: 'Defective (No Restock)', desc: 'Fabric flaw. Vendor defect report.', color: '#B45309', bg: '#FEF3C7' },
                  { id: 'QUARANTINE', label: 'Quarantine (Hold)', desc: 'Held for dry cleaning / repair.', color: '#4338CA', bg: '#E0E7FF' },
                ].map((c) => {
                  const isSel = sellerCondition === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSellerCondition(c.id as any)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: `2px solid ${isSel ? c.color : '#E5E7EB'}`,
                        backgroundColor: isSel ? c.bg : '#FFFFFF',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 700, color: c.color, marginBottom: '2px' }}>
                        {c.label}
                      </div>
                      <div style={{ fontSize: '10px', color: '#6B7280', lineHeight: 1.3 }}>
                        {c.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '6px' }}>
                Inspection Remarks
              </label>
              <textarea
                rows={2}
                value={sellerInspectionNotes}
                onChange={(e) => setSellerInspectionNotes(e.target.value)}
                placeholder="Condition observations, tags, packaging..."
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #DDD6C8',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setInspectModalItem(null)}
                disabled={actionProcessing}
                style={{
                  padding: '10px 18px',
                  borderRadius: '6px',
                  border: '1px solid #DDD6C8',
                  backgroundColor: '#FFFFFF',
                  color: '#68645C',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmRestock}
                disabled={actionProcessing}
                style={{
                  padding: '10px 22px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: sellerCondition === 'SELLABLE' ? '#2E7D32' : '#111827',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: actionProcessing ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {actionProcessing ? 'Processing Inspection...' : `Confirm Inspection (${sellerCondition})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Reject Return Request */}
      {rejectModalItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1C1C1A', margin: '0 0 8px' }}>
              Decline Return Request
            </h3>
            <p style={{ fontSize: '13px', color: '#68645C', margin: '0 0 16px' }}>
              Provide a clear reason for the customer explaining why this piece is ineligible for return.
            </p>

            <textarea
              rows={3}
              value={rejectReasonInput}
              onChange={(e) => setRejectReasonInput(e.target.value)}
              placeholder="e.g. Returned piece has missing security tags or exceeds the 7-day window..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #DDD6C8',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit',
                marginBottom: '20px',
              }}
            />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '6px',
                  border: '1px solid #DDD6C8',
                  backgroundColor: '#FFFFFF',
                  color: '#68645C',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={actionProcessing || !rejectReasonInput.trim()}
                style={{
                  padding: '9px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#C62828',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: actionProcessing || !rejectReasonInput.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {actionProcessing ? 'Submitting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
