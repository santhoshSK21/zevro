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
  await dbConnect();

  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  
  // Calculate total revenue from paid orders
  const paidOrders = await Order.find({ payment: { status: 'paid' } }).lean();
  const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (o.pricing?.total || 0), 0);

  const pendingOrders = await Order.countDocuments({ status: { $in: ['placed', 'pending'] } });
  
  // Find products with low stock (< 5 across any variant size)
  const products = await Product.find({ isActive: true }).lean();
  let lowStockProducts = [];
  for (const product of products) {
    const totalStock = product.variants?.[0]?.sizes?.reduce((sum: number, s: any) => sum + s.stock, 0) || 0;
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

  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(8).lean();
  const recentCustomers = await User.find({ role: 'customer' }).sort({ createdAt: -1 }).limit(5).lean();

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
        .text-gold { color: #D4AF37; }
        .text-muted { color: #64748B; }

        /* Hero Banner */
        .adm-hero-banner {
          background: radial-gradient(circle at top left, rgba(212, 175, 55, 0.12) 0%, rgba(15, 23, 42, 0.6) 60%), #111827;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 24px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .adm-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #D4AF37;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .adm-hero-title {
          font-family: var(--font-display, serif);
          font-size: clamp(22px, 3vw, 28px);
          letter-spacing: 0.08em;
          color: #FAF8F5;
          margin: 0 0 4px 0;
          font-weight: 600;
        }
        .adm-hero-desc {
          font-size: 13px;
          color: #94A3B8;
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
          background: linear-gradient(135deg, #D4AF37 0%, #C5A880 100%);
          color: #0B0F19;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 10px 18px;
          border-radius: 6px;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.25);
          transition: all 0.2s ease;
        }
        .adm-btn-gold:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35);
        }
        .adm-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #E2E8F0;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 10px 16px;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .adm-btn-ghost:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.25);
        }

        /* Stats Grid */
        .adm-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }
        .adm-stat-card {
          background: #111827;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 22px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .adm-stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(197, 168, 128, 0.3);
        }
        .adm-stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(197, 168, 128, 0.4), transparent);
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
          color: #94A3B8;
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
          color: #FAF8F5;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
          font-family: var(--font-display, serif);
        }
        .adm-stat-subtext {
          font-size: 12px;
          color: #64748B;
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
          background: #111827;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
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
          font-weight: 600;
          color: #FAF8F5;
          margin: 0 0 2px 0;
          letter-spacing: 0.02em;
        }
        .adm-panel-subtitle {
          font-size: 12px;
          color: #64748B;
        }
        .adm-panel-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #C5A880;
          text-decoration: none;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .adm-panel-link:hover {
          color: #D4AF37;
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
          color: #64748B;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-weight: 600;
        }
        .adm-table td {
          padding: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          vertical-align: middle;
        }
        .adm-table tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }
        .adm-order-code {
          font-family: var(--font-mono, monospace);
          font-weight: 600;
          color: #C5A880;
          font-size: 12px;
        }
        .adm-cust-info {
          display: flex;
          flex-direction: column;
        }
        .adm-cust-name {
          color: #F8FAFC;
          font-weight: 500;
        }
        .adm-cust-city {
          font-size: 11px;
          color: #64748B;
        }
        .adm-order-date {
          color: #94A3B8;
          font-size: 12px;
        }
        .adm-order-amount {
          font-weight: 600;
          color: #FAF8F5;
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
          background: rgba(16, 185, 129, 0.15);
          color: #34D399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .adm-status-shipped {
          background: rgba(56, 189, 248, 0.15);
          color: #38BDF8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }
        .adm-status-confirmed {
          background: rgba(167, 139, 250, 0.15);
          color: #C084FC;
          border: 1px solid rgba(167, 139, 250, 0.3);
        }
        .adm-status-pending {
          background: rgba(251, 191, 36, 0.15);
          color: #FBBF24;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }
        .adm-row-action {
          display: inline-flex;
          align-items: center;
          padding: 5px 10px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.05);
          color: #CBD5E1;
          font-size: 11px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .adm-row-action:hover {
          background: rgba(197, 168, 128, 0.2);
          color: #C5A880;
        }

        /* Stock Health List */
        .adm-stock-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .adm-stock-ok {
          font-size: 13px;
          color: #64748B;
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
          font-weight: 500;
          color: #E2E8F0;
          margin: 0 0 6px 0;
        }
        .adm-stock-bar-wrap {
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          overflow: hidden;
        }
        .adm-stock-bar {
          height: 100%;
          border-radius: 4px;
        }
        .adm-stock-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          white-space: nowrap;
        }
        .adm-stock-badge.crit {
          background: rgba(239, 68, 68, 0.15);
          color: #F87171;
        }
        .adm-stock-badge.warn {
          background: rgba(245, 158, 11, 0.15);
          color: #FBBF24;
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
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .adm-patron-item:last-child {
          border-bottom: none;
        }
        .adm-patron-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
          border: 1px solid rgba(197, 168, 128, 0.3);
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
          font-weight: 500;
          color: #F8FAFC;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .adm-patron-email {
          font-size: 11px;
          color: #64748B;
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
        }
      `}} />
    </div>
  );
}

