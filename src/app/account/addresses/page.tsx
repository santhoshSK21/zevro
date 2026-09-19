import React from 'react';

export default function AccountAddressesPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="display-serif" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-ink)' }}>ADDRESSES</h1>
        <button className="btn btn-outline-dark" style={{ border: '1px solid var(--color-ink)', background: 'transparent', color: 'var(--color-ink)', padding: '12px 24px', fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.15em' }}>ADD NEW ADDRESS</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Default Address */}
        <div style={{ border: '1px solid var(--color-ink)', padding: '24px', backgroundColor: 'var(--color-bg)', position: 'relative' }}>
          <span className="label-caps" style={{ position: 'absolute', top: '-10px', left: '24px', background: 'var(--color-ink)', color: 'var(--color-white)', padding: '4px 8px', fontSize: '10px' }}>DEFAULT</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', margin: '16px 0 8px', color: 'var(--color-ink)' }}>Demo User</h3>
          <p style={{ color: 'var(--color-ink-muted)', fontFamily: 'var(--font-body)', fontSize: '14px', marginBottom: '16px', lineHeight: 1.6 }}>
            +91 98765 43210<br/><br/>
            123 Luxury Avenue, Fashion District<br/>
            Mumbai, Maharashtra 400001<br/>
            India
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--color-ink)', textDecoration: 'underline', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Edit</button>
            <button style={{ background: 'none', border: 'none', color: 'var(--color-error)', textDecoration: 'underline', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Delete</button>
          </div>
        </div>

        {/* Secondary Address */}
        <div style={{ border: '1px solid var(--color-stone)', padding: '24px', backgroundColor: 'var(--color-bg)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', margin: '0 0 8px', color: 'var(--color-ink)' }}>Work Address</h3>
          <p style={{ color: 'var(--color-ink-muted)', fontFamily: 'var(--font-body)', fontSize: '14px', marginBottom: '16px', lineHeight: 1.6 }}>
            +91 91234 56789<br/><br/>
            45 Tech Park, Block C<br/>
            Bangalore, Karnataka 560001<br/>
            India
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--color-ink)', textDecoration: 'underline', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Edit</button>
            <button style={{ background: 'none', border: 'none', color: 'var(--color-error)', textDecoration: 'underline', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Delete</button>
            <button style={{ background: 'none', border: 'none', color: 'var(--color-ink-muted)', textDecoration: 'underline', fontSize: '12px', cursor: 'pointer', marginLeft: 'auto', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Set as Default</button>
          </div>
        </div>

      </div>
    </div>
  );
}
