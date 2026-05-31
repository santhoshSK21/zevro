import React from 'react';

export default function AccountAddressesPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px' }}>ADDRESSES</h1>
        <button className="btn btn-primary btn-sm">ADD NEW ADDRESS</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Default Address */}
        <div style={{ border: '2px solid var(--gold)', padding: '24px', backgroundColor: 'var(--white)', position: 'relative' }}>
          <span className="badge badge-gold" style={{ position: 'absolute', top: '-10px', left: '24px' }}>DEFAULT</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', margin: '16px 0 8px' }}>Demo User</h3>
          <p style={{ color: 'var(--warm-grey)', fontSize: '14px', marginBottom: '16px' }}>
            +91 98765 43210<br/><br/>
            123 Luxury Avenue, Fashion District<br/>
            Mumbai, Maharashtra 400001<br/>
            India
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--espresso)', textDecoration: 'underline', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
            <button style={{ background: 'none', border: 'none', color: 'var(--error)', textDecoration: 'underline', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
          </div>
        </div>

        {/* Secondary Address */}
        <div style={{ border: '1px solid var(--linen)', padding: '24px', backgroundColor: 'var(--white)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', margin: '0 0 8px' }}>Work Address</h3>
          <p style={{ color: 'var(--warm-grey)', fontSize: '14px', marginBottom: '16px' }}>
            +91 91234 56789<br/><br/>
            45 Tech Park, Block C<br/>
            Bangalore, Karnataka 560001<br/>
            India
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--espresso)', textDecoration: 'underline', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
            <button style={{ background: 'none', border: 'none', color: 'var(--error)', textDecoration: 'underline', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
            <button style={{ background: 'none', border: 'none', color: 'var(--gold)', textDecoration: 'underline', fontSize: '12px', cursor: 'pointer', marginLeft: 'auto' }}>Set as Default</button>
          </div>
        </div>

      </div>
    </div>
  );
}
