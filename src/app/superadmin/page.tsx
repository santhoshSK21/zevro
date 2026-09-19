'use client';

import React from 'react';
import Link from 'next/link';

export default function SuperAdminDashboard() {
  const metrics = {
    grossPlatformRevenue: '₹48,92,300',
    revenueGrowth: '+24.6%',
    totalAdmins: 5,
    activeAdmins: 4,
    monthlyActiveUsers: '14,280',
    dbHealth: 'Optimal (12ms latency)',
    securityScore: '98/100',
    pendingApprovals: 2
  };

  const quickActions = [
    { title: 'Admins & Roles', desc: 'Manage privileges & staff credentials', href: '/superadmin/admins', icon: '👥', color: '#D4AF37' },
    { title: 'Deep Analytics', desc: 'Conversion funnels & platform telemetry', href: '/superadmin/analytics', icon: '📊', color: '#64B5F6' },
    { title: 'Theme & Color Creator', desc: 'Design tokens & live storefront theme', href: '/admin/theme', icon: '🎨', color: '#BA68C8' },
    { title: 'Financial Reports', desc: 'Export sales sheets & profit margins', href: '/admin/reports', icon: '📈', color: '#81C784' },
    { title: 'Audit Trail', desc: 'Inspect admin modification logs', href: '/superadmin/audit', icon: '🛡️', color: '#FFB74D' },
    { title: 'System Diagnostics', desc: 'MongoDB connections & Redis cache', href: '/superadmin/system', icon: '⚡', color: '#4DB6AC' }
  ];

  const recentLogs = [
    { id: 1, action: 'Product Price Modified', user: 'Aisha Mehta (Store Manager)', target: 'Ivory Anarkali Set', time: '14 mins ago', status: 'Approved' },
    { id: 2, action: 'New Discount Created', user: 'Devraj Chauhan (Marketing)', target: 'FESTIVE25 (25% OFF)', time: '1 hour ago', status: 'Active' },
    { id: 3, action: 'Admin Role Escalated', user: 'Santhosh Kumar (Superadmin)', target: 'Neha Kapoor -> Support Lead', time: '3 hours ago', status: 'Logged' },
    { id: 4, action: 'Order Refund Processed', user: 'Neha Kapoor (Support)', target: 'Order #ZEV-99120', time: '5 hours ago', status: 'Completed' },
  ];

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
      
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', letterSpacing: '0.16em', color: '#D4AF37', textTransform: 'uppercase', fontWeight: 600 }}>
            COMMAND CONSOLE • ENTERPRISE GOVERNANCE
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#FAF8F5', margin: '4px 0 0 0' }}>
            Platform Overview & Master Controls
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link 
            href="/superadmin/admins"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#D4AF37', color: '#000', borderRadius: '6px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            <span>+</span> Add Admin User
          </Link>
          <Link 
            href="/admin"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#FAF8F5', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            Standard Store Admin →
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        
        <div style={{ backgroundColor: '#161614', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#A0988E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Platform Gross GMV</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#81C784', backgroundColor: 'rgba(76, 175, 80, 0.15)', padding: '2px 8px', borderRadius: '12px' }}>{metrics.revenueGrowth}</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#FAF8F5' }}>{metrics.grossPlatformRevenue}</div>
          <p style={{ fontSize: '11px', color: '#777', margin: '4px 0 0 0' }}>All-time multi-channel volume</p>
        </div>

        <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#A0988E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Administrators</span>
            <span style={{ fontSize: '11px', color: '#D4AF37', fontWeight: 600 }}>{metrics.activeAdmins} of {metrics.totalAdmins} Active</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#FAF8F5' }}>{metrics.totalAdmins} Staff</div>
          <p style={{ fontSize: '11px', color: '#777', margin: '4px 0 0 0' }}>2 Superadmins, 3 Managers</p>
        </div>

        <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#A0988E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Monthly Active Users</span>
            <span style={{ fontSize: '11px', color: '#64B5F6', fontWeight: 600 }}>+15.2% MoM</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#FAF8F5' }}>{metrics.monthlyActiveUsers}</div>
          <p style={{ fontSize: '11px', color: '#777', margin: '4px 0 0 0' }}>Storefront & mobile visitors</p>
        </div>

        <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#A0988E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Database & Security</span>
            <span style={{ fontSize: '11px', color: '#81C784', fontWeight: 700 }}>{metrics.securityScore}</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#81C784' }}>{metrics.dbHealth}</div>
          <p style={{ fontSize: '11px', color: '#777', margin: '4px 0 0 0' }}>Zero security vulnerabilities</p>
        </div>

      </div>

      {/* Quick Launchpad */}
      <h3 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '16px' }}>
        Master Governance Modules
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {quickActions.map(action => (
          <Link
            key={action.title}
            href={action.href}
            style={{
              backgroundColor: '#161614',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '20px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${action.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              {action.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#FAF8F5', margin: '0 0 4px 0' }}>{action.title}</h4>
              <p style={{ fontSize: '12px', color: '#8E8880', margin: 0 }}>{action.desc}</p>
            </div>
            <span style={{ color: action.color, fontSize: '16px' }}>→</span>
          </Link>
        ))}
      </div>

      {/* Recent Activity Audit Stream */}
      <div style={{ backgroundColor: '#161614', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FAF8F5', margin: 0 }}>
            Live Security & Staff Activity Audit Trail
          </h3>
          <Link href="/superadmin/audit" style={{ fontSize: '12px', color: '#D4AF37', textDecoration: 'none' }}>
            View Full Audit Log →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentLogs.map(log => (
            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#1E1E1B', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FAF8F5' }}>{log.action}</span>
                <span style={{ fontSize: '12px', color: '#B49A68', marginLeft: '12px' }}>{log.target}</span>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Initiated by {log.user}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', background: 'rgba(212,175,55,0.12)', color: '#D4AF37', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>{log.status}</span>
                <div style={{ fontSize: '11px', color: '#777', marginTop: '4px' }}>{log.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
