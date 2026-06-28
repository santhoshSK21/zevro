'use client';

import React, { useEffect } from 'react';
import { useConfigStore } from '../../store/configStore';

export default function ContactPage() {
  const { config, fetchConfig } = useConfigStore();

  useEffect(() => {
    if (!config) fetchConfig();
  }, [config, fetchConfig]);

  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main className="container" style={{ padding: '80px 24px', flex: 1, maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '32px', color: 'var(--espresso)' }}>Contact {config?.storeName || 'Us'}</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px' }}>
          
          <div style={{ color: 'var(--warm-grey)', lineHeight: 1.8, fontSize: '15px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--espresso)', marginBottom: '16px' }}>Get in Touch</h3>
            <p style={{ marginBottom: '24px' }}>We would love to hear from you. Please fill out the form or contact us directly.</p>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Email:</strong><br/>
              <a href={`mailto:${config?.supportEmail || 'support@zevro.in'}`} style={{ color: 'inherit' }}>{config?.supportEmail || 'support@zevro.in'}</a>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Phone:</strong><br/>
              <a href={`tel:${config?.supportPhone || '+919876543210'}`} style={{ color: 'inherit' }}>{config?.supportPhone || '+91 98765 43210'}</a>
            </div>
            
            {config?.whatsappNumber && (
              <div style={{ marginBottom: '16px' }}>
                <strong>WhatsApp:</strong><br/>
                <a href={`https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, '')}`} style={{ color: 'inherit' }}>{config.whatsappNumber}</a>
              </div>
            )}
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Support Hours:</strong><br/>
              {config?.supportHours || 'Mon-Sat, 9AM-6PM IST'}
            </div>
          </div>

          <div>
            <form style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <input type="text" placeholder="Name" style={{padding: '12px', border: '1px solid var(--linen)', outline: 'none'}} />
              <input type="email" placeholder="Email" style={{padding: '12px', border: '1px solid var(--linen)', outline: 'none'}} />
              <input type="text" placeholder="Subject" style={{padding: '12px', border: '1px solid var(--linen)', outline: 'none'}} />
              <textarea placeholder="Message" rows={5} style={{padding: '12px', border: '1px solid var(--linen)', outline: 'none'}}></textarea>
              <button type="button" className="btn btn-primary" style={{ padding: '16px' }}>SEND MESSAGE</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
  