import React from 'react';
import Link from 'next/link';
import dbConnect from '../../../src/lib/mongodb';
import { Order } from '../../../src/models/Order';
import { Product } from '../../../src/models/Product';
import { User } from '../../../src/models/User';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Clock, 
  AlertCircle, 
  Plus, 
  ExternalLink,
  ChevronRight,
  PackageCheck,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let isDbUnavailable = false;
  let totalOrders = 0;
  let totalProducts = 0;
  let totalCustomers = 0;
  let totalRevenue = 0;
  let pendingOrders = 0;
  let lowStockProducts: any[] = [];
  let recentOrders: any[] = [];
  let recentCustomers: any[] = [];

  try {
    const conn = await Promise.race([
      dbConnect(),
      new Promise<null>(resolve => setTimeout(() => resolve(null), 2500))
    ]);
    if (!conn) {
      isDbUnavailable = true;
    } else {
      // Execute all dashboard queries in parallel with field projections
      const [
        ordersCount,
        productsCount,
        customersCount,
        pendingOrdersCount,
        revenueAgg,
        candidateProducts,
        ordersList,
        customersList
      ] = await Promise.all([
        Order.countDocuments().exec(),
        Product.countDocuments().exec(),
        User.countDocuments({ role: 'customer' }).exec(),
        Order.countDocuments({ status: { $in: ['placed', 'pending'] } }).exec(),
        Order.aggregate([
          { $match: { 'payment.status': 'paid' } },
          { $group: { _id: null, total: { $sum: '$pricing.total' } } }
        ]).exec(),
        Product.find({ isActive: true })
          .select('name price images variants')
          .limit(100)
          .lean()
          .exec(),
        Order.find()
          .select('orderNumber customer pricing status createdAt items')
          .sort({ createdAt: -1 })
          .limit(8)
          .lean()
          .exec(),
        User.find({ role: 'customer' })
          .select('name email createdAt')
          .sort({ createdAt: -1 })
          .limit(5)
          .lean()
          .exec()
      ]);

      totalOrders = ordersCount || 0;
      totalProducts = productsCount || 0;
      totalCustomers = customersCount || 0;
      pendingOrders = pendingOrdersCount || 0;
      totalRevenue = revenueAgg?.[0]?.total || 0;

      for (const product of candidateProducts) {
        const totalStock = product.variants?.[0]?.sizes?.reduce((sum: number, s: any) => sum + (s.stock || 0), 0) || 0;
        if (totalStock < 8) {
          lowStockProducts.push({
            _id: product._id,
            name: product.name,
            stock: totalStock,
            price: product.price,
            images: product.images || []
          });
        }
      }

      recentOrders = ordersList || [];
      recentCustomers = customersList || [];
    }
  } catch (err) {
    console.warn('AdminDashboardPage: Database connection or query failed, entering graceful mode:', err);
    isDbUnavailable = true;
  }

  const stats = [
    { 
      label: 'Gross Revenue', 
      value: `₹${(totalRevenue / 100).toLocaleString('en-IN')}`, 
      icon: TrendingUp,
      subtext: 'Paid transactions',
      highlight: '#D4AF37'
    },
    { 
      label: 'Total Orders', 
      value: totalOrders.toString(), 
      icon: ShoppingBag,
      subtext: 'All-time volume',
      highlight: '#38BDF8'
    },
    { 
      label: 'Atelier Patrons', 
      value: totalCustomers.toString(), 
      icon: Users,
      subtext: 'Registered accounts',
      highlight: '#A78BFA'
    },
    { 
      label: 'Pending Dispatch', 
      value: pendingOrders.toString(), 
      icon: Clock,
      subtext: 'Action required',
      highlight: '#FBBF24'
    },
  ];

  return (
    <div className="adm-dash">
      {/* Service Unavailable Pop-up message if DB fails */}
      {isDbUnavailable && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          maxWidth: '400px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #DDD6C8',
          borderLeft: '4px solid #B49A68',
          borderRadius: '8px',
          padding: '16px 20px',
          boxShadow: '0 8px 30px rgba(28, 28, 26, 0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={20} color="#B49A68" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C1C1A', marginBottom: '2px' }}>
              Service Unavailable
            </div>
            <div style={{ fontSize: '12px', color: '#68645C' }}>
              Service unavailable. Please try again later.
            </div>
          </div>
        </div>
      )}
      {/* Top Banner with Atelier Live Status */}
      <div className="adm-hero-banner">
        <div>
          <div className="adm-hero-eyebrow">
            <Sparkles size={13} className="text-gold" />
            <span>EXECUTIVE ATELIER HUB</span>
          </div>
          <h1 className="adm-hero-title">Live Atelier Operations</h1>
          <p className="adm-hero-desc">Real-time performance analytics, order flow, and catalog inventory.</p>
        </div>
        <div className="adm-hero-actions">
          <Link href="/admin/products" className="adm-btn-gold">
            <Plus size={15} />
            <span>New Garment</span>
          </Link>
          <Link href="/" target="_blank" className="adm-btn-ghost">
            <span>Storefront</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="adm-stats-grid">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="adm-stat-card">
              <div className="adm-stat-header">
                <span className="adm-stat-label">{stat.label}</span>
                <div className="adm-stat-icon-wrap" style={{ color: stat.highlight, backgroundColor: `${stat.highlight}18` }}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="adm-stat-value">{stat.value}</div>
              <div className="adm-stat-footer">
                <span className="adm-stat-subtext">{stat.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Bento Layout */}
      <div className="adm-bento-grid">
        {/* Left Column: Recent Orders Ledger */}
        <div className="adm-panel adm-panel-orders">
          <div className="adm-panel-header">
            <div>
              <h2 className="adm-panel-title">Recent Haute Couture Orders</h2>
              <span className="adm-panel-subtitle">Latest customer purchases across collections</span>
            </div>
            <Link href="/admin/orders" className="adm-panel-link">
              <span>View All Orders</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="adm-empty-state">
              <PackageCheck size={36} className="text-muted" />
              <p>No orders recorded in this period.</p>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>ORDER</th>
                    <th>CUSTOMER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => {
                    const status = order.status || 'placed';
                    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    });
                    const statusClass = 
                      status === 'delivered' ? 'adm-status-delivered' :
                      status === 'shipped' ? 'adm-status-shipped' :
                      status === 'confirmed' ? 'adm-status-confirmed' :
                      'adm-status-pending';

                    return (
                      <tr key={order._id.toString()}>
                        <td>
                          <span className="adm-order-code">
                            #{order.orderId || order._id.toString().slice(-6).toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="adm-cust-info">
                            <span className="adm-cust-name">{order.shippingAddress?.name || 'Guest Patron'}</span>
                            <span className="adm-cust-city">{order.shippingAddress?.city || 'India'}</span>
                          </div>
                        </td>
                        <td className="adm-order-date">{orderDate}</td>
                        <td className="adm-order-amount">
                          ₹{((order.pricing?.total || 0) / 100).toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span className={`adm-status-pill ${statusClass}`}>
                            {status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link href={`/admin/orders/${order._id}`} className="adm-row-action">
                            Manage
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Inventory Health & Latest Customers */}
        <div className="adm-side-col">
          {/* Low Stock Radar */}
          <div className="adm-panel">
            <div className="adm-panel-header">
              <div>
                <h3 className="adm-panel-title">Stock Health Alert</h3>
                <span className="adm-panel-subtitle">{lowStockProducts.length} items nearing threshold</span>
              </div>
              <Link href="/admin/inventory" className="adm-panel-link">
                <span>Manage</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="adm-stock-list">
              {lowStockProducts.length === 0 ? (
                <p className="adm-stock-ok">All atelier garments are adequately stocked.</p>
              ) : (
                lowStockProducts.slice(0, 4).map((prod: any) => (
                  <div key={prod._id.toString()} className="adm-stock-item">
                    <div className="adm-stock-details">
                      <p className="adm-stock-name">{prod.name}</p>
                      <div className="adm-stock-bar-wrap">
                        <div 
                          className="adm-stock-bar" 
                          style={{ 
                            width: `${Math.min(100, Math.max(15, (prod.stock / 10) * 100))}%`,
                            backgroundColor: prod.stock <= 2 ? '#EF4444' : '#F59E0B'
                          }} 
                        />
                      </div>
                    </div>
                    <span className={`adm-stock-badge ${prod.stock <= 2 ? 'crit' : 'warn'}`}>
                      {prod.stock} units
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Latest Patrons */}
          <div className="adm-panel">
            <div className="adm-panel-header">
              <div>
                <h3 className="adm-panel-title">Atelier Patrons</h3>
                <span className="adm-panel-subtitle">Newly registered clientele</span>
              </div>
              <Link href="/admin/customers" className="adm-panel-link">
                <span>All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="adm-patrons-list">
              {recentCustomers.length === 0 ? (
                <p className="adm-stock-ok">No customer profiles yet.</p>
              ) : (
                recentCustomers.map((cust: any) => {
                  const initial = (cust.name || cust.email || 'U')[0].toUpperCase();
                  return (
                    <div key={cust._id.toString()} className="adm-patron-item">
                      <div className="adm-patron-avatar">{initial}</div>
                      <div className="adm-patron-info">
                        <p className="adm-patron-name">{cust.name || 'Anonymous Client'}</p>
                        <p className="adm-patron-email">{cust.email}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .adm-dash {
          display: flex;
          flex-direction: column;
          gap: 28px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .text-gold { color: #B49A68; }
        .text-muted { color: #68645C; }

        /* Hero Banner */
        .adm-hero-banner {
          background: #FFFFFF;
          border: 1px solid #DDD6C8;
          border-radius: 12px;
          padding: 24px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
        }
        .adm-hero-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #B49A68 0%, #EAE4D8 100%);
        }
        .adm-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #B49A68;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .adm-hero-title {
          font-family: var(--font-display, serif);
          font-size: clamp(22px, 3vw, 28px);
          letter-spacing: 0.04em;
          color: #1C1C1A;
          margin: 0 0 4px 0;
          font-weight: 700;
        }
        .adm-hero-desc {
          font-size: 13px;
          color: #68645C;
          margin: 0;
        }
        .adm-hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .adm-btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1C1C1A;
          color: #FAF8F5;
          border: 1px solid #B49A68;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 10px 18px;
          border-radius: 6px;
          text-decoration: none;
          box-shadow: 0 2px 10px rgba(28, 28, 26, 0.15);
          transition: all 0.2s ease;
        }
        .adm-btn-gold:hover {
          background: #B49A68;
          color: #1C1C1A;
          border-color: #B49A68;
          transform: translateY(-1px);
        }
        .adm-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FAF7F0;
          border: 1px solid #DDD6C8;
          color: #1C1C1A;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 10px 16px;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .adm-btn-ghost:hover {
          background: #EAE4D8;
          border-color: #C5A880;
        }

        /* Stats Grid */
        .adm-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }
        .adm-stat-card {
          background: #FFFFFF;
          border: 1px solid #DDD6C8;
          border-radius: 12px;
          padding: 22px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .adm-stat-card:hover {
          transform: translateY(-2px);
          border-color: #B49A68;
          box-shadow: 0 6px 20px rgba(180, 154, 104, 0.12);
        }
        .adm-stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(180, 154, 104, 0.6), transparent);
        }
        .adm-stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .adm-stat-label {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #68645C;
          font-weight: 600;
        }
        .adm-stat-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .adm-stat-value {
          font-size: clamp(24px, 2.5vw, 30px);
          font-weight: 700;
          color: #1C1C1A;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
          font-family: var(--font-display, serif);
        }
        .adm-stat-subtext {
          font-size: 12px;
          color: #78716C;
        }

        /* Bento Grid */
        .adm-bento-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }
        @media (max-width: 1080px) {
          .adm-bento-grid {
            grid-template-columns: 1fr;
          }
        }
        .adm-panel {
          background: #FFFFFF;
          border: 1px solid #DDD6C8;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
        }
        .adm-side-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .adm-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          gap: 12px;
        }
        .adm-panel-title {
          font-size: 16px;
          font-weight: 700;
          color: #1C1C1A;
          margin: 0 0 2px 0;
          letter-spacing: 0.01em;
          font-family: var(--font-display, serif);
        }
        .adm-panel-subtitle {
          font-size: 12px;
          color: #68645C;
        }
        .adm-panel-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #B49A68;
          text-decoration: none;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: color 0.15s ease;
        }
        .adm-panel-link:hover {
          color: #8C7343;
        }

        /* Table */
        .adm-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .adm-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          min-width: 580px;
        }
        .adm-table th {
          text-align: left;
          padding: 12px 14px;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #68645C;
          background: #FAF7F0;
          border-bottom: 1px solid #DDD6C8;
          font-weight: 700;
        }
        .adm-table td {
          padding: 14px;
          border-bottom: 1px solid #EAE4D8;
          vertical-align: middle;
          color: #1C1C1A;
        }
        .adm-table tr:hover td {
          background: #FAF7F0;
        }
        .adm-order-code {
          font-family: var(--font-mono, monospace);
          font-weight: 700;
          color: #B49A68;
          font-size: 12px;
        }
        .adm-cust-info {
          display: flex;
          flex-direction: column;
        }
        .adm-cust-name {
          color: #1C1C1A;
          font-weight: 600;
        }
        .adm-cust-city {
          font-size: 11px;
          color: #78716C;
        }
        .adm-order-date {
          color: #68645C;
          font-size: 12px;
        }
        .adm-order-amount {
          font-weight: 700;
          color: #1C1C1A;
        }
        .adm-status-pill {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .adm-status-delivered {
          background: #DCFCE7;
          color: #16A34A;
          border: 1px solid #86EFAC;
        }
        .adm-status-shipped {
          background: #E0F2FE;
          color: #0284C7;
          border: 1px solid #7DD3FC;
        }
        .adm-status-confirmed {
          background: #F3E8FF;
          color: #9333EA;
          border: 1px solid #D8B4FE;
        }
        .adm-status-pending {
          background: #FEF3C7;
          color: #D97706;
          border: 1px solid #FCD34D;
        }
        .adm-row-action {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 4px;
          background: #FAF7F0;
          border: 1px solid #DDD6C8;
          color: #1C1C1A;
          font-size: 11px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .adm-row-action:hover {
          background: #1C1C1A;
          border-color: #1C1C1A;
          color: #FAF8F5;
        }

        /* Stock Health List */
        .adm-stock-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .adm-stock-ok {
          font-size: 13px;
          color: #68645C;
          margin: 0;
        }
        .adm-stock-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .adm-stock-details {
          flex: 1;
        }
        .adm-stock-name {
          font-size: 13px;
          font-weight: 600;
          color: #1C1C1A;
          margin: 0 0 6px 0;
        }
        .adm-stock-bar-wrap {
          height: 5px;
          background: #EAE4D8;
          border-radius: 4px;
          overflow: hidden;
        }
        .adm-stock-bar {
          height: 100%;
          border-radius: 4px;
        }
        .adm-stock-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          white-space: nowrap;
        }
        .adm-stock-badge.crit {
          background: #FEE2E2;
          color: #DC2626;
          border: 1px solid #FCA5A5;
        }
        .adm-stock-badge.warn {
          background: #FEF3C7;
          color: #D97706;
          border: 1px solid #FCD34D;
        }

        /* Patrons List */
        .adm-patrons-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .adm-patron-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #EAE4D8;
        }
        .adm-patron-item:last-child {
          border-bottom: none;
        }
        .adm-patron-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #1C1C1A;
          border: 1px solid #B49A68;
          color: #C5A880;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .adm-patron-info {
          flex: 1;
          min-width: 0;
        }
        .adm-patron-name {
          font-size: 13px;
          font-weight: 600;
          color: #1C1C1A;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .adm-patron-email {
          font-size: 11px;
          color: #68645C;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .adm-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
          text-align: center;
          gap: 12px;
          color: #68645C;
        }
      `}} />
    </div>
  );
}

