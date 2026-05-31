import React from 'react';

export default function AdminOrdersPage() {
  const orders = [
    { id: '#10024', name: 'Arul Raj', date: 'Oct 24, 2026', items: 2, total: '₹5,499', status: 'Processing' },
    { id: '#10023', name: 'Priya S', date: 'Oct 24, 2026', items: 1, total: '₹12,990', status: 'Shipped' },
    { id: '#10022', name: 'John Doe', date: 'Oct 23, 2026', items: 3, total: '₹2,499', status: 'Delivered' },
    { id: '#10021', name: 'Jane Smith', date: 'Oct 23, 2026', items: 1, total: '₹4,599', status: 'Processing' },
    { id: '#10020', name: 'Amit Patel', date: 'Oct 22, 2026', items: 2, total: '₹18,500', status: 'Cancelled' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>ORDERS</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input type="text" placeholder="Search orders..." style={{ padding: '8px 16px', border: '1px solid #E9ECEF', borderRadius: '4px', outline: 'none' }} />
          <button style={{ padding: '8px 16px', backgroundColor: 'var(--espresso)', color: 'var(--white)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Export</button>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E9ECEF', textAlign: 'left', backgroundColor: '#F8F9FA' }}>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Order ID</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Customer</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Date</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Items</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Total</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #E9ECEF' }}>
                <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--espresso)' }}>{order.id}</td>
                <td style={{ padding: '16px 24px' }}>{order.name}</td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>{order.date}</td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>{order.items} items</td>
                <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)' }}>{order.total}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    fontSize: '11px', padding: '4px 8px', borderRadius: '12px', 
                    backgroundColor: order.status === 'Delivered' ? '#E8F5E9' : order.status === 'Shipped' ? '#E3F2FD' : order.status === 'Cancelled' ? '#FDECEA' : '#FFF3E0', 
                    color: order.status === 'Delivered' ? 'var(--success)' : order.status === 'Shipped' ? '#1976D2' : order.status === 'Cancelled' ? 'var(--error)' : 'var(--warning)' 
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <button style={{ background: 'none', border: 'none', color: '#1976D2', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px' }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E9ECEF', color: '#6C757D', fontSize: '13px' }}>
          <span>Showing 1 to 5 of 245 entries</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '4px 12px', border: '1px solid #E9ECEF', background: '#FFF', cursor: 'pointer', borderRadius: '4px' }}>Prev</button>
            <button style={{ padding: '4px 12px', border: '1px solid #E9ECEF', background: '#FFF', cursor: 'pointer', borderRadius: '4px' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
