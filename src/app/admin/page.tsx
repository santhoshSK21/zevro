import React from 'react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Revenue', value: '₹14,59,200', trend: '+12.5%' },
    { label: 'Total Orders', value: '245', trend: '+5.2%' },
    { label: 'Total Customers', value: '1,204', trend: '+18.1%' },
    { label: 'Avg Order Value', value: '₹5,955', trend: '-2.4%' },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)', marginBottom: '24px' }}>DASHBOARD OVERVIEW</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
            <p style={{ fontSize: '13px', color: '#6C757D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{stat.label}</p>
            <h3 style={{ fontSize: '24px', color: 'var(--espresso)', marginBottom: '8px', fontWeight: 600 }}>{stat.value}</h3>
            <span style={{ fontSize: '12px', color: stat.trend.startsWith('+') ? 'var(--success)' : 'var(--error)', fontWeight: 500, backgroundColor: stat.trend.startsWith('+') ? '#E8F5E9' : '#FDECEA', padding: '2px 8px', borderRadius: '12px' }}>
              {stat.trend} from last month
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '24px' }}>Recent Orders</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E9ECEF', textAlign: 'left' }}>
                <th style={{ padding: '12px 8px', color: '#6C757D', fontWeight: 500 }}>Order ID</th>
                <th style={{ padding: '12px 8px', color: '#6C757D', fontWeight: 500 }}>Customer</th>
                <th style={{ padding: '12px 8px', color: '#6C757D', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '12px 8px', color: '#6C757D', fontWeight: 500 }}>Total</th>
                <th style={{ padding: '12px 8px', color: '#6C757D', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: '#10024', name: 'Arul Raj', date: 'Oct 24, 2026', total: '₹5,499', status: 'Processing' },
                { id: '#10023', name: 'Priya S', date: 'Oct 24, 2026', total: '₹12,990', status: 'Shipped' },
                { id: '#10022', name: 'John D', date: 'Oct 23, 2026', total: '₹2,499', status: 'Delivered' },
              ].map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #E9ECEF' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 500, color: 'var(--espresso)' }}>{order.id}</td>
                  <td style={{ padding: '12px 8px' }}>{order.name}</td>
                  <td style={{ padding: '12px 8px', color: '#6C757D' }}>{order.date}</td>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)' }}>{order.total}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', backgroundColor: order.status === 'Delivered' ? '#E8F5E9' : order.status === 'Shipped' ? '#E3F2FD' : '#FFF3E0', color: order.status === 'Delivered' ? 'var(--success)' : order.status === 'Shipped' ? '#1976D2' : 'var(--warning)' }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '24px' }}>Top Products</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'Banarasi Silk Saree', sales: 45, rev: '₹1,93,455' },
              { name: 'Embroidered Anarkali', sales: 32, rev: '₹1,75,968' },
              { name: 'Linen Co-ord Set', sales: 28, rev: '₹69,972' }
            ].map((prod, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{prod.name}</p>
                  <p style={{ fontSize: '12px', color: '#6C757D' }}>{prod.sales} sales</p>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 500 }}>{prod.rev}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
