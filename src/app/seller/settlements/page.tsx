'use client';

import React, { useEffect, useState } from 'react';
import {
  Landmark,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';

export default function SellerSettlementsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seller/settlements');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const exportCsv = () => {
    if (!payouts || payouts.length === 0) return;
    const headers = ['Order Reference', 'Order Date', 'Customer', 'Gross Amount', 'Commission Fee', 'Gateway Fee', 'Net Payout', 'Settlement Status', 'Bank UTR Reference', 'Estimated Transfer Date'];
    const rows = payouts.map((p: any) => [
      p.id,
      new Date(p.date).toLocaleDateString(),
      p.customerName || 'Customer',
      p.grossAmount,
      p.marketplaceFee || 0,
      p.gatewayFee || 0,
      p.netPayout,
      p.status,
      p.utr || 'N/A',
      p.payoutDate || 'N/A'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e: any[]) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Zevro_Settlements_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const summary = data?.summary;
  const payouts = data?.payouts || [];
  const bank = data?.bankAccount;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 600, margin: '0 0 6px', letterSpacing: '-0.02em', color: '#1C1C1A' }}>
            Payments, Fees & Settlements
          </h1>
          <p style={{ color: '#68645C', fontSize: '14px', margin: 0 }}>
            Track order payouts, marketplace commission deductions, and automated bank disbursements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={exportCsv}
            disabled={payouts.length === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#1C1C1A',
              color: '#FAF8F5',
              border: 'none',
              padding: '9px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: payouts.length === 0 ? 'not-allowed' : 'pointer',
              opacity: payouts.length === 0 ? 0.6 : 1,
            }}
          >
            <Download size={14} color="#C5A880" /> Export CSV Statement
          </button>

          <button
            onClick={fetchSettlements}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#FFFFFF',
              border: '1px solid #E8E2D6',
              padding: '9px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} /> Refresh Statement
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E2D6', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#68645C' }}>Total Gross Sales</div>
          <div style={{ fontSize: '28px', fontWeight: 700, margin: '10px 0 4px', color: '#1C1C1A' }}>
            ₹{(summary?.grossSales || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div style={{ fontSize: '12px', color: '#2E7D32' }}>Cumulative order transactions</div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E8E2D6', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#68645C' }}>Marketplace Fees</div>
          <div style={{ fontSize: '28px', fontWeight: 700, margin: '10px 0 4px', color: '#2E7D32' }}>
            ₹0 (0%)
          </div>
          <div style={{ fontSize: '12px', color: '#68645C' }}>Zero commission for partner brand</div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E8E2D6', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#68645C' }}>Net Estimated Payout</div>
          <div style={{ fontSize: '28px', fontWeight: 700, margin: '10px 0 4px', color: '#B49A68' }}>
            ₹{(summary?.netPayout || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div style={{ fontSize: '12px', color: '#68645C' }}>Cycle: {summary?.settlementCycle || 'T+3 Days'}</div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E8E2D6', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#68645C' }}>Disbursement Bank</div>
          <div style={{ fontSize: '16px', fontWeight: 600, margin: '10px 0 2px' }}>
            {bank?.bankName || 'HDFC Bank'}
          </div>
          <div style={{ fontSize: '12px', color: '#68645C' }}>
            A/C: •••• {bank?.accountNumber?.slice(-4) || '8821'} ({bank?.ifscCode || 'HDFC0001234'})
          </div>
        </div>
      </div>

      {/* Payouts Ledger Table */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8E2D6',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E8E2D6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#F8F6F0',
          }}
        >
          <div style={{ fontSize: '15px', fontWeight: 600 }}>Settlement Ledger</div>
          <span style={{ fontSize: '12px', color: '#68645C' }}>Direct NEFT / RTGS Transfers</span>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#68645C' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid #E8E2D6',
                borderTopColor: '#1C1C1A',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px',
              }}
            />
            Loading settlement ledger...
          </div>
        ) : payouts.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#68645C' }}>
            <Landmark size={40} color="#B49A68" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1C1C1A' }}>No settlement records yet</div>
            <p style={{ fontSize: '13px', margin: '4px 0 0' }}>Cleared sales will be recorded here for disbursement.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr
                style={{
                  background: '#F8F6F0',
                  borderBottom: '1px solid #E8E2D6',
                  color: '#68645C',
                  textTransform: 'uppercase',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                }}
              >
                <th style={{ padding: '14px 20px' }}>Order Reference</th>
                <th style={{ padding: '14px 20px' }}>Order Date</th>
                <th style={{ padding: '14px 20px' }}>Gross Sale</th>
                <th style={{ padding: '14px 20px' }}>Fee (0% Comm + 2% PG)</th>
                <th style={{ padding: '14px 20px' }}>Net Payout</th>
                <th style={{ padding: '14px 20px' }}>Bank UTR Ref</th>
                <th style={{ padding: '14px 20px' }}>Settlement Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F0ECE4' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>{p.id}</td>
                  <td style={{ padding: '14px 20px', color: '#68645C' }}>
                    {new Date(p.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                    ₹{p.grossAmount.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#68645C', fontSize: '12px' }}>
                    -₹{(p.marketplaceFee + (p.gatewayFee || 0)).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#1C1C1A' }}>
                    ₹{p.netPayout.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontSize: '11px', color: p.utr !== 'Awaiting Dispatch' ? '#1565C0' : '#888' }}>
                    {p.utr}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span
                      style={{
                        background: p.status === 'Settled' ? '#E8F5E9' : '#FFF3E0',
                        color: p.status === 'Settled' ? '#2E7D32' : '#E65100',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
