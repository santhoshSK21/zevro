import React from 'react';

export default function AdminProductsPage() {
  const products = [
    { id: 'PROD-001', name: 'Banarasi Silk Saree in Deep Maroon', category: 'Ethnic Wear', stock: 10, price: '₹4,299', status: 'Active' },
    { id: 'PROD-002', name: 'Heavy Embroidered Anarkali in Ivory', category: 'Ethnic Wear', stock: 13, price: '₹5,499', status: 'Active' },
    { id: 'PROD-003', name: 'Linen Co-ord Set in Warm Beige', category: 'Western Wear', stock: 25, price: '₹2,499', status: 'Active' },
    { id: 'PROD-004', name: 'Velvet Evening Gown in Emerald', category: 'Indo-Western', stock: 5, price: '₹8,999', status: 'Low Stock' },
    { id: 'PROD-005', name: 'Kundan Choker Set', category: 'Accessories', stock: 0, price: '₹1,299', status: 'Out of Stock' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)' }}>PRODUCTS</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input type="text" placeholder="Search products..." style={{ padding: '8px 16px', border: '1px solid #E9ECEF', borderRadius: '4px', outline: 'none' }} />
          <button style={{ padding: '8px 16px', backgroundColor: 'var(--espresso)', color: 'var(--white)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add Product</button>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFF', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E9ECEF', textAlign: 'left', backgroundColor: '#F8F9FA' }}>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Product Name</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Category</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Stock</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Price</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '16px 24px', color: '#6C757D', fontWeight: 500 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #E9ECEF' }}>
                <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--espresso)' }}>
                  {product.name}
                  <div style={{ fontSize: '11px', color: '#6C757D', marginTop: '4px' }}>{product.id}</div>
                </td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>{product.category}</td>
                <td style={{ padding: '16px 24px', color: '#6C757D' }}>{product.stock}</td>
                <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)' }}>{product.price}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    fontSize: '11px', padding: '4px 8px', borderRadius: '12px', 
                    backgroundColor: product.status === 'Active' ? '#E8F5E9' : product.status === 'Low Stock' ? '#FFF3E0' : '#FDECEA', 
                    color: product.status === 'Active' ? 'var(--success)' : product.status === 'Low Stock' ? 'var(--warning)' : 'var(--error)' 
                  }}>
                    {product.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <button style={{ background: 'none', border: 'none', color: '#1976D2', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E9ECEF', color: '#6C757D', fontSize: '13px' }}>
          <span>Showing 1 to 5 of 120 products</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '4px 12px', border: '1px solid #E9ECEF', background: '#FFF', cursor: 'pointer', borderRadius: '4px' }}>Prev</button>
            <button style={{ padding: '4px 12px', border: '1px solid #E9ECEF', background: '#FFF', cursor: 'pointer', borderRadius: '4px' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
