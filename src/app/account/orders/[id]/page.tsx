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
    setReturnSuccessMsg('');
    setModalOpen(true);
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
          reason: returnReason,
          details: returnNotes,
          exchangePreference: returnType === 'EXCHANGE' ? { size: exchangeSize } : undefined,
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
          Order {order.orderId || order._id.slice(-6).toUpperCase()}
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
          <div style={{ border: '1px solid var(--color-stone)', padding: '32px', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', margin: 0 }}>
                Ordered Pieces
              </h3>
              <span style={{ fontSize: '12px', color: '#2E7D32', fontWeight: 600 }}>
                ✓ 7-Day Easy Returns Guarantee
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {order.items?.map((item: any, idx: number) => {
                // Check if this item has an existing return/exchange request
                const pId = item.productId?._id?.toString() || item.productId?.toString();
                const returnReq = returnRequests.find(
                  (r) =>
                    (r.item?.productId?.toString() === pId || r.item?.sku === item.sku) &&
                    r.status !== 'REJECTED'
                );

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '24px',
                      borderBottom: idx !== order.items.length - 1 ? '1px solid var(--color-stone)' : 'none',
                      paddingBottom: idx !== order.items.length - 1 ? '24px' : '0',
                      flexWrap: 'wrap',
                    }}
                  >
                    <img src={item.image} alt={item.name} style={{ width: '100px', height: '120px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '8px' }}>{item.name}</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginBottom: '4px' }}>
                        Color: {item.color} | Size: {item.size}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginBottom: '8px' }}>
                        Qty: {item.quantity}
                      </p>

                      {/* Merchant & Tracking Attribution Badge */}
                      <div
                        style={{
                          display: 'inline-flex',
                          flexDirection: 'column',
                          gap: '4px',
                          background: '#FAF8F5',
                          border: '1px solid #E8E2D6',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          marginBottom: '10px',
                        }}
                      >
                        <span style={{ fontSize: '11px', color: '#1C1C1A', fontWeight: 600 }}>
                          🏛️ Sold & Fulfilled by: {item.sellerStoreName || 'ZEVRO Signature Atelier'}
                        </span>
                        {(item.courierName || order.shipping?.courierName) && (
                          <span style={{ fontSize: '11px', color: '#1565C0', fontWeight: 500 }}>
                            🚚 Carrier: {item.courierName || order.shipping?.courierName}{' '}
                            {item.trackingNumber || order.shipping?.awbCode
                              ? `(AWB: ${item.trackingNumber || order.shipping?.awbCode})`
                              : ''}
                          </span>
                        )}
                      </div>

                      {/* Return / Exchange Button & Status Badges */}
                      <div>
                        {returnReq ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              backgroundColor:
                                returnReq.status === 'REFUNDED'
                                  ? '#E8F5E9'
                                  : returnReq.status === 'PICKUP_SCHEDULED'
                                  ? '#E3F2FD'
                                  : '#FFF8E1',
                              color:
                                returnReq.status === 'REFUNDED'
                                  ? '#2E7D32'
                                  : returnReq.status === 'PICKUP_SCHEDULED'
                                  ? '#1565C0'
                                  : '#B78103',
                              border: '1px solid currentColor',
                            }}
                          >
                            <RotateCcw size={12} />
                            <span>
                              {returnReq.status === 'REQUESTED' &&
                                `${returnReq.type === 'EXCHANGE' ? 'Exchange' : 'Return'} Requested (Under Merchant Review)`}
                              {returnReq.status === 'PICKUP_SCHEDULED' &&
                                `Reverse Pickup Scheduled (${returnReq.reverseCourier?.courierName || 'Zevro Logistics'})`}
                              {returnReq.status === 'REFUNDED' &&
                                `✓ Inspected, Restocked & Refunded`}
                              {returnReq.status === 'COMPLETED' && `✓ Exchange Delivered`}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenReturnModal(item)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 14px',
                              backgroundColor: '#FFFFFF',
                              color: '#1C1C1A',
                              border: '1px solid #DDD6C8',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <RotateCcw size={12} color="#B49A68" />
                            <span>Request Return / Exchange</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        ₹{(((item.priceAtPurchase || 0) * item.quantity) / 100).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ border: '1px solid var(--color-stone)', padding: '32px', backgroundColor: '#FFFFFF' }}>
            <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '24px' }}>
              Order Lifecycle & Tracking
            </h3>
            <div className="tracking-timeline">
              {order.timeline?.map((step: any, idx: number) => (
                <div key={idx} className="timeline-step completed">
                  <div className="timeline-dot completed active">
                    <span style={{ color: 'var(--white)', fontSize: '10px' }}>✓</span>
                  </div>
                  {idx !== order.timeline.length - 1 && <div className="timeline-line"></div>}

                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--color-ink)', margin: '0 0 4px', textTransform: 'capitalize' }}>
                    {step.status}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)', margin: '0 0 4px' }}>{step.message}</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(step.timestamp).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
              {(!order.timeline || order.timeline.length === 0) && (
                <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)' }}>No timeline events available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary, Shipping Address, Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ border: '1px solid var(--color-stone)', padding: '32px', backgroundColor: '#FFFFFF' }}>
            <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '24px' }}>
              Summary
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'var(--color-ink-muted)' }}>
              <span>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>₹{((order.pricing?.subtotal || 0) / 100).toLocaleString('en-IN')}</span>
            </div>
            {order.pricing?.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'var(--success)' }}>
                <span>Discount</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>- ₹{((order.pricing?.discount || 0) / 100).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'var(--color-ink-muted)' }}>
              <span>Shipping</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {order.pricing?.shippingCharge === 0 ? 'FREE' : `₹${(order.pricing?.shippingCharge / 100).toLocaleString('en-IN')}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--color-stone)', fontSize: '18px', fontFamily: 'var(--font-serif)' }}>
              <span>Total</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>₹{((order.pricing?.total || 0) / 100).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ border: '1px solid var(--color-stone)', padding: '32px', backgroundColor: '#FFFFFF' }}>
            <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '16px' }}>
              Shipping Address
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-ink)', lineHeight: '1.6' }}>
              {order.shippingAddress?.name}
              <br />
              {order.shippingAddress?.line1}
              <br />
              {order.shippingAddress?.line2 && (
                <>
                  {order.shippingAddress?.line2}
                  <br />
                </>
              )}
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
              <br />
              {order.shippingAddress?.country}
            </p>
          </div>

          <div style={{ border: '1px solid var(--color-stone)', padding: '32px', backgroundColor: '#FFFFFF' }}>
            <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '16px' }}>
              Payment Method
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-ink)', textTransform: 'uppercase' }}>{order.payment?.method}</p>
            <p style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginTop: '4px', textTransform: 'uppercase' }}>
              Status: {order.payment?.status}
            </p>
          </div>
        </div>
      </div>

      {/* Return & Exchange Customer Modal */}
      {modalOpen && selectedItem && (
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
              maxWidth: '540px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                right: '20px',
                top: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#68645C',
              }}
            >
              <X size={20} />
            </button>

            <h3
              style={{
                fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
                fontSize: '22px',
                fontWeight: 600,
                color: '#1C1C1A',
                margin: '0 0 6px',
              }}
            >
              Request Return or Exchange
            </h3>
            <p style={{ fontSize: '13px', color: '#68645C', margin: '0 0 20px' }}>
              Protected by the Zevro 7-Day Doorstep Guarantee. The fulfilling merchant will review and arrange doorstep collection within 48 hours.
            </p>

            {/* Selected item preview */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 14px',
                backgroundColor: '#F8F6F0',
                borderRadius: '10px',
                border: '1px solid #E8E2D6',
                marginBottom: '20px',
              }}
            >
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1C1C1A' }}>{selectedItem.name}</div>
                <div style={{ fontSize: '12px', color: '#68645C' }}>
                  Current: Size {selectedItem.size} • Color {selectedItem.color} • ₹
                  {(((selectedItem.priceAtPurchase || 0) * selectedItem.quantity) / 100).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {returnSuccessMsg ? (
              <div
                style={{
                  backgroundColor: '#E8F5E9',
                  border: '1px solid #A5D6A7',
                  borderRadius: '10px',
                  padding: '20px',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={36} color="#2E7D32" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1B5E20', margin: '0 0 8px' }}>
                  Request Filed Successfully!
                </h4>
                <p style={{ fontSize: '13px', color: '#2E7D32', margin: 0 }}>{returnSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReturn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Type Choice */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#1C1C1A', display: 'block', marginBottom: '8px' }}>
                    What would you like to do?
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setReturnType('RETURN')}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: returnType === 'RETURN' ? '2px solid #1C1C1A' : '1px solid #DDD6C8',
                        backgroundColor: returnType === 'RETURN' ? '#F8F6F0' : '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: '#1C1C1A',
                        textAlign: 'center',
                      }}
                    >
                      Return for Full Refund
                    </button>
                    <button
                      type="button"
                      onClick={() => setReturnType('EXCHANGE')}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: returnType === 'EXCHANGE' ? '2px solid #1C1C1A' : '1px solid #DDD6C8',
                        backgroundColor: returnType === 'EXCHANGE' ? '#F8F6F0' : '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: '#1C1C1A',
                        textAlign: 'center',
                      }}
                    >
                      Exchange for Other Size
                    </button>
                  </div>
                </div>

                {/* Reason Dropdown */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#1C1C1A', display: 'block', marginBottom: '6px' }}>
                    Reason for {returnType === 'EXCHANGE' ? 'exchange' : 'return'}
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #DDD6C8',
                      fontSize: '13px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="Size does not fit (too small)">Size does not fit — too small</option>
                    <option value="Size does not fit (too large)">Size does not fit — too large</option>
                    <option value="Fabric or embroidery defect">Defective or damaged fabric/embroidery</option>
                    <option value="Item not as pictured">Item looks different from images</option>
                    <option value="Quality not as expected">Material quality not as expected</option>
                    <option value="Changed mind">Changed mind</option>
                  </select>
                </div>

                {/* Exchange Specific: Requested Size */}
                {returnType === 'EXCHANGE' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#1C1C1A', display: 'block', marginBottom: '6px' }}>
                      Choose replacement size
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
                            borderRadius: '6px',
                            border: exchangeSize === sz ? '2px solid #1C1C1A' : '1px solid #DDD6C8',
                            backgroundColor: exchangeSize === sz ? '#1C1C1A' : '#FFFFFF',
                            color: exchangeSize === sz ? '#FAF8F5' : '#1C1C1A',
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

                {/* Notes */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#1C1C1A', display: 'block', marginBottom: '6px' }}>
                    Additional comments (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    placeholder="Provide any additional fitting details for the tailor..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #DDD6C8',
                      fontSize: '13px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReturn}
                  style={{
                    backgroundColor: '#1C1C1A',
                    color: '#FAF8F5',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: submittingReturn ? 'not-allowed' : 'pointer',
                    marginTop: '8px',
                  }}
                >
                  {submittingReturn
                    ? 'Submitting...'
                    : `Submit ${returnType === 'EXCHANGE' ? 'Exchange' : 'Return'} Request`}
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
