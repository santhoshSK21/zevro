'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Boxes,
  TrendingUp,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Layers,
  ChevronRight,
  ChevronDown,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  TrendingDown,
  Sparkles,
  Info,
  Calendar,
  Activity,
  PackageX,
  PackageCheck,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { MovementClass, VariantSizeMovement } from '@/app/api/admin/inventory/movement/route';

export default function AdminInventoryMovementPage() {
  const [loading, setLoading] = useState(true);
  const [flatVariants, setFlatVariants] = useState<VariantSizeMovement[]>([]);
  const [hierarchicalProducts, setHierarchicalProducts] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalVariants: 0,
    movingCount: 0,
    slowCount: 0,
    noMovementCount: 0,
    outOfStockCount: 0,
    newArrivalCount: 0,
    totalAvailableUnits: 0,
    totalReservedUnits: 0,
    capitalInDeadStockPaise: 0,
  });
  const [filterOptions, setFilterOptions] = useState<{
    categories: string[];
    brands: string[];
    colors: string[];
    sizes: string[];
  }>({
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
  });

  // Filter States
  const [movementTab, setMovementTab] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [colorFilter, setColorFilter] = useState('ALL');
  const [sizeFilter, setSizeFilter] = useState('ALL');
  const [ageingFilter, setAgeingFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // View Mode: 'HIERARCHICAL' vs 'SKU_TABLE'
  const [viewMode, setViewMode] = useState<'HIERARCHICAL' | 'SKU_TABLE'>('HIERARCHICAL');

  // Stock Adjust Modal State
  const [adjustingItem, setAdjustingItem] = useState<VariantSizeMovement | null>(null);
  const [adjustForm, setAdjustForm] = useState({
    quantityChange: 0,
    type: 'STOCK_ADJUSTMENT',
    reason: '',
  });
  const [savingAdjust, setSavingAdjust] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Detail Modal
  const [detailModalItem, setDetailModalItem] = useState<VariantSizeMovement | null>(null);

  const fetchMovementData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (movementTab !== 'ALL') params.set('movement', movementTab);
      if (categoryFilter !== 'ALL') params.set('category', categoryFilter);
      if (brandFilter !== 'ALL') params.set('brand', brandFilter);
      if (colorFilter !== 'ALL') params.set('color', colorFilter);
      if (sizeFilter !== 'ALL') params.set('size', sizeFilter);
      if (ageingFilter !== 'all') params.set('ageing', ageingFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/admin/inventory/movement?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load movement intelligence');
      const data = await res.json();

      setFlatVariants(data.flatVariants || []);
      setHierarchicalProducts(data.hierarchicalProducts || []);
      if (data.summary) setSummary(data.summary);
      if (data.filterOptions) setFilterOptions(data.filterOptions);
    } catch (err: any) {
      console.error(err);
      setToast({ message: err.message || 'Error loading movement intelligence', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [movementTab, categoryFilter, brandFilter, colorFilter, sizeFilter, ageingFilter, searchQuery]);

  useEffect(() => {
    fetchMovementData();
  }, [fetchMovementData]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem || adjustForm.quantityChange === 0) return;

    if (adjustingItem.availableStock + adjustForm.quantityChange < 0) {
      showToast('Resulting stock level cannot be negative', 'error');
      return;
    }

    setSavingAdjust(true);
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: adjustingItem.productId,
          variantId: adjustingItem.variantId,
          size: adjustingItem.size,
          quantityChange: adjustForm.quantityChange,
          type: adjustForm.type,
          reason: adjustForm.reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to adjust stock');

      showToast(`Stock updated to ${data.newStock} units for SKU ${adjustingItem.sku}`, 'success');
      setAdjustingItem(null);
      setAdjustForm({ quantityChange: 0, type: 'STOCK_ADJUSTMENT', reason: '' });
      fetchMovementData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock', 'error');
    } finally {
      setSavingAdjust(false);
    }
  };

  // Badge Styling for Movement Status
  const renderMovementBadge = (status: MovementClass) => {
    switch (status) {
      case 'MOVING':
        return (
          <span className="mov-badge is-moving" title="Fast sales velocity & steady customer demand">
            <TrendingUp size={11} />
            <span>MOVING</span>
          </span>
        );
      case 'SLOW':
        return (
          <span className="mov-badge is-slow" title="Sluggish movement over 30–60 days">
            <Activity size={11} />
            <span>SLOW</span>
          </span>
        );
      case 'NO_MOVEMENT':
        return (
          <span className="mov-badge is-nomovement" title="Dead stock: Zero or stalled sales for 60+ days">
            <PackageX size={11} />
            <span>NO MOVEMENT</span>
          </span>
        );
      case 'OUT_OF_STOCK':
        return (
          <span className="mov-badge is-oos" title="Zero units currently available">
            <AlertCircle size={11} />
            <span>OUT OF STOCK</span>
          </span>
        );
      case 'NEW_ARRIVAL':
        return (
          <span className="mov-badge is-new" title="Received within the last 30 days">
            <Sparkles size={11} />
            <span>NEW ARRIVAL</span>
          </span>
        );
      default:
        return <span className="mov-badge">{status}</span>;
    }
  };

  return (
    <div className="adm-mov-container">
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 99999,
            padding: '12px 20px',
            borderRadius: '6px',
            color: '#FFFFFF',
            backgroundColor: toast.type === 'success' ? '#166534' : '#DC2626',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="adm-mov-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#8A704C', fontWeight: 700 }}>
              ZEVRO ERP • MODULE 5
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '26px', color: '#111827', margin: 0, fontWeight: 600 }}>
            Product Movement Intelligence
          </h1>
          <p style={{ fontSize: '13px', color: '#595F69', marginTop: '4px', margin: 0 }}>
            Independent inventory velocity, stock ageing, and demand classification evaluated at the exact <strong>Product Variant & Size SKU level</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* View Mode Toggle */}
          <div className="adm-view-toggle">
            <button
              type="button"
              onClick={() => setViewMode('HIERARCHICAL')}
              className={`adm-toggle-btn ${viewMode === 'HIERARCHICAL' ? 'is-active' : ''}`}
            >
              <Layers size={13} />
              <span>Variant Breakdown View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('SKU_TABLE')}
              className={`adm-toggle-btn ${viewMode === 'SKU_TABLE' ? 'is-active' : ''}`}
            >
              <Boxes size={13} />
              <span>SKU Matrix Table</span>
            </button>
          </div>

          <button
            onClick={fetchMovementData}
            disabled={loading}
            className="adm-btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Intelligence Strip */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi-card" onClick={() => setMovementTab('ALL')} style={{ cursor: 'pointer' }}>
          <span className="adm-kpi-title">Tracked Variant SKUs</span>
          <span className="adm-kpi-val">{summary.totalVariants}</span>
          <span className="adm-kpi-sub">{summary.totalAvailableUnits} available • {summary.totalReservedUnits} reserved</span>
        </div>

        <div className="adm-kpi-card is-moving" onClick={() => setMovementTab('MOVING')} style={{ cursor: 'pointer', borderLeft: '4px solid #166534' }}>
          <span className="adm-kpi-title" style={{ color: '#166534' }}>Moving (Fast Velocity)</span>
          <span className="adm-kpi-val" style={{ color: '#166534' }}>{summary.movingCount}</span>
          <span className="adm-kpi-sub">High turn rate & customer demand</span>
        </div>

        <div className="adm-kpi-card is-slow" onClick={() => setMovementTab('SLOW')} style={{ cursor: 'pointer', borderLeft: '4px solid #B45309' }}>
          <span className="adm-kpi-title" style={{ color: '#B45309' }}>Slow Moving</span>
          <span className="adm-kpi-val" style={{ color: '#B45309' }}>{summary.slowCount}</span>
          <span className="adm-kpi-sub">Low velocity in 30–60d window</span>
        </div>

        <div className="adm-kpi-card is-dead" onClick={() => setMovementTab('NO_MOVEMENT')} style={{ cursor: 'pointer', borderLeft: '4px solid #DC2626' }}>
          <span className="adm-kpi-title" style={{ color: '#991B1B' }}>No Movement (Dead Stock)</span>
          <span className="adm-kpi-val" style={{ color: '#DC2626' }}>{summary.noMovementCount}</span>
          <span className="adm-kpi-sub">Zero sales / 60+ days stagnant</span>
        </div>

        <div className="adm-kpi-card" onClick={() => setMovementTab('OUT_OF_STOCK')} style={{ cursor: 'pointer', borderLeft: '4px solid #475569' }}>
          <span className="adm-kpi-title">Out of Stock</span>
          <span className="adm-kpi-val" style={{ color: '#475569' }}>{summary.outOfStockCount}</span>
          <span className="adm-kpi-sub">0 units available</span>
        </div>

        <div className="adm-kpi-card" style={{ borderLeft: '4px solid #C5A869' }}>
          <span className="adm-kpi-title" style={{ color: '#8A704C' }}>Capital in Stagnant Stock</span>
          <span className="adm-kpi-val" style={{ color: '#8A704C' }}>
            ₹{((summary.capitalInDeadStockPaise || 0) / 100).toLocaleString('en-IN')}
          </span>
          <span className="adm-kpi-sub">Locked in slow + dead variants</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="adm-filter-bar">
        {/* Movement Status Tab Selector */}
        <div className="adm-status-tabs">
          {[
            { id: 'ALL', label: 'All Variants', count: summary.totalVariants },
            { id: 'MOVING', label: 'Moving', count: summary.movingCount },
            { id: 'SLOW', label: 'Slow', count: summary.slowCount },
            { id: 'NO_MOVEMENT', label: 'No Movement', count: summary.noMovementCount },
            { id: 'OUT_OF_STOCK', label: 'Out of Stock', count: summary.outOfStockCount },
            { id: 'NEW_ARRIVAL', label: 'New Arrivals', count: summary.newArrivalCount },
          ].map((tab) => {
            const isActive = movementTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMovementTab(tab.id)}
                className={`adm-status-tab-btn ${isActive ? 'is-active' : ''}`}
              >
                <span>{tab.label}</span>
                <span className="adm-tab-pill">{tab.count}</span>
              </button>
            );
          })}
        </div>

        {/* Multi-faceted Selectors */}
        <div className="adm-filter-controls-row">
          {/* Search Box */}
          <div className="adm-search-box">
            <Search size={14} className="adm-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Product, SKU, Color, Category..."
              className="adm-filter-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="adm-clear-btn">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="adm-filter-select"
          >
            <option value="ALL">All Categories</option>
            {filterOptions.categories?.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/-/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="adm-filter-select"
          >
            <option value="ALL">All Brands / Ateliers</option>
            {filterOptions.brands?.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Color Filter */}
          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            className="adm-filter-select"
          >
            <option value="ALL">All Colors</option>
            {filterOptions.colors?.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Size Filter */}
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="adm-filter-select"
          >
            <option value="ALL">All Sizes</option>
            {filterOptions.sizes?.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Ageing Bracket Filter */}
          <select
            value={ageingFilter}
            onChange={(e) => setAgeingFilter(e.target.value)}
            className="adm-filter-select"
          >
            <option value="all">All Stock Ageing</option>
            <option value="0-30">Fresh (0–30 Days)</option>
            <option value="31-60">Medium (31–60 Days)</option>
            <option value="61-90">Aging (61–90 Days)</option>
            <option value="90+">Stagnant (90+ Days)</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ padding: '64px 24px', textAlign: 'center', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
          <div style={{ width: '30px', height: '30px', border: '2px solid #C5A869', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontSize: '13px', color: '#595F69', margin: 0 }}>Computing variant-level sales velocity and stock ageing matrix...</p>
        </div>
      ) : flatVariants.length === 0 ? (
        <div style={{ padding: '64px 24px', textAlign: 'center', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
          <Boxes size={36} color="#9CA3AF" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '18px', color: '#111827', margin: '0 0 8px' }}>
            No Matching Product Variants Found
          </h3>
          <p style={{ fontSize: '13px', color: '#595F69', maxWidth: '420px', margin: '0 auto 16px' }}>
            No inventory variants match your active movement, category, brand, or ageing filters.
          </p>
          <button
            onClick={() => {
              setMovementTab('ALL');
              setCategoryFilter('ALL');
              setBrandFilter('ALL');
              setColorFilter('ALL');
              setSizeFilter('ALL');
              setAgeingFilter('all');
              setSearchQuery('');
            }}
            className="adm-btn-secondary"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'HIERARCHICAL' ? (
        /* ========================================================================= */
        /* VIEW 1: HIERARCHICAL PRODUCT -> COLOR -> SIZE VARIANT BREAKDOWN           */
        /* Directly fulfilling: "Cotton T-shirt -> Black -> S: Moving, M: Moving..." */
        /* ========================================================================= */
        <div className="adm-hierarchical-wrap">
          {hierarchicalProducts.map((prod) => (
            <div key={prod.productId} className="adm-h-card">
              {/* Product Header Row */}
              <div className="adm-h-product-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src={prod.productImage || '/pdp_hero_1.png'}
                    alt={prod.productName}
                    style={{ width: '48px', height: '58px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E5E7EB' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A704C', fontWeight: 600 }}>
                        {prod.category?.replace(/-/g, ' ')}
                      </span>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>•</span>
                      <span style={{ fontSize: '11px', color: '#6B7280' }}>
                        {prod.brand}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>
                      {prod.productName}
                    </h3>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#595F69' }}>
                  <span>{prod.colors?.length || 0} Colorways</span>
                </div>
              </div>

              {/* Colorways and Variant Size Pills */}
              <div className="adm-h-colors-list">
                {prod.colors?.map((col: any) => (
                  <div key={col.colorName} className="adm-h-color-row">
                    {/* Color Label */}
                    <div className="adm-h-color-label">
                      {col.colorHex && (
                        <span
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: col.colorHex,
                            border: '1px solid #D1D5DB',
                            display: 'inline-block',
                          }}
                        />
                      )}
                      <strong>{col.colorName}</strong>:
                    </div>

                    {/* Sizes with Independent Movement Classification */}
                    <div className="adm-h-sizes-cluster">
                      {col.sizes?.map((sz: any) => {
                        const matchedFlat = flatVariants.find((f) => f.sku === sz.sku) || sz;
                        return (
                          <div
                            key={sz.size}
                            onClick={() => setDetailModalItem(matchedFlat)}
                            className="adm-h-size-pill"
                            title={sz.actionRecommendation}
                          >
                            <span className="sz-name">{sz.size}:</span>
                            {renderMovementBadge(sz.movementStatus)}
                            <div className="sz-meta">
                              <span>Stock: <strong>{sz.availableStock}</strong></span>
                              <span>•</span>
                              <span>Sold: <strong>{sz.totalSold}</strong></span>
                              <span>•</span>
                              <span>{sz.stockAgeingDays}d</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: FLAT SKU MATRIX TABLE WITH ALL 14 MOVEMENT DIMENSIONS             */
        /* ========================================================================= */
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Product & Image</th>
                <th>Brand / Atelier</th>
                <th>Category</th>
                <th>Color & Size</th>
                <th>SKU</th>
                <th>Available</th>
                <th>Reserved</th>
                <th>Sold Qty</th>
                <th>Last Sale</th>
                <th>Receipt Date</th>
                <th>Ageing</th>
                <th>Velocity</th>
                <th>Movement Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flatVariants.map((item) => (
                <tr key={item.sku}>
                  {/* Product */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={item.productImage || '/pdp_hero_1.png'}
                        alt={item.productName}
                        style={{ width: '38px', height: '46px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E5E7EB' }}
                      />
                      <span style={{ fontWeight: 600, fontSize: '12px', color: '#111827', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.productName}
                      </span>
                    </div>
                  </td>

                  {/* Brand */}
                  <td style={{ fontSize: '11px', color: '#4B5563' }}>
                    {item.brand}
                  </td>

                  {/* Category */}
                  <td style={{ fontSize: '11px', color: '#6B7280', textTransform: 'capitalize' }}>
                    {item.category?.replace(/-/g, ' ')}
                  </td>

                  {/* Color & Size */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {item.colorHex && (
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.colorHex, border: '1px solid #D1D5DB' }} />
                      )}
                      <span style={{ fontWeight: 600, fontSize: '12px', color: '#111827' }}>
                        {item.color}
                      </span>
                      <span style={{ backgroundColor: '#F3F4F6', padding: '1px 5px', borderRadius: '3px', fontSize: '11px', fontWeight: 700 }}>
                        {item.size}
                      </span>
                    </div>
                  </td>

                  {/* SKU */}
                  <td style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6B7280' }}>
                    {item.sku}
                  </td>

                  {/* Available Stock */}
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: item.availableStock > 5 ? '#DCFCE7' : item.availableStock > 0 ? '#FEF3C7' : '#FEE2E2',
                        color: item.availableStock > 5 ? '#166534' : item.availableStock > 0 ? '#92400E' : '#991B1B',
                      }}
                    >
                      {item.availableStock}
                    </span>
                  </td>

                  {/* Reserved Stock */}
                  <td style={{ fontSize: '12px', color: item.reservedStock > 0 ? '#D97706' : '#9CA3AF', fontWeight: item.reservedStock > 0 ? 600 : 400 }}>
                    {item.reservedStock}
                  </td>

                  {/* Sold Quantity */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 600, fontSize: '12px', color: '#111827' }}>
                        {item.totalSold} total
                      </span>
                      <span style={{ fontSize: '10px', color: '#6B7280' }}>
                        {item.soldLast30d} in 30d
                      </span>
                    </div>
                  </td>

                  {/* Last Sale Date */}
                  <td style={{ fontSize: '11px', color: item.lastSaleDate ? '#111827' : '#9CA3AF' }}>
                    {item.lastSaleDate ? (
                      <div>
                        <span>{new Date(item.lastSaleDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        <br />
                        <span style={{ fontSize: '10px', color: '#6B7280' }}>({item.daysSinceLastSale}d ago)</span>
                      </div>
                    ) : (
                      'No sales yet'
                    )}
                  </td>

                  {/* Stock Receipt Date */}
                  <td style={{ fontSize: '11px', color: '#6B7280' }}>
                    {new Date(item.stockReceiptDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>

                  {/* Stock Ageing */}
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: item.stockAgeingDays > 60 ? '#DC2626' : item.stockAgeingDays > 30 ? '#B45309' : '#166534',
                      }}
                    >
                      {item.stockAgeingDays} days
                    </span>
                  </td>

                  {/* Sales Velocity */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontWeight: 600, fontSize: '11px', color: '#111827' }}>
                        {item.velocityWeekly} /wk
                      </span>
                      <span style={{ fontSize: '10px', color: '#6B7280' }}>
                        {item.daysOfInventory > 0 && item.daysOfInventory < 999 ? `${item.daysOfInventory}d runway` : ''}
                      </span>
                    </div>
                  </td>

                  {/* Movement Status */}
                  <td>
                    {renderMovementBadge(item.movementStatus)}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setAdjustingItem(item);
                          setAdjustForm({ quantityChange: 0, type: 'STOCK_ADJUSTMENT', reason: '' });
                        }}
                        className="adm-table-action-btn is-adjust"
                      >
                        Adjust
                      </button>
                      <button
                        type="button"
                        onClick={() => setDetailModalItem(item)}
                        className="adm-table-action-btn is-info"
                        title="Movement Intelligence Insights"
                      >
                        <Info size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: STOCK ADJUSTMENT WORKFLOW (Writes Transaction)    */}
      {/* ========================================================= */}
      {adjustingItem && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-card">
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Adjust Inventory Stock</h3>
              <button onClick={() => setAdjustingItem(null)} className="adm-modal-close">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit}>
              <div className="adm-modal-body">
                <div style={{ backgroundColor: '#F8F9FA', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
                    {adjustingItem.productName}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>
                    Color: <strong>{adjustingItem.color}</strong> | Size: <strong>{adjustingItem.size}</strong> | SKU: <code style={{ color: '#8A704C' }}>{adjustingItem.sku}</code>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#EFF6FF', borderRadius: '6px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#1E40AF' }}>Current Available Stock</span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#1E40AF' }}>{adjustingItem.availableStock}</span>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Adjustment Type *</label>
                  <select
                    value={adjustForm.type}
                    onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value })}
                    className="adm-form-input"
                  >
                    <option value="STOCK_RECEIVED">Stock Received (Inbound Workshop Addition)</option>
                    <option value="STOCK_ADJUSTMENT">Manual Inventory Cycle Audit</option>
                    <option value="STOCK_DAMAGED">Damaged / Written-Off Piece (Deduction)</option>
                    <option value="STOCK_RETURNED">Customer Return Inward</option>
                  </select>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Quantity Change (+ to Add, - to Deduct) *</label>
                  <input
                    type="number"
                    required
                    value={adjustForm.quantityChange}
                    onChange={(e) => setAdjustForm({ ...adjustForm, quantityChange: Number(e.target.value) })}
                    className="adm-form-input"
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Audit Reason / Documentation Note</label>
                  <input
                    type="text"
                    value={adjustForm.reason}
                    onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                    placeholder="e.g. Physical inventory count verified at Mumbai Atelier..."
                    className="adm-form-input"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#DCFCE7', borderRadius: '6px', marginTop: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>New Stock Level Will Be</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#166534' }}>
                    {adjustingItem.availableStock + adjustForm.quantityChange} units
                  </span>
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" onClick={() => setAdjustingItem(null)} className="adm-btn-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAdjust || adjustForm.quantityChange === 0 || (adjustingItem.availableStock + adjustForm.quantityChange < 0)}
                  className="adm-btn-primary"
                >
                  {savingAdjust ? 'Updating...' : 'Confirm Stock Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: MOVEMENT INTELLIGENCE DEEP-DIVE MODAL            */}
      {/* ========================================================= */}
      {detailModalItem && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-card" style={{ maxWidth: '580px' }}>
            <div className="adm-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="#C5A869" />
                <h3 className="adm-modal-title">Variant Movement Intelligence</h3>
              </div>
              <button onClick={() => setDetailModalItem(null)} className="adm-modal-close">
                <X size={16} />
              </button>
            </div>

            <div className="adm-modal-body">
              {/* Product and Variant Title */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '18px' }}>
                <img
                  src={detailModalItem.productImage || '/pdp_hero_1.png'}
                  alt={detailModalItem.productName}
                  style={{ width: '54px', height: '68px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>
                    {detailModalItem.productName}
                  </h4>
                  <div style={{ fontSize: '12px', color: '#595F69' }}>
                    Color: <strong>{detailModalItem.color}</strong> | Size: <strong>{detailModalItem.size}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: '#8A704C', fontFamily: 'monospace', marginTop: '2px' }}>
                    SKU: {detailModalItem.sku}
                  </div>
                </div>
              </div>

              {/* Movement Status Callout */}
              <div style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '14px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B7280', fontWeight: 700 }}>
                    MOVEMENT EVALUATION
                  </span>
                  {renderMovementBadge(detailModalItem.movementStatus)}
                </div>
                <p style={{ fontSize: '13px', color: '#111827', margin: 0, lineHeight: 1.45, fontWeight: 500 }}>
                  💡 {detailModalItem.actionRecommendation}
                </p>
              </div>

              {/* Metric Matrix */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '18px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '10px 12px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', display: 'block' }}>AVAILABLE STOCK</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{detailModalItem.availableStock} units</span>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '10px 12px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', display: 'block' }}>RESERVED IN ORDERS</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#D97706' }}>{detailModalItem.reservedStock} units</span>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '10px 12px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', display: 'block' }}>SALES VELOCITY (30D)</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#166534' }}>{detailModalItem.velocityWeekly} units / wk</span>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '10px 12px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', display: 'block' }}>STOCK AGEING</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: detailModalItem.stockAgeingDays > 60 ? '#DC2626' : '#111827' }}>
                    {detailModalItem.stockAgeingDays} days
                  </span>
                </div>
              </div>

              {/* Dates Audit */}
              <div style={{ fontSize: '12px', color: '#595F69', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #E5E7EB', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Stock Receipt Date:</span>
                  <strong>{new Date(detailModalItem.stockReceiptDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Last Customer Sale:</span>
                  <strong>
                    {detailModalItem.lastSaleDate
                      ? `${new Date(detailModalItem.lastSaleDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} (${detailModalItem.daysSinceLastSale} days ago)`
                      : 'No sales recorded yet'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>All-Time Units Sold:</span>
                  <strong>{detailModalItem.totalSold} units</strong>
                </div>
              </div>
            </div>

            <div className="adm-modal-footer">
              <button type="button" onClick={() => setDetailModalItem(null)} className="adm-btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        .adm-mov-container {
          padding: 24px clamp(16px, 3vw, 36px) 64px;
          background-color: #F8F9FA;
          min-height: 100vh;
          font-family: var(--font-body, -apple-system, BlinkMacSystemFont, sans-serif);
        }

        .adm-mov-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .adm-view-toggle {
          display: inline-flex;
          background: #E5E7EB;
          padding: 3px;
          border-radius: 6px;
          gap: 2px;
        }

        .adm-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border: none;
          background: transparent;
          font-size: 11px;
          font-weight: 600;
          color: #4B5563;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .adm-toggle-btn.is-active {
          background: #FFFFFF;
          color: #111827;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .adm-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .adm-kpi-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .adm-kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .adm-kpi-title {
          font-size: 11px;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .adm-kpi-val {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }

        .adm-kpi-sub {
          font-size: 10px;
          color: #9CA3AF;
        }

        .adm-filter-bar {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 14px 16px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .adm-status-tabs {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
          white-space: nowrap;
        }

        .adm-status-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 9999px;
          background: #F3F4F6;
          border: 1px solid transparent;
          color: #4B5563;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .adm-status-tab-btn:hover {
          background: #E5E7EB;
          color: #111827;
        }

        .adm-status-tab-btn.is-active {
          background: #111827;
          color: #FFFFFF;
        }

        .adm-tab-pill {
          padding: 1px 6px;
          border-radius: 10px;
          background: rgba(0,0,0,0.08);
          font-size: 10px;
        }

        .adm-status-tab-btn.is-active .adm-tab-pill {
          background: rgba(255,255,255,0.25);
          color: #FFFFFF;
        }

        .adm-filter-controls-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .adm-search-box {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .adm-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
        }

        .adm-filter-input {
          width: 100%;
          padding: 7px 10px 7px 30px;
          font-size: 12px;
          border: 1px solid #D1D5DB;
          border-radius: 4px;
          outline: none;
          box-sizing: border-box;
        }

        .adm-filter-input:focus {
          border-color: #111827;
        }

        .adm-clear-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9CA3AF;
        }

        .adm-filter-select {
          padding: 7px 10px;
          font-size: 12px;
          border: 1px solid #D1D5DB;
          border-radius: 4px;
          background: #FFFFFF;
          color: #374151;
          outline: none;
        }

        /* Hierarchical Breakdown View */
        .adm-hierarchical-wrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .adm-h-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .adm-h-product-header {
          padding: 14px 18px;
          background: #F9FAFB;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .adm-h-colors-list {
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .adm-h-color-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .adm-h-color-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          min-width: 120px;
          color: #111827;
        }

        .adm-h-sizes-cluster {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          flex: 1;
        }

        .adm-h-size-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          padding: 6px 10px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .adm-h-size-pill:hover {
          border-color: #111827;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
          transform: translateY(-1px);
        }

        .sz-name {
          font-size: 12px;
          font-weight: 700;
          color: #111827;
        }

        .sz-meta {
          display: flex;
          gap: 4px;
          font-size: 11px;
          color: #6B7280;
        }

        /* Movement Badges */
        .mov-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .mov-badge.is-moving {
          background: #DCFCE7;
          color: #166534;
          border: 1px solid #86EFAC;
        }

        .mov-badge.is-slow {
          background: #FEF3C7;
          color: #92400E;
          border: 1px solid #FCD34D;
        }

        .mov-badge.is-nomovement {
          background: #FEE2E2;
          color: #991B1B;
          border: 1px solid #FCA5A5;
        }

        .mov-badge.is-oos {
          background: #F1F5F9;
          color: #475569;
          border: 1px solid #CBD5E1;
        }

        .mov-badge.is-new {
          background: #EFF6FF;
          color: #1E40AF;
          border: 1px solid #BFDBFE;
        }

        /* Tabular View */
        .adm-table-wrap {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          overflow-x: auto;
        }

        .adm-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          text-align: left;
        }

        .adm-table th {
          background: #F9FAFB;
          color: #4B5563;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 12px 14px;
          border-bottom: 1px solid #E5E7EB;
          white-space: nowrap;
        }

        .adm-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #F3F4F6;
          vertical-align: middle;
        }

        .adm-table tr:hover td {
          background-color: #FAFAFA;
        }

        .adm-table-action-btn {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .adm-table-action-btn.is-adjust {
          background: #111827;
          color: #FFFFFF;
        }

        .adm-table-action-btn.is-adjust:hover {
          background: #000000;
        }

        .adm-table-action-btn.is-info {
          background: #F3F4F6;
          color: #4B5563;
          border-color: #E5E7EB;
        }

        .adm-btn-primary {
          background: #111827;
          color: #FFFFFF;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .adm-btn-secondary {
          background: #FFFFFF;
          color: #374151;
          border: 1px solid #D1D5DB;
          padding: 7px 14px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Modal */
        .adm-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
        }

        .adm-modal-card {
          background: #FFFFFF;
          border-radius: 8px;
          width: 100%;
          maxWidth: 500px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .adm-modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .adm-modal-title {
          font-family: var(--font-display, serif);
          font-size: 17px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .adm-modal-close {
          background: none;
          border: none;
          color: #9CA3AF;
          cursor: pointer;
        }

        .adm-modal-body {
          padding: 20px;
        }

        .adm-modal-footer {
          padding: 12px 20px;
          background: #F9FAFB;
          border-top: 1px solid #E5E7EB;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .adm-form-group {
          margin-bottom: 14px;
        }

        .adm-form-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .adm-form-input {
          width: 100%;
          padding: 8px 12px;
          font-size: 13px;
          border: 1px solid #D1D5DB;
          border-radius: 4px;
          box-sizing: border-box;
          outline: none;
        }

        .adm-form-input:focus {
          border-color: #111827;
        }

        .spin {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
