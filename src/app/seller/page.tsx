'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  AlertTriangle,
  Package,
  ShieldCheck,
  ArrowUpRight,
  Boxes,
  Landmark,
  Plus,
  RefreshCw,
  MapPin,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function SellerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seller/me');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const seller = data?.seller;
  const stats = data?.stats;

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.35, ease: 'easeInOut' as const },
    }),
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8E2D6',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 600,
                margin: 0,
                letterSpacing: '-0.02em',
                color: '#1C1C1A',
              }}
            >
              Welcome back, {seller?.storeName || 'Merchant'}
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                background: '#E8F5E9',
                color: '#2E7D32',
                padding: '2px 8px',
                borderRadius: '10px',
              }}
            >
              Verified Partner
            </span>
          </div>
          <p style={{ color: '#68645C', fontSize: '14px', margin: 0 }}>
            Real-time catalog analytics, stock replenishment alerts, and customer orders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchStats}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F8F6F0',
              border: '1px solid #E8E2D6',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#1C1C1A',
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <Link
            href="/seller/products"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1C1C1A',
              color: '#FAF8F5',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Plus size={15} /> Add New Listing
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* KPI 1: Active Listings */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#68645C' }}>Active Styles</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={17} color="#1C1C1A" />
            </div>
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '30px', fontWeight: 700, color: '#1C1C1A' }}>{stats?.totalProducts ?? 0}</div>
            <div style={{ fontSize: '12px', color: '#2E7D32', marginTop: '2px', fontWeight: 500 }}>
              Live on customer store
            </div>
          </div>
        </motion.div>

        {/* KPI 2: Low Stock Alert */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#68645C' }}>Low Stock SKUs</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={17} color="#E65100" />
            </div>
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '30px', fontWeight: 700, color: stats?.lowStockProducts > 0 ? '#E65100' : '#1C1C1A' }}>
              {stats?.lowStockProducts ?? 0}
            </div>
            <Link
              href="/seller/inventory"
              style={{ fontSize: '12px', color: '#B49A68', marginTop: '2px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
            >
              Update inventory stock <ChevronRight size={12} />
            </Link>
          </div>
        </motion.div>

        {/* KPI 3: Orders Requiring Action */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#68645C' }}>Customer Orders</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={17} color="#1565C0" />
            </div>
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '30px', fontWeight: 700, color: '#1C1C1A' }}>{stats?.recentOrdersCount ?? 0}</div>
            <Link
              href="/seller/orders"
              style={{ fontSize: '12px', color: '#1565C0', marginTop: '2px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
            >
              View dispatch list <ChevronRight size={12} />
            </Link>
          </div>
        </motion.div>

        {/* KPI 4: Seller Rating */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#68645C' }}>Account Health</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={17} color="#2E7D32" />
            </div>
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '30px', fontWeight: 700, color: '#1C1C1A' }}>5.0 ★</div>
            <div style={{ fontSize: '12px', color: '#2E7D32', marginTop: '2px', fontWeight: 500 }}>
              Good standing (0 policy flags)
            </div>
          </div>
        </motion.div>
      </div>

      {/* Operational Hub Quick Links */}
      <h2 style={{ fontSize: '17px', fontWeight: 600, margin: '0 0 16px', color: '#1C1C1A' }}>
        Operational Workflows
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <Link
          href="/seller/products"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1C1C1A' }}>Products & Catalog</div>
            <div style={{ fontSize: '13px', color: '#68645C', marginTop: '4px' }}>
              Manage pricing, variants, and storefront visibility.
            </div>
          </div>
          <ArrowUpRight size={18} color="#B49A68" />
        </Link>

        <Link
          href="/seller/orders"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1C1C1A' }}>Orders & Fulfillment</div>
            <div style={{ fontSize: '13px', color: '#68645C', marginTop: '4px' }}>
              Confirm orders, pack items, and generate shipping slips.
            </div>
          </div>
          <ArrowUpRight size={18} color="#B49A68" />
        </Link>

        <Link
          href="/seller/inventory"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1C1C1A' }}>Stock Replenishment</div>
            <div style={{ fontSize: '13px', color: '#68645C', marginTop: '4px' }}>
              Quick inline SKU editor to prevent selling out.
            </div>
          </div>
          <ArrowUpRight size={18} color="#B49A68" />
        </Link>

        <Link
          href="/seller/settlements"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1C1C1A' }}>Payouts & Settlements</div>
            <div style={{ fontSize: '13px', color: '#68645C', marginTop: '4px' }}>
              Track cleared revenues and bank disbursement logs.
            </div>
          </div>
          <ArrowUpRight size={18} color="#B49A68" />
        </Link>
      </div>

      {/* Courier & Bank Account Summary */}
      {seller && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            borderRadius: '16px',
            padding: '24px 28px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px', color: '#1C1C1A' }}>
            Dispatch Pickup Hub & Settlement Bank
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <MapPin size={20} color="#B49A68" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1A' }}>Courier Pickup Point</div>
                <div style={{ fontSize: '13px', color: '#68645C', marginTop: '2px', lineHeight: 1.5 }}>
                  {seller.pickupAddress?.contactPerson} ({seller.pickupAddress?.phone})<br />
                  {seller.pickupAddress?.line1}, {seller.pickupAddress?.city}, {seller.pickupAddress?.state} - {seller.pickupAddress?.pincode}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Landmark size={20} color="#B49A68" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1A' }}>Settlement Bank Account</div>
                <div style={{ fontSize: '13px', color: '#68645C', marginTop: '2px', lineHeight: 1.5 }}>
                  {seller.bankDetails?.bankName}<br />
                  A/C: •••• {seller.bankDetails?.accountNumber?.slice(-4) || 'XXXX'} ({seller.bankDetails?.accountType?.toUpperCase() || 'CURRENT'})<br />
                  IFSC: {seller.bankDetails?.ifscCode}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <ShieldCheck size={20} color="#B49A68" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1A' }}>Compliance & Terms</div>
                <div style={{ fontSize: '13px', color: '#68645C', marginTop: '2px', lineHeight: 1.5 }}>
                  {seller.businessDetails?.legalName}<br />
                  GSTIN: {seller.businessDetails?.gstin || 'Unregistered'}<br />
                  Fee Structure: 0% Platform Commission
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
