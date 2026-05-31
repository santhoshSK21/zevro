import React from 'react';

export default function AdminCustomersPage() {
  const customers = [
    { id: 'CUST-1024', name: 'Arul Raj', email: 'arul@example.com', orders: 5, spent: '₹45,499', registered: 'Jan 15, 2026' },
    { id: 'CUST-1023', name: 'Priya S', email: 'priya@example.com', orders: 2, spent: '₹22,990', registered: 'Mar 02, 2026' },
    { id: 'CUST-1022', name: 'John Doe', email: 'john@example.com', orders: 1, spent: '₹2,499', registered: 'Oct 23, 2026' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>CUSTOMERS</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input type="text" placeholder="Search customers..." style={{ padding: '8px 16px', border: '1px solid #E9ECEF', borderRadius: '4px', outline: 'none' }} />
        </div>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E9ECEF', textAlign: 'left', backgroundColor: '#F8F9FA' }}>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Customer Name</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Email</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Orders</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Total Spent</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Registered</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} style={{ borderBottom: '1px solid #E9ECEF' }}>
                <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--espresso)' }}>
                  {customer.name}
                  <div style={{ fontSize: '11px', color: '#6C757D', marginTop: '4px' }}>{customer.id}</div>
                </td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>{customer.email}</td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>{customer.orders}</td>
                <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)' }}>{customer.spent}</td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>{customer.registered}</td>
                <td style={{ padding: '16px 24px' }}>
                  <button style={{ background: 'none', border: 'none', color: '#1976D2', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px' }}>View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
