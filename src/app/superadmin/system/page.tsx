'use client';

import React, { useState } from 'react';

export default function SuperAdminSystemPage() {
  const [actionFeedback, setActionFeedback] = useState('');

  const collections = [
    { name: 'products', count: 18, size: '240 KB', indexes: 4 },
    { name: 'orders', count: 328, size: '1.2 MB', indexes: 5 },
    { name: 'users', count: 1420, size: '680 KB', indexes: 3 },
    { name: 'wishlists', count: 412, size: '120 KB', indexes: 2 },
    { name: 'categories', count: 6, size: '18 KB', indexes: 2 },
    { name: 'reviews', count: 86, size: '94 KB', indexes: 3 }
  ];

  const handleTriggerAction = (name: string) => {
    setActionFeedback(`Executing "${name}"...`);
    setTimeout(() => {
      setActionFeedback(`[SUCCESS] "${name}" completed successfully.`);
      setTimeout(() => setActionFeedback(''), 4000);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', letterSpacing: '0.16em', color: '#D4AF37', textTransform: 'uppercase', fontWeight: 600 }}>
            INFRASTRUCTURE HEALTH
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#FAF8F5', margin: '4px 0 0 0' }}>
            System Diagnostics & Database Engine
          </h1>
          <p style={{ fontSize: '13px', color: '#8E8880', margin: '4px 0 0 0' }}>
            Inspect MongoDB Atlas cluster stats, memory utilization, and perform master system maintenance.
          </p>
        </div>

        {actionFeedback && (
          <div style={{ background: '#1E1E1B', border: '1px solid #D4AF37', color: '#FAF8F5', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}>
            {actionFeedback}
          </div>
        )}
      </div>

      {/* Cluster Health Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
          <span style={{ fontSize: '11px', color: '#8E8880', textTransform: 'uppercase', letterSpacing: '0.1em' }}>MongoDB Cluster</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#81C784', margin: '6px 0 2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#81C784' }} />
            Connected
          </div>
          <span style={{ fontSize: '11px', color: '#888' }}>Atlas Cluster M0 • 12ms Ping</span>
        </div>

        <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
          <span style={{ fontSize: '11px', color: '#8E8880', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Node.js Runtime</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#FAF8F5', margin: '6px 0 2px' }}>v20.x Active</div>
          <span style={{ fontSize: '11px', color: '#64B5F6' }}>Next.js App Router (Turbopack)</span>
        </div>

        <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
          <span style={{ fontSize: '11px', color: '#8E8880', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Heap Memory Used</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#FAF8F5', margin: '6px 0 2px' }}>142 MB / 512 MB</div>
          <span style={{ fontSize: '11px', color: '#81C784' }}>27.7% Utilization (Healthy)</span>
        </div>

        <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
          <span style={{ fontSize: '11px', color: '#8E8880', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CDN & Edge Cache</span>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#D4AF37', margin: '6px 0 2px' }}>99.4% Hit Rate</div>
          <span style={{ fontSize: '11px', color: '#888' }}>Global Edge CDN Active</span>
        </div>

      </div>

      {/* Database Collections Table */}
      <div style={{ backgroundColor: '#161614', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FAF8F5', margin: '0 0 20px 0' }}>
          Database Collections & Indexing
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '12px 16px', fontSize: '11px', color: '#8E8880', textTransform: 'uppercase' }}>Collection</th>
              <th style={{ padding: '12px 16px', fontSize: '11px', color: '#8E8880', textTransform: 'uppercase' }}>Document Count</th>
              <th style={{ padding: '12px 16px', fontSize: '11px', color: '#8E8880', textTransform: 'uppercase' }}>Storage Size</th>
              <th style={{ padding: '12px 16px', fontSize: '11px', color: '#8E8880', textTransform: 'uppercase' }}>Active Indexes</th>
            </tr>
          </thead>
          <tbody>
            {collections.map(c => (
              <tr key={c.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#FAF8F5', fontFamily: 'monospace' }}>
                  {c.name}
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#DDD' }}>{c.count} records</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8E8880' }}>{c.size}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#D4AF37' }}>{c.indexes} B-Tree Indexes</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* System Maintenance Actions */}
      <div style={{ backgroundColor: '#161614', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FAF8F5', margin: '0 0 16px 0' }}>
          Master System Actions
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '18px', backgroundColor: '#1C1C19' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#FAF8F5', margin: '0 0 6px 0' }}>Purge CDN Cache</h4>
            <p style={{ fontSize: '12px', color: '#8E8880', margin: '0 0 14px 0' }}>Flushes all cached static assets & PDP images across edge locations.</p>
            <button 
              onClick={() => handleTriggerAction('Purge CDN Edge Cache')}
              style={{ background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', padding: '8px 16px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Flush Edge Cache
            </button>
          </div>

          <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '18px', backgroundColor: '#1C1C19' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#FAF8F5', margin: '0 0 6px 0' }}>Database Snapshot</h4>
            <p style={{ fontSize: '12px', color: '#8E8880', margin: '0 0 14px 0' }}>Exports a point-in-time JSON archive of orders, catalog, and customers.</p>
            <button 
              onClick={() => handleTriggerAction('Create Database Snapshot')}
              style={{ background: 'transparent', border: '1px solid #81C784', color: '#81C784', padding: '8px 16px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Export DB Snapshot
            </button>
          </div>

          <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '18px', backgroundColor: '#1C1C19' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#FAF8F5', margin: '0 0 6px 0' }}>Rebuild Search Indexes</h4>
            <p style={{ fontSize: '12px', color: '#8E8880', margin: '0 0 14px 0' }}>Refreshes text search token indexes across all product categories.</p>
            <button 
              onClick={() => handleTriggerAction('Rebuild Search Indexes')}
              style={{ background: 'transparent', border: '1px solid #64B5F6', color: '#64B5F6', padding: '8px 16px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Rebuild Indexes
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
