'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react';

export default function OrderShippingLabelPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [orderRes, sellerRes] = await Promise.all([
          fetch(`/api/seller/orders/${orderId}`),
          fetch('/api/seller/me')
        ]);

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          setOrder(orderData.order);
        }
        if (sellerRes.ok) {
          const sellerData = await sellerRes.json();
          setSeller(sellerData.seller);
        }
      } catch (err) {
        console.error('Failed to load shipping label data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) loadData();
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        Generating Dispatch Manifest & Shipping Label...
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        Order not found.
      </div>
    );
  }

  const shipping = order.shippingAddress || {};
  const awb = order.shipping?.awbCode || `AWB-${Math.floor(100000000 + Math.random() * 900000000)}`;
  const courier = order.shipping?.courierName || 'Blue Dart Express';
  const isCod = order.payment?.method === 'cod';
  const storeName = seller?.storeName || 'ZEVRO Signature Atelier';
  const pickup = seller?.pickupAddress || {
    addressLine1: 'Plot 42, Atelier Fashion Corridor',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400013',
  };

  return (
    <div className="label-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      
      {/* Screen-Only Control Toolbar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
        <button
          onClick={() => router.back()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>

        <button
          onClick={() => window.print()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: '#0F172A', color: '#FAF8F5', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        >
          <Printer size={16} /> Print Shipping Label
        </button>
      </div>

      {/* The Printable Manifest Label (Standard 4x6 / A5 Dispatch Slip) */}
      <div className="printable-label" style={{ border: '2px solid #000000', padding: '16px', background: '#FFFFFF', color: '#000000' }}>
        
        {/* Carrier Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000000', paddingBottom: '12px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 2px 0', letterSpacing: '0.08em' }}>
              ZEVRO EXPRESS LOGISTICS
            </h1>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
              Courier: {courier} (STANDARD SURFACE / AIR)
            </span>
          </div>

          <div style={{ textAlign: 'right', border: '2px solid #000', padding: '6px 12px', background: isCod ? '#000' : '#FFF', color: isCod ? '#FFF' : '#000' }}>
            <div style={{ fontSize: '16px', fontWeight: 900 }}>
              {isCod ? 'CASH ON DELIVERY' : 'PREPAID'}
            </div>
            {isCod && (
              <div style={{ fontSize: '12px', fontWeight: 700 }}>
                Collect: ₹{((order.pricing?.total || 0) / 100).toLocaleString('en-IN')}
              </div>
            )}
          </div>
        </div>

        {/* Tracking Barcode Representation */}
        <div style={{ textAlign: 'center', padding: '16px 0', borderBottom: '2px solid #000000' }}>
          {/* SVG Barcode Mock */}
          <div style={{ display: 'inline-block' }}>
            <svg width="280" height="48" viewBox="0 0 280 48" fill="#000000">
              <rect x="0" y="0" width="3" height="48"/>
              <rect x="6" y="0" width="2" height="48"/>
              <rect x="11" y="0" width="5" height="48"/>
              <rect x="19" y="0" width="2" height="48"/>
              <rect x="24" y="0" width="4" height="48"/>
              <rect x="31" y="0" width="2" height="48"/>
              <rect x="36" y="0" width="6" height="48"/>
              <rect x="45" y="0" width="2" height="48"/>
              <rect x="50" y="0" width="4" height="48"/>
              <rect x="57" y="0" width="7" height="48"/>
              <rect x="67" y="0" width="3" height="48"/>
              <rect x="73" y="0" width="5" height="48"/>
              <rect x="81" y="0" width="2" height="48"/>
              <rect x="86" y="0" width="6" height="48"/>
              <rect x="95" y="0" width="2" height="48"/>
              <rect x="100" y="0" width="4" height="48"/>
              <rect x="107" y="0" width="7" height="48"/>
              <rect x="117" y="0" width="3" height="48"/>
              <rect x="123" y="0" width="4" height="48"/>
              <rect x="130" y="0" width="2" height="48"/>
              <rect x="135" y="0" width="6" height="48"/>
              <rect x="144" y="0" width="3" height="48"/>
              <rect x="150" y="0" width="5" height="48"/>
              <rect x="158" y="0" width="2" height="48"/>
              <rect x="163" y="0" width="6" height="48"/>
              <rect x="172" y="0" width="4" height="48"/>
              <rect x="179" y="0" width="6" height="48"/>
              <rect x="188" y="0" width="2" height="48"/>
              <rect x="193" y="0" width="5" height="48"/>
              <rect x="201" y="0" width="3" height="48"/>
              <rect x="207" y="0" width="7" height="48"/>
              <rect x="217" y="0" width="2" height="48"/>
              <rect x="222" y="0" width="5" height="48"/>
              <rect x="230" y="0" width="3" height="48"/>
              <rect x="236" y="0" width="6" height="48"/>
              <rect x="245" y="0" width="4" height="48"/>
              <rect x="252" y="0" width="3" height="48"/>
              <rect x="258" y="0" width="7" height="48"/>
              <rect x="268" y="0" width="2" height="48"/>
              <rect x="273" y="0" width="4" height="48"/>
            </svg>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '0.2em', marginTop: '4px' }}>
            AWB: {awb}
          </div>
        </div>

        {/* Destination & Routing Box */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', borderBottom: '2px solid #000000' }}>
          {/* SHIP TO (Customer) */}
          <div style={{ padding: '12px', borderRight: '2px solid #000000' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              SHIP TO (DELIVERY ADDRESS):
            </span>
            <div style={{ fontSize: '15px', fontWeight: 900, marginTop: '4px' }}>
              {shipping.name || 'Valued Customer'}
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.4, marginTop: '4px' }}>
              {shipping.line1 || shipping.addressLine1 || 'Delivery Address'}<br />
              {shipping.line2 || shipping.addressLine2 ? `${shipping.line2 || shipping.addressLine2}, ` : ''}
              {shipping.city || 'City'}, {shipping.state || 'State'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 900, marginTop: '6px' }}>
              PINCODE: {shipping.pincode || '000000'}
            </div>
            <div style={{ fontSize: '12px', marginTop: '2px' }}>
              Phone: {shipping.phone || 'N/A'}
            </div>
          </div>

          {/* Routing Center */}
          <div style={{ padding: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>ROUTING HUB</span>
            <div style={{ fontSize: '24px', fontWeight: 900, margin: '4px 0' }}>
              {(shipping.city || 'DEL').substring(0, 3).toUpperCase()}-{(shipping.pincode || '110').substring(0, 3)}
            </div>
            <span style={{ fontSize: '10px', fontWeight: 600 }}>ZONE: DOMESTIC-1</span>
          </div>
        </div>

        {/* SHIP FROM (Merchant Dispatch Hub) */}
        <div style={{ padding: '12px', borderBottom: '2px solid #000000', fontSize: '11px', lineHeight: 1.4 }}>
          <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            SHIP FROM (MERCHANT DISPATCH ATELIER):
          </span>
          <div style={{ fontWeight: 900, fontSize: '12px', marginTop: '2px' }}>
            {storeName} (Zevro Certified Merchant Partner)
          </div>
          <div>
            {pickup.addressLine1 || pickup.line1}, {pickup.city}, {pickup.state} - {pickup.pincode}
          </div>
          <div>
            GSTIN: {seller?.gstin || '27AAECZ1234F1Z5'} | Contact: {seller?.phone || '+91 98765 00000'}
          </div>
        </div>

        {/* Package SKU Manifest Summary */}
        <div style={{ padding: '12px', borderBottom: '2px solid #000000' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
            MANIFEST ORDER DETAILS: {order.orderId}
          </span>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #000000', textAlign: 'left' }}>
                <th style={{ padding: '4px 0' }}>ITEM DESCRIPTION</th>
                <th style={{ padding: '4px 0' }}>SIZE / COLOR</th>
                <th style={{ padding: '4px 0', textAlign: 'center' }}>QTY</th>
                <th style={{ padding: '4px 0', textAlign: 'right' }}>VAL (₹)</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px dashed #CCC' }}>
                  <td style={{ padding: '6px 0', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '6px 0' }}>{item.size || 'STD'} / {item.color || 'Standard'}</td>
                  <td style={{ padding: '6px 0', textAlign: 'center' }}>{item.quantity || 1}</td>
                  <td style={{ padding: '6px 0', textAlign: 'right' }}>₹{(((item.priceAtPurchase || item.price || 0) * (item.quantity || 1)) / 100).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Return & Security Note */}
        <div style={{ padding: '8px 12px', fontSize: '10px', color: '#444444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>If undelivered, return to Seller Dispatch Address above.</span>
          <span style={{ fontWeight: 700 }}>TAMPER EVIDENT SEALED PARCEL</span>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background: #FFFFFF !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .label-container {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .printable-label {
            border: 2px solid #000 !important;
          }
        }
      `}} />

    </div>
  );
}
