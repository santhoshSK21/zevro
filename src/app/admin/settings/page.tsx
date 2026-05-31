import React from 'react';

export default function AdminSettingsPage() {
  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--espresso)', marginBottom: '32px' }}>SETTINGS</h1>

      <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '8px', border: '1px solid #E9ECEF', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Store Details</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#6C757D', marginBottom: '8px' }}>Store Name</label>
            <input type="text" defaultValue="ZEVRO" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E9ECEF', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#6C757D', marginBottom: '8px' }}>Store Email</label>
            <input type="email" defaultValue="contact@zevro.in" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E9ECEF', borderRadius: '4px' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#6C757D', marginBottom: '8px' }}>Store Description</label>
            <textarea rows={3} defaultValue="WEAR TO INSPIRE - Premium Indian fashion." style={{ width: '100%', padding: '10px 12px', border: '1px solid #E9ECEF', borderRadius: '4px', resize: 'vertical' }} />
          </div>
        </div>
        <button style={{ marginTop: '24px', padding: '10px 24px', backgroundColor: 'var(--espresso)', color: 'var(--white)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Changes</button>
      </div>

      <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Payment Configuration</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E9ECEF', borderRadius: '4px', marginBottom: '16px' }}>
          <div>
            <p style={{ fontWeight: 500 }}>Razorpay Integration</p>
            <p style={{ fontSize: '13px', color: '#6C757D' }}>Accept UPI, Cards, Netbanking.</p>
          </div>
          <button style={{ padding: '6px 12px', backgroundColor: '#E8F5E9', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: '4px', cursor: 'pointer' }}>Connected</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E9ECEF', borderRadius: '4px' }}>
          <div>
            <p style={{ fontWeight: 500 }}>Shiprocket Integration</p>
            <p style={{ fontSize: '13px', color: '#6C757D' }}>Automated shipping and tracking.</p>
          </div>
          <button style={{ padding: '6px 12px', backgroundColor: '#E8F5E9', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: '4px', cursor: 'pointer' }}>Connected</button>
        </div>
      </div>
    </div>
  );
}
