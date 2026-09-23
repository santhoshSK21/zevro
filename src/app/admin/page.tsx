import React from 'react';
import dbConnect from '../../../src/lib/mongodb';
import { Order } from '../../../src/models/Order';
import { Product } from '../../../src/models/Product';
import { User } from '../../../src/models/User';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await dbConnect();

  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  
  // Calculate total revenue from paid orders
  const paidOrders = await Order.find({ payment: { status: 'paid' } }).lean();
  const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (o.pricing?.total || 0), 0);

  const pendingOrders = await Order.countDocuments({ status: 'placed' });
  
  // Find products with low stock (< 5 across any variant size)
  const products = await Product.find({ isActive: true }).lean();
  let lowStockProducts = [];
  for (const product of products) {
    const totalStock = product.variants?.[0]?.sizes?.reduce((sum: number, s: any) => sum + s.stock, 0) || 0;
    if (totalStock < 5) {
      lowStockProducts.push({
        _id: product._id,
        name: product.name,
        stock: totalStock,
        price: product.price
      });
    }
  }

  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10).lean();
  const recentCustomers = await User.find({ role: 'customer' }).sort({ createdAt: -1 }).limit(5).lean();

  const stats = [
    { label: 'Total Revenue', value: `₹${(totalRevenue / 100).toLocaleString('en-IN')}`, trend: '' },
    { label: 'Total Orders', value: totalOrders.toString(), trend: '' },
    { label: 'Total Customers', value: totalCustomers.toString(), trend: '' },
    { label: 'Pending Orders', value: pendingOrders.toString(), trend: '' },
  ];

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)', marginBottom: '24px' }}>DASHBOARD OVERVIEW</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
            <p style={{ fontSize: '13px', color: '#6C757D', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{stat.label}</p>
            <h3 style={{ fontSize: '24px', color: 'var(--espresso)', marginBottom: '8px', fontWeight: 600 }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '24px' }}>
        <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '24px' }}>Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p style={{ color: '#6C757D', fontSize: '14px' }}>No orders yet.</p>
          ) : (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '500px' }}>
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
                {recentOrders.map(order => (
                  <tr key={order._id.toString()} style={{ borderBottom: '1px solid #E9ECEF' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 500, color: 'var(--espresso)' }}>{order.orderId || order._id.toString().slice(-6).toUpperCase()}</td>
                    <td style={{ padding: '12px 8px' }}>{order.shippingAddress?.name || 'Guest'}</td>
                    <td style={{ padding: '12px 8px', color: '#6C757D' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)' }}>₹{((order.pricing?.total||0) / 100).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', backgroundColor: order.status === 'delivered' ? '#E8F5E9' : order.status === 'shipped' ? '#E3F2FD' : '#FFF3E0', color: order.status === 'delivered' ? 'var(--success)' : order.status === 'shipped' ? '#1976D2' : 'var(--warning)', textTransform: 'capitalize' }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '24px' }}>Low Stock Products ({lowStockProducts.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {lowStockProducts.length === 0 && <p style={{ color: '#6C757D', fontSize: '14px' }}>All products are well stocked.</p>}
              {lowStockProducts.slice(0, 5).map((prod: any) => (
                <div key={prod._id.toString()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{prod.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--error)' }}>{prod.stock} left in stock</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--espresso)', marginBottom: '24px' }}>Latest Customers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentCustomers.length === 0 && <p style={{ color: '#6C757D', fontSize: '14px' }}>No customers yet.</p>}
              {recentCustomers.map((cust: any) => (
                <div key={cust._id.toString()}>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>{cust.name}</p>
                  <p style={{ fontSize: '12px', color: '#6C757D' }}>{cust.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
