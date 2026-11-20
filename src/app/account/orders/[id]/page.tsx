'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  X,
  ShieldCheck,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  PackageCheck,
  ArrowRight,
} from 'lucide-react';

export default function AccountOrderDetailPage() {
  const [order, setOrder] = useState<any>(null);
  const [returnRequests, setReturnRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Return modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [returnType, setReturnType] = useState<'RETURN' | 'EXCHANGE'>('RETURN');
  const [returnReason, setReturnReason] = useState('Size does not fit (too small)');
  const [exchangeSize, setExchangeSize] = useState('M');
  const [returnNotes, setReturnNotes] = useState('');
  const [returnPhotos, setReturnPhotos] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [returnSuccessMsg, setReturnSuccessMsg] = useState('');

  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const loadOrderAndReturns = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Order not found');
      }
      const data = await res.json();
      setOrder(data);

      // Load return requests for this order
      const retRes = await fetch(`/api/returns?orderId=${id}`);
      if (retRes.ok) {
        const retData = await retRes.json();
        setReturnRequests(retData.returns || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderAndReturns();
  }, [id, router]);

  const handleOpenReturnModal = (item: any) => {
    setSelectedItem(item);
    setReturnType('RETURN');
    setReturnReason('Size does not fit (too small)');
    setExchangeSize(item.size || 'M');
    setReturnNotes('');
    setReturnPhotos([]);
    setReturnSuccessMsg('');
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhoto(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        const res = await fetch('/api/returns/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          setReturnPhotos((prev) => [...prev, data.url]);
        } else {
          alert(data.error || 'Photo upload failed');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading supporting photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setReturnPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !order) return;

    setSubmittingReturn(true);
    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order._id,
          productId: selectedItem.productId?._id || selectedItem.productId,
          itemSku: selectedItem.sku,
          type: returnType,
          resolutionType: returnType === 'EXCHANGE' ? 'REPLACEMENT' : 'REFUND',
          reason: returnReason,
          details: returnNotes,
          exchangePreference: returnType === 'EXCHANGE' ? { size: exchangeSize } : undefined,
          photos: returnPhotos,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error || 'Failed to submit request');
        return;
      }

      setReturnSuccessMsg(json.message);
      await loadOrderAndReturns();
      setTimeout(() => {
        setModalOpen(false);
      }, 2500);
    } catch (err) {
      console.error('Submit return error:', err);
      alert('Network error submitting return.');
    } finally {
      setSubmittingReturn(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--color-ink-muted)' }}>
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--error)', marginBottom: '24px' }}>{error || 'Order not found'}</p>
        <Link href="/account/orders" className="btn btn-ghost">
          BACK TO ORDERS
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <Link
          href="/account/orders"
          className="link-underline"
          style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            marginBottom: '16px',
            display: 'inline-block',
          }}
        >
          ← Back to Orders
        </Link>
        <h1 className="display-serif" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-ink)' }}>
          Order #{order.orderId || order._id.slice(-6).toUpperCase()}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-ink-muted)', marginTop: '8px' }}>
          Placed on{' '}
          {new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Left Column: Items & Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ border: '1px solid var(--color-stone)', padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', margin: 0 }}>
                Ordered Pieces ({order.items?.length || 0})
              </h3>
              <span style={{ fontSize: '12px', color: '#2E7D32', fontWeight: 600 }}>
                ✓ 7-Day Easy Returns Guarantee
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {order.items?.map((item: any, idx: number) => {
                const pId = item.productId?._id?.toString() || item.productId?.toString();
                const returnReq = returnRequests.find(
                  (r) => r.item?.productId?.toString() === pId || r.item?.sku === item.sku
                );

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      borderBottom: idx !== order.items.length - 1 ? '1px solid var(--color-stone)' : 'none',
                      paddingBottom: idx !== order.items.length - 1 ? '24px' : '0',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      <img
                        src={item.image || '/pdp_hero_1.png'}
                        alt={item.name}
                        style={{ width: '90px', height: '110px', objectFit: 'cover', borderRadius: '4px' }}
                      />

                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', margin: '0 0 6px', fontWeight: 600 }}>
                          {item.name}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--color-ink-muted)', margin: '0 0 4px' }}>
                          Color: {item.color} | Size: {item.size} | Qty: {item.quantity}
                        </p>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 600, margin: '0 0 10px', color: '#111827' }}>
                          ₹{(((item.priceAtPurchase || 0) * item.quantity) / 100).toLocaleString('en-IN')}
                        </p>

                        {/* Attribution Pill */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#F8F9FA',
                            border: '1px solid #E5E7EB',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            marginBottom: '12px',
                            fontSize: '11px',
                            color: '#595F69',
                          }}
                        >
                          <span>Fulfilled by: <strong>{item.sellerStoreName || 'ZEVRO Signature Atelier'}</strong></span>
                        </div>

                        {/* Return Request Button (if no return exists) */}
                        {!returnReq && (
                          <div>
                            <button
                              type="button"
                              onClick={() => handleOpenReturnModal(item)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                backgroundColor: '#FFFFFF',
                                color: '#111827',
                                border: '1px solid #D1D5DB',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <RotateCcw size={12} color="#C5A869" />
                              <span>Request Return / Replacement</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dedicated Return & Resolution Status Tracker Card */}
                    {returnReq && (
                      <div
                        style={{
                          backgroundColor: '#F8F9FA',
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                          padding: '16px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '3px',
                                backgroundColor: returnReq.resolutionType === 'REPLACEMENT' ? '#EFF6FF' : '#FEF3C7',
                                color: returnReq.resolutionType === 'REPLACEMENT' ? '#1E40AF' : '#92400E',
                                textTransform: 'uppercase',
                              }}
                            >
                              {returnReq.resolutionType || (returnReq.type === 'EXCHANGE' ? 'REPLACEMENT' : 'RETURN')} REQUEST
                            </span>
                            <span style={{ fontSize: '11px', color: '#6B7280' }}>
                              Ref #{returnReq._id.slice(-6).toUpperCase()}
                            </span>
                          </div>

                          {/* Status Badge */}
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 10px',
                              borderRadius: '4px',
                              backgroundColor:
                                returnReq.status === 'REFUNDED' || returnReq.status === 'COMPLETED'
                                  ? '#DCFCE7'
                                  : returnReq.status === 'REJECTED'
                                  ? '#FEE2E2'
                                  : returnReq.status === 'INSPECTION_PENDING' || returnReq.status === 'REFUND_PENDING'
                                  ? '#FEF3C7'
                                  : '#EFF6FF',
                              color:
                                returnReq.status === 'REFUNDED' || returnReq.status === 'COMPLETED'
                                  ? '#166534'
                                  : returnReq.status === 'REJECTED'
                                  ? '#991B1B'
                                  : returnReq.status === 'INSPECTION_PENDING' || returnReq.status === 'REFUND_PENDING'
                                  ? '#92400E'
                                  : '#1E40AF',
                              border: '1px solid currentColor',
                            }}
                          >
                            {returnReq.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Status Description / Tracking Line */}
                        <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5, marginBottom: '8px' }}>
                          {returnReq.status === 'REQUESTED' && (
                            <p style={{ margin: 0 }}>
                              ⏳ Your request has been logged and is currently under review by our atelier concierge. (Within 48h SLA).
                            </p>
                          )}
                          {returnReq.status === 'APPROVED' && (
                            <p style={{ margin: 0, color: '#1E40AF', fontWeight: 600 }}>
                              ✓ Return approved! We are scheduling doorstep pickup with our reverse logistics partner.
                            </p>
                          )}
                          {returnReq.status === 'PICKUP_SCHEDULED' && (
                            <p style={{ margin: 0, color: '#1E40AF' }}>
                              🚚 Doorstep pickup assigned to <strong>{returnReq.reverseCourier?.courierName || 'Delhivery'}</strong> (AWB:{' '}
                              <strong>{returnReq.reverseCourier?.trackingNumber}</strong>)
                              {returnReq.reverseCourier?.scheduledPickupDate &&
                                ` on ${new Date(returnReq.reverseCourier.scheduledPickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                              . Please keep garment in original packaging.
                            </p>
                          )}
                          {returnReq.status === 'IN_TRANSIT' && (
                            <p style={{ margin: 0, color: '#6B21A8' }}>
                              📦 Package picked up by courier and currently in transit to central warehouse.
                            </p>
                          )}
                          {(returnReq.status === 'RECEIVED' || returnReq.status === 'INSPECTION_PENDING') && (
                            <p style={{ margin: 0, color: '#B45309' }}>
                              🔍 Package safely received at warehouse. Quality inspection of fabric and tags is currently in progress.
                            </p>
                          )}
                          {returnReq.status === 'REFUND_PENDING' && (
                            <p style={{ margin: 0, color: '#B45309', fontWeight: 600 }}>
                              ✓ Quality inspection passed ({returnReq.inspection?.condition || 'Sellable'}). Refund queue initiated.
                            </p>
                          )}
                          {returnReq.status === 'REFUNDED' && (
                            <div style={{ margin: 0, color: '#166534', fontWeight: 600 }}>
                              ✓ Refund of ₹{((returnReq.refund?.amount || (item.priceAtPurchase * item.quantity)) / 100).toLocaleString('en-IN')} has been disbursed back to your {returnReq.refund?.method || 'original source'}
                              {returnReq.refund?.transactionId && ` (Ref: ${returnReq.refund.transactionId})`}.
                            </div>
                          )}
                          {returnReq.status === 'REPLACEMENT_PROCESSING' && (
                            <p style={{ margin: 0, color: '#0369A1', fontWeight: 600 }}>
                              ✂️ Replacement piece (Size: {returnReq.replacement?.size || returnReq.exchangePreference?.size || item.size}) is being prepared and dispatched.
                              {returnReq.replacement?.trackingNumber && ` Carrier: ${returnReq.replacement.courierName} (AWB: ${returnReq.replacement.trackingNumber})`}
                            </p>
                          )}
                          {returnReq.status === 'COMPLETED' && (
                            <p style={{ margin: 0, color: '#166534', fontWeight: 600 }}>
                              ✓ Return & resolution process completed successfully.
                            </p>
                          )}
                          {returnReq.status === 'REJECTED' && (
                            <div style={{ margin: 0, color: '#991B1B' }}>
                              ✕ Return request declined. <strong>Reason:</strong> {returnReq.rejectionReason || 'Item not eligible for return'}
                            </div>
                          )}
                        </div>

                        {/* Reason and customer notes echo */}
                        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '8px', fontSize: '11px', color: '#6B7280', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                          <span>Reason: <strong>{returnReq.reason}</strong></span>
                          {returnReq.photos && returnReq.photos.length > 0 && (
                            <span>{returnReq.photos.length} photo proof attachment(s)</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ border: '1px solid var(--color-stone)', padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '4px' }}>
            <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '24px' }}>
              Order Lifecycle & Tracking
            </h3>
            <div className="tracking-timeline">
              {order.timeline?.map((step: any, idx: number) => (
                <div key={idx} className="timeline-step completed">
                  <div className="timeline-dot completed active">
                    <span style={{ color: 'var(--white)', fontSize: '10px' }}>✓</span>
                  </div>
                  {idx !== order.timeline.length - 1 && <div className="timeline-line" />}
                  <div style={{ paddingLeft: '8px' }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', fontWeight: 600, color: 'var(--color-ink)' }}>
                      {step.status}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)', marginTop: '2px' }}>
                      {step.message}
                    </p>
                    <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                      {new Date(step.timestamp).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Address Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Shipping Address */}
          <div style={{ border: '1px solid var(--color-stone)', padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '4px' }}>
            <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '16px' }}>
              Delivery Destination
            </h3>
            <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{order.shippingAddress?.name}</p>
            <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
              {order.shippingAddress?.line1}
              {order.shippingAddress?.line2 && <><br />{order.shippingAddress.line2}</>}
              <br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginTop: '8px' }}>
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>

          {/* Pricing Breakdown */}
          <div style={{ border: '1px solid var(--color-stone)', padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '4px' }}>
            <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '16px' }}>
              Payment Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-ink-muted)' }}>Subtotal</span>
                <span>₹{((order.pricing?.subtotal || 0) / 100).toLocaleString('en-IN')}</span>
              </div>
              {order.pricing?.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                  <span>Discount</span>
                  <span>-₹{((order.pricing?.discount || 0) / 100).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-ink-muted)' }}>Shipping</span>
                <span>{order.pricing?.shippingCharge === 0 ? 'Complimentary' : `₹${((order.pricing?.shippingCharge || 0) / 100).toLocaleString('en-IN')}`}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--color-stone)', paddingTop: '10px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '15px' }}>
                <span>Total Amount</span>
                <span>₹{((order.pricing?.total || 0) / 100).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB', fontSize: '11px', color: '#6B7280' }}>
              <span>Payment Mode: <strong>{order.payment?.method?.toUpperCase() || 'PREPAID'}</strong></span>
              <br />
              <span>Payment Status: <strong style={{ color: order.payment?.status === 'refunded' ? '#166534' : '#111827' }}>{order.payment?.status?.toUpperCase() || 'PAID'}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RETURN & REPLACEMENT INITIATION MODAL                      */}
      {/* ========================================================= */}
      {modalOpen && selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '540px',
              padding: '28px',
              boxShadow: '0 20px 48px rgba(0,0,0,0.15)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={18} color="#C5A869" />
                <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '18px', margin: 0, fontWeight: 600 }}>
                  Request Return or Size Replacement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X size={18} />
              </button>
            </div>

            {returnSuccessMsg ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={44} color="#166534" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '16px', color: '#166534', margin: '0 0 8px', fontWeight: 600 }}>
                  Request Successfully Submitted
                </h4>
                <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5 }}>
                  {returnSuccessMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReturn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Item Details Recap */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#F8F9FA', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                  <img
                    src={selectedItem.image || '/pdp_hero_1.png'}
                    alt={selectedItem.name}
                    style={{ width: '42px', height: '52px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827', display: 'block' }}>
                      {selectedItem.name}
                    </span>
                    <span style={{ fontSize: '11px', color: '#6B7280' }}>
                      Color: {selectedItem.color} | Current Size: {selectedItem.size} | Qty: {selectedItem.quantity}
                    </span>
                  </div>
                </div>

                {/* Resolution Type Choice */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#111827', display: 'block', marginBottom: '8px' }}>
                    Choose your resolution:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setReturnType('RETURN')}
                      style={{
                        padding: '12px',
                        borderRadius: '6px',
                        border: returnType === 'RETURN' ? '2px solid #111827' : '1px solid #D1D5DB',
                        backgroundColor: returnType === 'RETURN' ? '#F9FAFB' : '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: '#111827',
                        textAlign: 'center',
                      }}
                    >
                      Return for 100% Refund
                    </button>
                    <button
                      type="button"
                      onClick={() => setReturnType('EXCHANGE')}
                      style={{
                        padding: '12px',
                        borderRadius: '6px',
                        border: returnType === 'EXCHANGE' ? '2px solid #111827' : '1px solid #D1D5DB',
                        backgroundColor: returnType === 'EXCHANGE' ? '#F9FAFB' : '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: '#111827',
                        textAlign: 'center',
                      }}
                    >
                      Exchange for Other Size
                    </button>
                  </div>
                </div>

                {/* Reason Dropdown */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#111827', display: 'block', marginBottom: '6px' }}>
                    Reason for {returnType === 'EXCHANGE' ? 'replacement' : 'return'} *
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      fontSize: '13px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Size does not fit (too small)">Size does not fit — too small</option>
                    <option value="Size does not fit (too large)">Size does not fit — too large</option>
                    <option value="Defective or damaged piece">Defective or damaged garment / stitching</option>
                    <option value="Quality/Fabric not as expected">Fabric / embroidery quality not as expected</option>
                    <option value="Received wrong product or color">Received wrong product or color</option>
                    <option value="Item arrived late">Item arrived after event date</option>
                    <option value="Other">Other reasons</option>
                  </select>
                </div>

                {/* Exchange Specific: Requested Size */}
                {returnType === 'EXCHANGE' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#111827', display: 'block', marginBottom: '6px' }}>
                      Select desired replacement size *
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setExchangeSize(sz)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '4px',
                            border: exchangeSize === sz ? '2px solid #111827' : '1px solid #D1D5DB',
                            backgroundColor: exchangeSize === sz ? '#111827' : '#FFFFFF',
                            color: exchangeSize === sz ? '#FFFFFF' : '#111827',
                            fontWeight: 600,
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Description */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#111827', display: 'block', marginBottom: '6px' }}>
                    Detailed notes or feedback (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    placeholder="Provide details about the fit issue, fabric observations, etc..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      fontSize: '13px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Upload Supporting Images */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#111827', display: 'block', marginBottom: '6px' }}>
                    Upload supporting photos (e.g. defect, tag, or fit)
                  </label>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        backgroundColor: '#F3F4F6',
                        border: '1px dashed #9CA3AF',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#374151',
                        cursor: uploadingPhoto ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <Upload size={14} />
                      <span>{uploadingPhoto ? 'Uploading...' : 'Choose Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingPhoto}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {returnPhotos.map((photoUrl, idx) => (
                      <div key={idx} style={{ position: 'relative', width: '48px', height: '48px' }}>
                        <img
                          src={photoUrl}
                          alt="Supporting proof"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            background: '#DC2626',
                            color: '#FFFFFF',
                            borderRadius: '50%',
                            border: 'none',
                            width: '16px',
                            height: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingReturn}
                  style={{
                    backgroundColor: '#111827',
                    color: '#FFFFFF',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: submittingReturn ? 'not-allowed' : 'pointer',
                    marginTop: '8px',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {submittingReturn
                    ? 'Submitting...'
                    : `Submit ${returnType === 'EXCHANGE' ? 'Replacement' : 'Return'} Request`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .tracking-timeline {
          position: relative;
          padding-left: 20px;
        }
        .timeline-step {
          position: relative;
          padding-bottom: 24px;
        }
        .timeline-step:last-child {
          padding-bottom: 0;
        }
        .timeline-dot {
          position: absolute;
          left: -20px;
          top: 0;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--color-stone);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateX(-50%);
        }
        .timeline-dot.completed {
          background-color: var(--color-ink);
        }
        .timeline-dot.active {
          box-shadow: 0 0 0 4px rgba(0,0,0,0.1);
        }
        .timeline-line {
          position: absolute;
          left: -20px;
          top: 16px;
          bottom: 0;
          width: 2px;
          background-color: var(--color-stone);
          transform: translateX(-50%);
        }
        .timeline-step.completed .timeline-line {
          background-color: var(--color-ink);
        }
      `,
        }}
      />
    </div>
  );
}
