'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function OrderDetailPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [status, setStatus] = useState('');
  const [courier, setCourier] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error('Order not found');
        const data = await res.json();
        setOrder(data);
        setStatus(data.status || 'placed');
        setCourier(data.shipping?.courierName || '');
        setTrackingUrl(data.shipping?.trackingUrl || '');
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateFulfillment = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          shipping: {
            ...order.shipping,
            courierName: courier,
            trackingUrl: trackingUrl
          },
          triggerShipping: status === 'processing'
        })
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setOrder(updated);
      showToast('Order updated successfully', 'success');
    } catch (e) {
      showToast('Failed to update order', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--error)' }}>{error}</div>;
  if (!order) return null;

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '16px 24px', borderRadius: '4px', color: '#fff', backgroundColor: toast.type === 'success' ? 'var(--success)' : 'var(--error)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {toast.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <button onClick={() => router.push('/admin/orders')} style={{ background: 'none', border: 'none', color: '#1976D2', cursor: 'pointer', fontSize: '13px', marginBottom: '8px', padding: 0 }}>← Back to Orders</button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>ORDER {order.orderId || order._id.slice(-6).toUpperCase()}</h1>
        </div>
        <div>
          <span style={{ padding: '6px 12px', borderRadius: '16px', backgroundColor: '#E9ECEF', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            {order.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '16px' }}>Order Items</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E9ECEF', textAlign: 'left' }}>
                  <th style={{ paddingBottom: '12px', color: '#6C757D', fontWeight: 500 }}>Item</th>
                  <th style={{ paddingBottom: '12px', color: '#6C757D', fontWeight: 500 }}>Price</th>
                  <th style={{ paddingBottom: '12px', color: '#6C757D', fontWeight: 500 }}>Qty</th>
                  <th style={{ paddingBottom: '12px', color: '#6C757D', fontWeight: 500, textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E9ECEF' }}>
                    <td style={{ padding: '16px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={item.image || ''} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', background: 'var(--color-surface)' }} />
                        <div>
                          <p style={{ fontWeight: 500, color: 'var(--espresso)' }}>{item.name}</p>
                          <p style={{ fontSize: '12px', color: '#6C757D' }}>Size: {item.size} | Color: {item.color}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 0', fontFamily: 'var(--font-mono)' }}>₹{((item.priceAtPurchase || 0)/100).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '16px 0' }}>{item.quantity}</td>
                    <td style={{ padding: '16px 0', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>₹{(((item.priceAtPurchase || 0) * item.quantity)/100).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <div style={{ width: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span style={{ color: '#6C757D' }}>Subtotal</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>₹{((order.pricing?.subtotal||0)/100).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span style={{ color: '#6C757D' }}>Shipping</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>₹{((order.pricing?.shippingCharge||0)/100).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E9ECEF', fontWeight: 600, fontSize: '16px' }}>
                  <span style={{ color: 'var(--espresso)' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--espresso)' }}>₹{((order.pricing?.total||0)/100).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '16px' }}>Timeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.timeline?.map((t: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--espresso)', marginTop: '4px' }} />
                  <div>
                    <p style={{ fontWeight: 600, textTransform: 'capitalize' }}>{t.status}</p>
                    <p style={{ color: '#6C757D' }}>{t.message}</p>
                    <p style={{ color: '#999', fontSize: '11px', marginTop: '4px' }}>{new Date(t.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {(!order.timeline || order.timeline.length === 0) && (
                <p style={{ color: '#6C757D', fontSize: '13px' }}>Order placed on {new Date(order.createdAt).toLocaleString()}</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Fulfillment & Tracking Update */}
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '16px' }}>Update Fulfillment</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>STATUS</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid var(--linen)', borderRadius: '4px' }}>
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="out-for-delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>COURIER</label>
                <input type="text" value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="e.g. BlueDart" style={{ width: '100%', padding: '8px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>TRACKING NUMBER/URL</label>
                <input type="text" value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} placeholder="Tracking URL or AWB" style={{ width: '100%', padding: '8px', border: '1px solid var(--linen)', borderRadius: '4px' }} />
              </div>
              
              <button 
                onClick={handleUpdateFulfillment} 
                disabled={saving}
                style={{ marginTop: '8px', padding: '10px', backgroundColor: 'var(--espresso)', color: '#fff', border: 'none', borderRadius: '4px', cursor: saving ? 'not-allowed' : 'pointer' }}
              >
                {saving ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Customer Details */}
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '16px' }}>Customer</h3>
            <p style={{ fontWeight: 500 }}>{order.shippingAddress?.name}</p>
            <p style={{ color: '#1976D2', fontSize: '14px', marginBottom: '4px' }}>{order.shippingAddress?.email}</p>
            <p style={{ color: '#6C757D', fontSize: '14px' }}>{order.shippingAddress?.phone}</p>
            
            <hr style={{ border: 'none', borderTop: '1px solid #E9ECEF', margin: '16px 0' }} />
            
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '8px' }}>Shipping Address</h3>
            <p style={{ color: '#6C757D', fontSize: '14px', lineHeight: '1.5' }}>
              {order.shippingAddress?.line1}<br/>
              {order.shippingAddress?.line2 && <>{order.shippingAddress?.line2}<br/></>}
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}<br/>
              {order.shippingAddress?.country}
            </p>
          </div>

          {/* Payment Details */}
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '16px' }}>Payment Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6C757D' }}>Method</span>
                <span style={{ textTransform: 'uppercase', fontWeight: 500 }}>{order.payment?.method}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6C757D' }}>Status</span>
                <span style={{ 
                  textTransform: 'capitalize', fontWeight: 500,
                  color: order.payment?.status === 'paid' ? 'var(--success)' : 'var(--warning)'
                }}>{order.payment?.status}</span>
              </div>
              {order.payment?.razorpayOrderId && (
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
                  <span style={{ color: '#6C757D', fontSize: '12px' }}>Razorpay Order ID</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{order.payment.razorpayOrderId}</span>
                </div>
              )}
              {order.payment?.razorpayPaymentId && (
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', marginTop: '4px' }}>
                  <span style={{ color: '#6C757D', fontSize: '12px' }}>Payment ID</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{order.payment.razorpayPaymentId}</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
