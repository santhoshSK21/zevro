'use client';

import React, { useState } from 'react';

export default function SuperAdminAuditPage() {
  const [filterType, setFilterType] = useState('ALL');

  const auditEvents = [
    { id: 'LOG-8891', timestamp: '2026-09-19 23:45:10', admin: 'Santhosh Kumar', role: 'Super Admin', action: 'CREATE_ADMIN', details: 'Provisioned new Store Manager account for radhika.s@zevro.in', ip: '103.24.11.89', severity: 'INFO' },
    { id: 'LOG-8890', timestamp: '2026-09-19 21:12:04', admin: 'Aisha Mehta', role: 'Store Manager', action: 'UPDATE_PRODUCT_PRICE', details: 'Changed price of SKU ZEV-ETH-001 from ₹5,999 to ₹5,499', ip: '49.36.120.15', severity: 'WARN' },
    { id: 'LOG-8889', timestamp: '2026-09-19 19:30:22', admin: 'Devraj Chauhan', role: 'Marketing Specialist', action: 'CREATE_COUPON', details: 'Created coupon FESTIVE25 with max discount ₹2,000', ip: '122.161.45.2', severity: 'INFO' },
    { id: 'LOG-8888', timestamp: '2026-09-19 16:05:44', admin: 'Vikram Sengupta', role: 'Inventory Lead', action: 'STOCK_OVERRIDE', details: 'Added +50 units to Raw Silk Co-ord Set (Size M)', ip: '182.70.19.88', severity: 'INFO' },
    { id: 'LOG-8887', timestamp: '2026-09-19 14:22:18', admin: 'Neha Kapoor', role: 'Customer Support Lead', action: 'CANCEL_ORDER', details: 'Cancelled Order #ZEV-99120 per customer phone request', ip: '157.34.89.201', severity: 'WARN' },
    { id: 'LOG-8886', timestamp: '2026-09-19 10:01:00', admin: 'System Scheduler', role: 'System', action: 'DB_BACKUP_TRIGGERED', details: 'Automated snapshot backup created successfully', ip: '127.0.0.1', severity: 'SYSTEM' },
  ];

  const filteredLogs = auditEvents.filter(e => filterType === 'ALL' || e.severity === filterType);

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', letterSpacing: '0.16em', color: '#D4AF37', textTransform: 'uppercase', fontWeight: 600 }}>
            IMMUTABLE AUDIT TRAIL
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#FAF8F5', margin: '4px 0 0 0' }}>
            Security & Activity Audit Logs
          </h1>
          <p style={{ fontSize: '13px', color: '#8E8880', margin: '4px 0 0 0' }}>
            Real-time compliance record of all admin mutations, permissions escalations, and system actions.
          </p>
        </div>

        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: '10px 18px', backgroundColor: '#161614', border: '1px solid #333', borderRadius: '6px', color: '#FAF8F5', fontSize: '13px', outline: 'none' }}
        >
          <option value="ALL">All Severity Levels ({auditEvents.length})</option>
          <option value="INFO">Information (INFO)</option>
          <option value="WARN">Audit Warning (WARN)</option>
          <option value="SYSTEM">System Automations (SYSTEM)</option>
        </select>
      </div>

      {/* Logs Table */}
      <div style={{ backgroundColor: '#161614', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#1E1E1B', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#A0988E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Log Ref / Time</th>
              <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#A0988E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actor</th>
              <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#A0988E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Action & Mutation</th>
              <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#A0988E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Source IP</th>
              <th style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 600, color: '#A0988E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Severity</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#D4AF37' }}>{log.id}</div>
                  <div style={{ fontSize: '11px', color: '#777', marginTop: '2px' }}>{log.timestamp}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FAF8F5' }}>{log.admin}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>{log.role}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#FAF8F5', backgroundColor: '#0D0D0C', padding: '2px 6px', borderRadius: '3px', border: '1px solid #333' }}>
                    {log.action}
                  </span>
                  <div style={{ fontSize: '12px', color: '#B0A99F', marginTop: '6px' }}>{log.details}</div>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '12px', color: '#888', fontFamily: 'monospace' }}>
                  {log.ip}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '12px',
                    backgroundColor: log.severity === 'WARN' ? 'rgba(255, 183, 77, 0.15)' : log.severity === 'SYSTEM' ? 'rgba(100, 181, 246, 0.15)' : 'rgba(129, 199, 132, 0.15)',
                    color: log.severity === 'WARN' ? '#FFB74D' : log.severity === 'SYSTEM' ? '#64B5F6' : '#81C784'
                  }}>
                    {log.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
