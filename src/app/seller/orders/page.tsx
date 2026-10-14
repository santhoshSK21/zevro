'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PackageCheck,
  Search,
  RefreshCw,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  X,
  MapPin,
  Phone,
  User,
  CreditCard,
  Printer
} from 'lucide-react';

interface OrderItem {
  _id: string;
  orderId: string;
  createdAt: string;
  shippingAddress: {
    name: string;
    phone: string;
    email: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    priceAtPurchase: number;
    size?: string;
    color?: string;
    sku?: string;
    image?: string;
  }>;
  pricing: {
    total: number;
    subtotal: number;
  };
  payment: {
    method: string;
    status: string;
  };
  shipping: {
    courierName?: string;
    awbCode?: string;
  };
  status: string;
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [trackingNo, setTrackingNo] = useState('');
  const [courier, setCourier] = useState('Shiprocket');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/seller/orders?q=${encodeURIComponent(search)}&status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/seller/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: trackingNo || undefined,
          courierName: courier || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order');

      showToast(`Order status updated to ${newStatus.toUpperCase()}`);
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderId === orderId)) {
        setSelectedOrder(data.order);
      }
      fetchOrders();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return { label: 'Delivered', bg: '#E8F5E9', color: '#2E7D32', icon: CheckCircle2 };
      case 'shipped':
      case 'out-for-delivery':
        return { label: 'In Transit', bg: '#E3F2FD', color: '#1565C0', icon: Truck };
      case 'cancelled':
        return { label: 'Cancelled', bg: '#FDECEA', color: '#C62828', icon: XCircle };
      default:
        return { label: status || 'Processing', bg: '#FFF3E0', color: '#E65100', icon: Clock };
    }
  };

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

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 600, margin: '0 0 6px', letterSpacing: '-0.02em', color: '#1C1C1A' }}>
            Customer Orders & Fulfillment
          </h1>
          <p style={{ color: '#68645C', fontSize: '14px', margin: 0 }}>
            Process customer orders, print packing slips, and assign courier dispatch labels.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            padding: '9px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#1C1C1A',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} /> Refresh Orders
        </button>
      </div>

      {/* Filters and Search */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8E2D6',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#68645C" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
            placeholder="Search by Order ID or customer name..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: '#1C1C1A',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'placed', label: 'Action Required' },
            { id: 'shipped', label: 'In Transit' },
            { id: 'delivered', label: 'Delivered' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              style={{
                background: statusFilter === st.id ? '#1C1C1A' : 'transparent',
                color: statusFilter === st.id ? '#FAF8F5' : '#68645C',
                border: statusFilter === st.id ? 'none' : '1px solid #E8E2D6',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8E2D6',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
        }}
      >
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#68645C' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid #E8E2D6',
                borderTopColor: '#1C1C1A',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px',
              }}
            />
            Loading merchant orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#68645C' }}>
            <PackageCheck size={40} color="#B49A68" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1C1C1A' }}>No customer orders found</div>
            <p style={{ fontSize: '13px', margin: '4px 0 0' }}>Orders placed on the storefront will appear here.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr
                style={{
                  background: '#F8F6F0',
                  borderBottom: '1px solid #E8E2D6',
                  color: '#68645C',
                  textTransform: 'uppercase',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                }}
              >
                <th style={{ padding: '14px 20px' }}>Order ID & Date</th>
                <th style={{ padding: '14px 20px' }}>Customer & Destination</th>
                <th style={{ padding: '14px 20px' }}>Items Summary</th>
                <th style={{ padding: '14px 20px' }}>Order Value</th>
                <th style={{ padding: '14px 20px' }}>Fulfillment Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const badge = getStatusBadge(o.status);
                const BadgeIcon = badge.icon;
                const totalUnits = (o.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0);

                return (
                  <tr
                    key={o._id}
                    style={{
                      borderBottom: '1px solid #F0ECE4',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 600, color: '#1C1C1A', fontSize: '14px' }}>
                        {o.orderId || o._id.slice(-8).toUpperCase()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#68645C', marginTop: '2px' }}>
                        {new Date(o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 600, color: '#1C1C1A' }}>
                        {o.shippingAddress?.name || 'Customer'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#68645C', marginTop: '2px' }}>
                        {o.shippingAddress?.city}, {o.shippingAddress?.pincode}
                      </div>
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 500 }}>
                        {o.items?.[0]?.name || 'Apparel Item'}
                        {o.items?.length > 1 && ` + ${o.items.length - 1} more`}
                      </div>
                      <div style={{ fontSize: '11px', color: '#68645C' }}>{totalUnits} units total</div>
                    </td>

                    <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                      ₹{((o.pricing?.total || 0) / 100).toLocaleString('en-IN')}
                    </td>

                    <td style={{ padding: '14px 20px' }}>
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

                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <Link
                          href={`/seller/orders/${o._id}/label`}
                          target="_blank"
                          title="Print Shipping Label & Packing Slip"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: '#F8F6F0',
                            color: '#1C1C1A',
                            border: '1px solid #DDD6C8',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          <Printer size={13} color="#B49A68" />
                          <span>Label</span>
                        </Link>

                        <button
                          onClick={() => setSelectedOrder(o)}
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
                          <Eye size={13} /> Dispatch Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Slide-over Order Details Drawer */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              height: '100%',
              background: '#FFFFFF',
              borderLeft: '1px solid #E8E2D6',
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
                borderBottom: '1px solid #E8E2D6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#F8F6F0',
              }}
            >
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>
                  Order #{selectedOrder.orderId || selectedOrder._id.slice(-8).toUpperCase()}
                </div>
                <div style={{ fontSize: '12px', color: '#68645C' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1C1C1A' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
              {/* Dispatch Action Box */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '10px',
                  background: '#F8F6F0',
                  border: '1px solid #E8E2D6',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1C1C1A' }}>
                    Fulfillment & Dispatch Workflow
                  </div>
                  <Link
                    href={`/seller/orders/${selectedOrder._id}/label`}
                    target="_blank"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      background: '#1C1C1A',
                      color: '#FAF8F5',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <Printer size={13} color="#C5A880" />
                    <span>Print Dispatch Label</span>
                  </Link>
                </div>

                {/* Stepper Status Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E8E2D6' }}>
                  {['placed', 'processing', 'shipped', 'delivered'].map((st, i) => {
                    const stepTitles = ['Placed', 'Packing', 'Shipped', 'Delivered'];
                    const currentStatus = selectedOrder.status?.toLowerCase() || 'placed';
                    const statuses = ['placed', 'processing', 'shipped', 'delivered'];
                    const currentIdx = statuses.indexOf(currentStatus);
                    const isDone = i <= currentIdx;
                    const isCurrent = i === currentIdx;

                    return (
                      <div key={st} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: isDone ? '#1C1C1A' : '#E2E8F0',
                            color: isDone ? '#FAF8F5' : '#64748B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700,
                          }}
                        >
                          {i + 1}
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#1C1C1A' : '#68645C' }}>
                          {stepTitles[i]}
                        </span>
                        {i < 3 && <span style={{ color: '#CBD5E1', margin: '0 4px' }}>→</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Courier & AWB Code Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#1C1C1A', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Courier Partner
                    </label>
                    <select
                      value={courier}
                      onChange={(e) => setCourier(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #DDD6C8', background: '#FFFFFF', fontSize: '12px', outline: 'none' }}
                    >
                      <option value="Blue Dart Express">Blue Dart Express</option>
                      <option value="Delhivery Logistics">Delhivery Logistics</option>
                      <option value="DTDC Air">DTDC Air</option>
                      <option value="India Post SpeedPost">India Post SpeedPost</option>
                      <option value="Shiprocket Direct">Shiprocket Direct</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#1C1C1A', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Tracking AWB Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BLU829301928"
                      value={trackingNo}
                      onChange={(e) => setTrackingNo(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #DDD6C8', background: '#FFFFFF', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '4px' }}>
                  <button
                    disabled={isUpdating}
                    onClick={() => updateOrderStatus(selectedOrder._id, 'processing')}
                    style={{
                      background: '#1C1C1A',
                      color: '#FAF8F5',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    1. Mark as Packing
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => updateOrderStatus(selectedOrder._id, 'shipped')}
                    style={{
                      background: '#1565C0',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    2. Dispatch & Mark Shipped
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => updateOrderStatus(selectedOrder._id, 'delivered')}
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
                    3. Mark Delivered
                  </button>
                </div>
              </div>

              {/* Items in Order */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Ordered Items</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedOrder.items?.map((it, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        border: '1px solid #E8E2D6',
                        borderRadius: '8px',
                        background: '#FAF8F5',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{it.name}</div>
                        <div style={{ fontSize: '11px', color: '#68645C', marginTop: '2px' }}>
                          Size: {it.size || 'Free Size'} | Qty: {it.quantity || 1}
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>
                        ₹{(((it.priceAtPurchase || 0) * (it.quantity || 1)) / 100).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Customer & Delivery Address</div>
                <div
                  style={{
                    padding: '14px',
                    border: '1px solid #E8E2D6',
                    borderRadius: '8px',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: '#1C1C1A',
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{selectedOrder.shippingAddress?.name}</div>
                  <div style={{ color: '#68645C' }}>Phone: {selectedOrder.shippingAddress?.phone}</div>
                  <div style={{ color: '#68645C' }}>
                    {selectedOrder.shippingAddress?.line1} {selectedOrder.shippingAddress?.line2}<br />
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                  </div>
                </div>
              </div>

              {/* Order Total */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  borderTop: '1px solid #E8E2D6',
                  fontSize: '15px',
                  fontWeight: 700,
                }}
              >
                <span>Total Customer Paid:</span>
                <span>₹{((selectedOrder.pricing?.total || 0) / 100).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
