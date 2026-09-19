'use client';

import React, { useState } from 'react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [activeTab, setActiveTab] = useState<'sales' | 'products' | 'categories' | 'payments'>('sales');

  const stats = {
    revenue: '₹14,82,450',
    revenueGrowth: '+18.4%',
    totalOrders: 328,
    ordersGrowth: '+12.1%',
    aov: '₹4,520',
    aovGrowth: '+5.6%',
    refundRate: '1.8%',
    conversionRate: '3.42%'
  };

  const topProducts = [
    { rank: 1, name: 'Heavy Embroidered Ivory Anarkali', sku: 'ZEV-ETH-001', category: 'Ethnic Wear', sold: 48, revenue: '₹2,63,952', stock: 14 },
    { rank: 2, name: 'Raw Silk Pleated Co-ord Set', sku: 'ZEV-WST-014', category: 'Western Wear', sold: 42, revenue: '₹1,88,958', stock: 22 },
    { rank: 3, name: 'Organza Drape Saree in Champagne', sku: 'ZEV-ETH-009', category: 'Ethnic Wear', sold: 36, revenue: '₹1,97,964', stock: 8 },
    { rank: 4, name: 'Asymmetric Indo-Western Cape Gown', sku: 'ZEV-INW-003', category: 'Indo-Western', sold: 29, revenue: '₹1,59,471', stock: 19 },
    { rank: 5, name: 'Handcrafted Kundan Choker Set', sku: 'ZEV-ACC-021', category: 'Accessories', sold: 24, revenue: '₹83,976', stock: 35 },
  ];

  const categorySales = [
    { name: 'Ethnic Wear', percent: 42, revenue: '₹6,22,629', orders: 138 },
    { name: 'Western Wear', percent: 28, revenue: '₹4,15,086', orders: 92 },
    { name: 'Indo-Western', percent: 20, revenue: '₹2,96,490', orders: 66 },
    { name: 'Accessories', percent: 10, revenue: '₹1,48,245', orders: 32 },
  ];

  const paymentBreakdown = [
    { method: 'Razorpay / UPI / NetBanking', percent: 68, amount: '₹10,08,066', count: 223 },
    { method: 'Credit & Debit Cards', percent: 22, amount: '₹3,26,139', count: 72 },
    { method: 'Cash on Delivery (COD)', percent: 10, amount: '₹1,48,245', count: 33 },
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Rank,Product Name,SKU,Category,Units Sold,Revenue,Stock\n"
      + topProducts.map(p => `${p.rank},"${p.name}",${p.sku},${p.category},${p.sold},"${p.revenue}",${p.stock}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zevro_sales_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', fontFamily: 'var(--font-body)' }}>
      
      {/* Title & Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#1A1816', margin: '0 0 6px 0' }}>
            Reports & Business Intelligence
          </h1>
          <p style={{ fontSize: '13px', color: '#6C757D', margin: 0 }}>
            Analyze sales performance, customer acquisition, and inventory trends.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #CED4DA', backgroundColor: '#FFF', fontSize: '13px', fontWeight: 500, outline: 'none' }}
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="month">This Month</option>
            <option value="year">Year to Date (2026)</option>
          </select>

          <button 
            onClick={handleExportCSV}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 18px', backgroundColor: '#1A1816', color: '#FAF8F5', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            <span>📥</span> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E9ECEF', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: '#6C757D', letterSpacing: '0.08em' }}>Gross Revenue</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#2E7D32', backgroundColor: '#E8F5E9', padding: '2px 8px', borderRadius: '12px' }}>{stats.revenueGrowth}</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1A1816' }}>{stats.revenue}</div>
          <p style={{ fontSize: '11px', color: '#9E9E9E', margin: '4px 0 0 0' }}>vs previous period</p>
        </div>

        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E9ECEF', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: '#6C757D', letterSpacing: '0.08em' }}>Total Orders</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#2E7D32', backgroundColor: '#E8F5E9', padding: '2px 8px', borderRadius: '12px' }}>{stats.ordersGrowth}</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1A1816' }}>{stats.totalOrders}</div>
          <p style={{ fontSize: '11px', color: '#9E9E9E', margin: '4px 0 0 0' }}>fulfilled orders</p>
        </div>

        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E9ECEF', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: '#6C757D', letterSpacing: '0.08em' }}>Average Order Value</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#2E7D32', backgroundColor: '#E8F5E9', padding: '2px 8px', borderRadius: '12px' }}>{stats.aovGrowth}</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1A1816' }}>{stats.aov}</div>
          <p style={{ fontSize: '11px', color: '#9E9E9E', margin: '4px 0 0 0' }}>per completed transaction</p>
        </div>

        <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E9ECEF', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: '#6C757D', letterSpacing: '0.08em' }}>Conversion Rate</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#1976D2', backgroundColor: '#E3F2FD', padding: '2px 8px', borderRadius: '12px' }}>Industry Leading</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1A1816' }}>{stats.conversionRate}</div>
          <p style={{ fontSize: '11px', color: '#9E9E9E', margin: '4px 0 0 0' }}>Refund rate: {stats.refundRate}</p>
        </div>

      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #E9ECEF', marginBottom: '24px', display: 'flex', gap: '24px' }}>
        {[
          { id: 'sales', label: 'Revenue & Trends' },
          { id: 'products', label: 'Top Products' },
          { id: 'categories', label: 'Category Share' },
          { id: 'payments', label: 'Payment Channels' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '12px 4px',
              borderBottom: activeTab === tab.id ? '3px solid #D4AF37' : '3px solid transparent',
              color: activeTab === tab.id ? '#1A1816' : '#6C757D',
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: '14px',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Revenue & Trends */}
      {activeTab === 'sales' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1816', margin: 0 }}>Sales Velocity Chart</h3>
              <span style={{ fontSize: '12px', color: '#6C757D' }}>Trailing 30 Days</span>
            </div>
            
            {/* Visual Simulated Bar Chart */}
            <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingTop: '20px', borderBottom: '1px solid #E9ECEF' }}>
              {[
                { label: 'W1', h: '45%', val: '₹2.8L' },
                { label: 'W2', h: '65%', val: '₹3.9L' },
                { label: 'W3', h: '55%', val: '₹3.2L' },
                { label: 'W4', h: '85%', val: '₹4.9L' },
              ].map((bar, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#1A1816', marginBottom: '6px' }}>{bar.val}</span>
                  <div style={{ width: '100%', height: bar.h, backgroundColor: i === 3 ? '#D4AF37' : '#1A1816', borderRadius: '4px 4px 0 0', transition: 'height 0.3s' }} />
                  <span style={{ fontSize: '12px', color: '#6C757D', marginTop: '8px' }}>{bar.label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6C757D' }}>
              <span>Average Weekly Sales: ₹3.7L</span>
              <span style={{ color: '#2E7D32', fontWeight: 600 }}>Peak Velocity: Week 4</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1816', margin: '0 0 16px 0' }}>Sales Highlights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderLeft: '3px solid #D4AF37', paddingLeft: '12px' }}>
                <p style={{ fontSize: '11px', color: '#6C757D', margin: 0, textTransform: 'uppercase' }}>Highest Single Order</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#1A1816', margin: '2px 0 0 0' }}>₹24,990 (Bridal Set)</p>
              </div>
              <div style={{ borderLeft: '3px solid #1976D2', paddingLeft: '12px' }}>
                <p style={{ fontSize: '11px', color: '#6C757D', margin: 0, textTransform: 'uppercase' }}>Top Traffic Source</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#1A1816', margin: '2px 0 0 0' }}>Instagram Direct (44%)</p>
              </div>
              <div style={{ borderLeft: '3px solid #2E7D32', paddingLeft: '12px' }}>
                <p style={{ fontSize: '11px', color: '#6C757D', margin: 0, textTransform: 'uppercase' }}>Repeat Customer Rate</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#1A1816', margin: '2px 0 0 0' }}>26.8%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Top Products */}
      {activeTab === 'products' && (
        <div style={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E9ECEF', overflow: 'hidden', marginBottom: '32px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8F9FA', borderBottom: '1px solid #E9ECEF' }}>
                <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6C757D', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rank</th>
                <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6C757D', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Product Name</th>
                <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6C757D', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</th>
                <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6C757D', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Units Sold</th>
                <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6C757D', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Gross Revenue</th>
                <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#6C757D', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Stock Remaining</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((prod) => (
                <tr key={prod.sku} style={{ borderBottom: '1px solid #F1F3F5' }}>
                  <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: '#D4AF37' }}>#{prod.rank}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1816' }}>{prod.name}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>SKU: {prod.sku}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#495057' }}>{prod.category}</td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 600, color: '#1A1816' }}>{prod.sold} pcs</td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 700, color: '#2E7D32' }}>{prod.revenue}</td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: prod.stock < 10 ? '#C62828' : '#495057', fontWeight: prod.stock < 10 ? 600 : 400 }}>
                    {prod.stock} {prod.stock < 10 && '⚠️ Low Stock'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Category Share */}
      {activeTab === 'categories' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1816', margin: '0 0 20px 0' }}>Revenue by Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {categorySales.map((cat) => (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                    <span style={{ color: '#1A1816' }}>{cat.name} ({cat.percent}%)</span>
                    <span style={{ fontWeight: 700, color: '#1A1816' }}>{cat.revenue}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#E9ECEF', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${cat.percent}%`, height: '100%', backgroundColor: cat.name === 'Ethnic Wear' ? '#D4AF37' : '#1A1816' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>{cat.orders} fulfilled orders</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1816', margin: '0 0 16px 0' }}>Merchandising Insights</h3>
            <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#495057', lineHeight: '1.8' }}>
              <li><strong>Ethnic Wear</strong> continues to generate highest gross margin (64%).</li>
              <li><strong>Western Wear</strong> has the fastest turnover cycle (14 days avg).</li>
              <li><strong>Indo-Western</strong> has 40% cross-sell affinity with Jewelry & Accessories.</li>
              <li>Recommend restocking <strong>Raw Silk Co-ord Sets</strong> before upcoming festive surge.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 4: Payments */}
      {activeTab === 'payments' && (
        <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', border: '1px solid #E9ECEF', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1816', margin: '0 0 20px 0' }}>Payment Channel Distribution</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {paymentBreakdown.map((pay) => (
              <div key={pay.method} style={{ padding: '20px', border: '1px solid #E9ECEF', borderRadius: '6px', backgroundColor: '#F8F9FA' }}>
                <p style={{ fontSize: '11px', color: '#6C757D', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px 0' }}>{pay.method}</p>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#1A1816' }}>{pay.amount}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888', marginTop: '8px' }}>
                  <span>{pay.count} Transactions</span>
                  <span style={{ fontWeight: 600, color: '#D4AF37' }}>{pay.percent}% Share</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
