'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  PackageCheck,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Star,
  Award,
  ArrowUpRight,
  HelpCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface DailySale {
  date: string;
  label: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  name: string;
  units: number;
  revenue: number;
  image: string;
  category: string;
}

interface AnalyticsData {
  summary: {
    totalRevenue: number;
    ordersCount: number;
    unitsSold: number;
    averageOrderValue: number;
    range: string;
  };
  dailySales: DailySale[];
  statusBreakdown: {
    delivered: number;
    shipped: number;
    pending: number;
    cancelled: number;
    total: number;
  };
  topProducts: TopProduct[];
  qualityScore: {
    onTimeDispatchRate: number;
    returnRate: number;
    customerRating: number;
    ratingCount: number;
    sellerBadge: string;
  };
}

export default function SellerAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'today' | '7d' | '30d' | 'all'>('7d');
  const [hoveredBar, setHoveredBar] = useState<DailySale | null>(null);

  const fetchAnalytics = async (selectedRange: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/seller/analytics?range=${selectedRange}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load seller analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(range);
  }, [range]);

  const maxDailyRevenue = data?.dailySales?.length
    ? Math.max(...data.dailySales.map((d) => d.revenue), 1000)
    : 1000;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header & Date Range Filter */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
              fontSize: '28px',
              fontWeight: 700,
              color: '#1C1C1A',
              margin: '0 0 6px',
            }}
          >
            Sales & Performance Analytics
          </h1>
          <p style={{ color: '#68645C', fontSize: '13px', margin: 0 }}>
            Clear insights into your store's sales revenue, popular collections, and order fulfillment speed.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid #E8E2D6',
            gap: '4px',
          }}
        >
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: 'all', label: 'All Time' },
          ].map((tab) => {
            const active = range === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setRange(tab.id as any)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: active ? 600 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: active ? '#1C1C1A' : 'transparent',
                  color: active ? '#FAF8F5' : '#68645C',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading && !data ? (
        <div
          style={{
            padding: '80px 20px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E8E2D6',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '3px solid #E8E2D6',
              borderTopColor: '#B49A68',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: '#68645C', fontSize: '14px' }}>Calculating store analytics...</p>
        </div>
      ) : (
        <>
          {/* Top 4 Clear Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '18px',
            }}
          >
            {/* Card 1: Gross Sales */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E8E2D6',
                padding: '22px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#68645C' }}>Total Gross Revenue</span>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={18} color="#2E7D32" />
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#1C1C1A', marginBottom: '6px' }}>
                ₹{((data?.summary?.totalRevenue || 0) / 100).toLocaleString('en-IN')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#2E7D32' }}>
                <span style={{ fontWeight: 600 }}>↑ +14.8%</span>
                <span style={{ color: '#8C857B' }}>vs previous period</span>
              </div>
            </div>

            {/* Card 2: Orders Count */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E8E2D6',
                padding: '22px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#68645C' }}>Customer Orders</span>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={18} color="#B49A68" />
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#1C1C1A', marginBottom: '6px' }}>
                {data?.summary?.ordersCount || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#68645C' }}>
                Confirmed customer purchases
              </div>
            </div>

            {/* Card 3: Average Order Value */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E8E2D6',
                padding: '22px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#68645C' }}>Average Basket (AOV)</span>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={18} color="#1C1C1A" />
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#1C1C1A', marginBottom: '6px' }}>
                ₹{((data?.summary?.averageOrderValue || 0) / 100).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '12px', color: '#68645C' }}>
                Average spend per order
              </div>
            </div>

            {/* Card 4: Total Units Sold */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E8E2D6',
                padding: '22px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#68645C' }}>Garments & Units Sold</span>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PackageCheck size={18} color="#2E7D32" />
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#1C1C1A', marginBottom: '6px' }}>
                {data?.summary?.unitsSold || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#68645C' }}>
                Items dispatched or in transit
              </div>
            </div>
          </div>

          {/* Interactive Daily Sales Revenue Chart */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E8E2D6',
              padding: '28px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '28px',
                gap: '12px',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
                    fontSize: '19px',
                    fontWeight: 600,
                    color: '#1C1C1A',
                    margin: '0 0 4px',
                  }}
                >
                  Revenue Trend
                </h3>
                <p style={{ color: '#68645C', fontSize: '12px', margin: 0 }}>
                  Hover over any column to see the exact earnings and order count for that day.
                </p>
              </div>

              {hoveredBar && (
                <div
                  style={{
                    backgroundColor: '#1C1C1A',
                    color: '#FAF8F5',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span>
                    <strong>{hoveredBar.label}</strong>
                  </span>
                  <span style={{ color: '#E4D5B7', fontWeight: 700 }}>
                    ₹{(hoveredBar.revenue / 100).toLocaleString('en-IN')}
                  </span>
                  <span style={{ color: '#A8A29E' }}>({hoveredBar.orders} orders)</span>
                </div>
              )}
            </div>

            {/* SVG / Pure CSS Visual Bar Chart */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                height: '220px',
                gap: '12px',
                paddingTop: '20px',
                borderBottom: '2px solid #E8E2D6',
              }}
            >
              {data?.dailySales?.map((day) => {
                const heightPercent = Math.max(12, Math.round((day.revenue / maxDailyRevenue) * 100));
                const isHovered = hoveredBar?.date === day.date;

                return (
                  <div
                    key={day.date}
                    onMouseEnter={() => setHoveredBar(day)}
                    onMouseLeave={() => setHoveredBar(null)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'flex-end',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    {/* Bar */}
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '44px',
                        height: `${heightPercent}%`,
                        backgroundColor: isHovered ? '#1C1C1A' : '#B49A68',
                        borderRadius: '6px 6px 0 0',
                        transition: 'all 0.2s ease',
                        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Chart X-Axis Labels */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              {data?.dailySales?.map((day) => (
                <div
                  key={day.date}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '11px',
                    color: hoveredBar?.date === day.date ? '#1C1C1A' : '#8C857B',
                    fontWeight: hoveredBar?.date === day.date ? 700 : 500,
                  }}
                >
                  {day.label}
                </div>
              ))}
            </div>
          </div>

          {/* Two-Column Lower Section: Top Products & Fulfillment Health */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Left: Best-Selling Products Leaderboard */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E8E2D6',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#1C1C1A',
                    margin: 0,
                  }}
                >
                  Top Performing Pieces
                </h3>
                <Link
                  href="/seller/products"
                  style={{ fontSize: '12px', color: '#B49A68', fontWeight: 600, textDecoration: 'none' }}
                >
                  View All Products →
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {data?.topProducts?.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      backgroundColor: '#F8F6F0',
                      borderRadius: '10px',
                      border: '1px solid #E8E2D6',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: idx === 0 ? '#B49A68' : '#E8E2D6',
                          color: idx === 0 ? '#FAF8F5' : '#1C1C1A',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        #{idx + 1}
                      </span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1A', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#68645C' }}>
                          {p.units} units sold • {p.category}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C1C1A' }}>
                        ₹{(p.revenue / 100).toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '10px', color: '#2E7D32', fontWeight: 600 }}>
                        High Demand
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Seller Fulfillment Health & Quality Score */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E8E2D6',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#1C1C1A',
                    margin: 0,
                  }}
                >
                  Account Health & Trust
                </h3>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#FBF5E8',
                    border: '1px solid #E8D7B5',
                    color: '#8C6C26',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: '20px',
                  }}
                >
                  <Award size={13} /> {data?.qualityScore.sellerBadge}
                </span>
              </div>

              {/* Health Metrics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                {/* On-Time Dispatch */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#1C1C1A', fontWeight: 600 }}>On-Time Dispatch Rate</span>
                    <strong style={{ color: '#2E7D32' }}>{data?.qualityScore.onTimeDispatchRate}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#F0ECE4', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${data?.qualityScore.onTimeDispatchRate}%`, height: '100%', backgroundColor: '#2E7D32', borderRadius: '4px' }} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#8C857B', marginTop: '4px' }}>Target: &gt;95% within 48 business hours</div>
                </div>

                {/* Return Rate */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#1C1C1A', fontWeight: 600 }}>Customer Return Rate</span>
                    <strong style={{ color: '#2E7D32' }}>{data?.qualityScore.returnRate}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#F0ECE4', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (data?.qualityScore.returnRate || 1.4) * 10)}%`, height: '100%', backgroundColor: '#2E7D32', borderRadius: '4px' }} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#8C857B', marginTop: '4px' }}>Industry Benchmark: &lt;3% for luxury apparel</div>
                </div>

                {/* Customer Satisfaction */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#1C1C1A', fontWeight: 600 }}>Store Customer Rating</span>
                    <strong style={{ color: '#B49A68' }}>{data?.qualityScore.customerRating.toFixed(1)} / 5.0 ★</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#F0ECE4', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '98%', height: '100%', backgroundColor: '#B49A68', borderRadius: '4px' }} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#8C857B', marginTop: '4px' }}>Based on {data?.qualityScore.ratingCount} verified buyer reviews</div>
                </div>
              </div>

              {/* Actionable Seller Tip */}
              <div
                style={{
                  marginTop: 'auto',
                  padding: '14px',
                  backgroundColor: '#F8F6F0',
                  borderRadius: '10px',
                  border: '1px solid #E8E2D6',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <Sparkles size={18} color="#B49A68" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '11px', color: '#68645C', lineHeight: 1.5 }}>
                  <strong style={{ color: '#1C1C1A' }}>Zevro Partner Advantage:</strong> Maintaining an on-time dispatch rate above 98% keeps your products prominently featured on customer category landing pages.
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
    </div>
  );
}
