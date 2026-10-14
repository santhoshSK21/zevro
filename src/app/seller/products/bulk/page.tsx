'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  Save,
  Search,
  Filter,
  RefreshCw,
  Sliders,
  HelpCircle,
  FileCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface BatchProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  priceRupees: number;
  originalPriceRupees: number;
  stock: number;
  status: string;
  image: string;
}

interface CsvRow {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  fabric?: string;
  description?: string;
  isValid: boolean;
  validationError?: string;
}

export default function BulkToolsPage() {
  const [activeTab, setActiveTab] = useState<'editor' | 'csv'>('editor');

  // Batch Editor State
  const [products, setProducts] = useState<BatchProduct[]>([]);
  const [initialProducts, setInitialProducts] = useState<Record<string, BatchProduct>>({});
  const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [savingBatch, setSavingBatch] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // CSV Import State
  const [csvRows, setCsvRows] = useState<CsvRow[]>([]);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [importingCsv, setImportingCsv] = useState(false);
  const [csvImportResult, setCsvImportResult] = useState<{ count: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load products for rapid batch editor
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seller/products/bulk');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        const initMap: Record<string, BatchProduct> = {};
        (data.products || []).forEach((p: BatchProduct) => {
          initMap[p._id] = { ...p };
        });
        setInitialProducts(initMap);
        setModifiedIds(new Set());
      }
    } catch (err) {
      console.error('Failed to load batch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle cell edit
  const handleFieldChange = (id: string, field: 'priceRupees' | 'originalPriceRupees' | 'stock', value: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p._id === id) {
          return { ...p, [field]: value };
        }
        return p;
      })
    );

    setModifiedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Save Batch Changes
  const handleSaveBatch = async () => {
    if (modifiedIds.size === 0) return;

    setSavingBatch(true);
    setSaveSuccessMsg(null);

    const updates = Array.from(modifiedIds).map((id) => {
      const p = products.find((item) => item._id === id);
      return {
        _id: id,
        priceRupees: p?.priceRupees,
        originalPriceRupees: p?.originalPriceRupees,
        stock: p?.stock,
      };
    });

    try {
      const res = await fetch('/api/seller/products/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      if (res.ok) {
        const json = await res.json();
        setSaveSuccessMsg(`✓ Successfully updated ${json.updatedCount} products!`);
        setModifiedIds(new Set());
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error('Batch save error:', err);
    } finally {
      setSavingBatch(false);
    }
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [products]);

  // Filtered products in editor
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = categoryFilter === 'ALL' || p.category?.toLowerCase() === categoryFilter.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCat && matchesSearch;
    });
  }, [products, categoryFilter, searchQuery]);

  // CSV Parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    setCsvImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCsv(text);
    };
    reader.readAsText(file);
  };

  const parseCsv = (text: string) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
      alert('CSV file appears empty or missing rows.');
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const nameIdx = headers.indexOf('name');
    const catIdx = headers.indexOf('category');
    const priceIdx = headers.indexOf('price');
    const mrpIdx = headers.indexOf('originalprice');
    const stockIdx = headers.indexOf('stock');
    const fabricIdx = headers.indexOf('fabric');
    const descIdx = headers.indexOf('description');

    const parsed: CsvRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length === 0 || !cols[0]) continue;

      const name = nameIdx !== -1 ? cols[nameIdx] : cols[0] || '';
      const category = catIdx !== -1 ? cols[catIdx] : cols[1] || '';
      const price = priceIdx !== -1 ? cols[priceIdx] : cols[2] || '999';
      const originalPrice = mrpIdx !== -1 ? cols[mrpIdx] : cols[3] || '1499';
      const stock = stockIdx !== -1 ? cols[stockIdx] : cols[4] || '10';
      const fabric = fabricIdx !== -1 ? cols[fabricIdx] : cols[5] || '';
      const description = descIdx !== -1 ? cols[descIdx] : cols[6] || '';

      const isValid = Boolean(name && category && !isNaN(Number(price)));
      const validationError = !name
        ? 'Missing name'
        : !category
        ? 'Missing category'
        : isNaN(Number(price))
        ? 'Invalid price number'
        : undefined;

      parsed.push({
        name,
        category,
        price,
        originalPrice,
        stock,
        fabric,
        description,
        isValid,
        validationError,
      });
    }

    setCsvRows(parsed);
  };

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'name,category,price,originalPrice,stock,fabric,description\n' +
      'Royal Banarasi Silk Sari,Heritage Wear,4999,6999,15,Pure Katan Silk,Exquisite gold zari floral handloom saree\n' +
      'Embroidered Velvet Sherwani,Menswear,8499,11999,8,Micro Velvet,Hand-embroidered zardozi jacket for celebrations\n' +
      'Chanderi Silk Anarkali Suit,Festive Wear,3499,4999,20,Chanderi Cotton Silk,Flowing silhouette with delicate gota patti accents\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'zevro_product_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Confirm Import CSV
  const handleConfirmImport = async () => {
    const validItems = csvRows.filter((r) => r.isValid);
    if (validItems.length === 0) {
      alert('No valid rows found to import.');
      return;
    }

    setImportingCsv(true);
    setCsvImportResult(null);

    try {
      const res = await fetch('/api/seller/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: validItems }),
      });

      if (res.ok) {
        const json = await res.json();
        setCsvImportResult({
          count: json.importedCount || 0,
          errors: json.errors || [],
        });
        setCsvRows([]);
        setCsvFileName(null);
        loadProducts(); // Refresh catalog
      }
    } catch (err) {
      console.error('Import error:', err);
      alert('Failed to import products.');
    } finally {
      setImportingCsv(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
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
            Bulk Catalog Tools
          </h1>
          <p style={{ color: '#68645C', fontSize: '13px', margin: 0 }}>
            Quickly adjust prices & inventory stock in real-time or upload large product catalogs via CSV spreadsheets.
          </p>
        </div>

        {/* Tab Switcher */}
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
          <button
            onClick={() => setActiveTab('editor')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: activeTab === 'editor' ? 600 : 500,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'editor' ? '#1C1C1A' : 'transparent',
              color: activeTab === 'editor' ? '#FAF8F5' : '#68645C',
              transition: 'all 0.15s ease',
            }}
          >
            <Sliders size={14} />
            <span>Batch Price & Stock Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('csv')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: activeTab === 'csv' ? 600 : 500,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'csv' ? '#1C1C1A' : 'transparent',
              color: activeTab === 'csv' ? '#FAF8F5' : '#68645C',
              transition: 'all 0.15s ease',
            }}
          >
            <UploadCloud size={14} />
            <span>Upload CSV Spreadsheet</span>
          </button>
        </div>
      </div>

      {/* TAB 1: RAPID BATCH EDITOR */}
      {activeTab === 'editor' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Controls Bar */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E8E2D6',
              padding: '16px 20px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={14} color="#68645C" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter by product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: '6px',
                    border: '1px solid #DDD6C8',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #DDD6C8',
                  fontSize: '12px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'ALL' ? 'All Categories' : c}
                  </option>
                ))}
              </select>

              <button
                onClick={loadProducts}
                title="Refresh catalog list"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: '#F8F6F0',
                  border: '1px solid #E8E2D6',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#68645C',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {saveSuccessMsg && (
                <span style={{ fontSize: '12px', color: '#2E7D32', fontWeight: 600 }}>
                  {saveSuccessMsg}
                </span>
              )}

              <button
                onClick={handleSaveBatch}
                disabled={modifiedIds.size === 0 || savingBatch}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 20px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  backgroundColor: modifiedIds.size > 0 ? '#1C1C1A' : '#E8E2D6',
                  color: modifiedIds.size > 0 ? '#FAF8F5' : '#8C857B',
                  border: 'none',
                  cursor: modifiedIds.size > 0 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  boxShadow: modifiedIds.size > 0 ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                <Save size={14} />
                <span>
                  {savingBatch
                    ? 'Saving...'
                    : modifiedIds.size > 0
                    ? `Save ${modifiedIds.size} Modified ${modifiedIds.size === 1 ? 'Product' : 'Products'}`
                    : 'No Changes to Save'}
                </span>
              </button>
            </div>
          </div>

          {/* Rapid Editable Table */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E8E2D6',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            {loading ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#68645C' }}>
                <p>Loading catalog items...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#68645C' }}>
                <p>No products match your filter criteria.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8F6F0', borderBottom: '1px solid #E8E2D6' }}>
                      <th style={{ padding: '12px 18px', fontWeight: 600, color: '#68645C', width: '320px' }}>Product Piece</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, color: '#68645C' }}>Category</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, color: '#68645C' }}>Selling Price (₹)</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, color: '#68645C' }}>Original MRP (₹)</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, color: '#68645C' }}>Stock Count</th>
                      <th style={{ padding: '12px 18px', fontWeight: 600, color: '#68645C', textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => {
                      const isModified = modifiedIds.has(p._id);

                      return (
                        <tr
                          key={p._id}
                          style={{
                            borderBottom: '1px solid #F0ECE4',
                            backgroundColor: isModified ? '#FFFDF7' : '#FFFFFF',
                            transition: 'background-color 0.15s ease',
                          }}
                        >
                          {/* Product Info */}
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div
                                style={{
                                  width: '38px',
                                  height: '38px',
                                  borderRadius: '6px',
                                  backgroundColor: '#F5F1E8',
                                  overflow: 'hidden',
                                  flexShrink: 0,
                                  position: 'relative',
                                }}
                              >
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: '#1C1C1A', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {p.name}
                                </div>
                                <div style={{ fontSize: '11px', color: '#8C857B' }}>
                                  slug: {p.slug}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td style={{ padding: '14px 16px', color: '#68645C', fontSize: '12px' }}>
                            {p.category}
                          </td>

                          {/* Selling Price Editable Input */}
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ color: '#8C857B', fontSize: '13px' }}>₹</span>
                              <input
                                type="number"
                                min="0"
                                value={p.priceRupees}
                                onChange={(e) => handleFieldChange(p._id, 'priceRupees', Number(e.target.value))}
                                style={{
                                  width: '95px',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  border: isModified ? '1px solid #B49A68' : '1px solid #DDD6C8',
                                  backgroundColor: isModified ? '#FAF6EC' : '#FFFFFF',
                                  fontWeight: 600,
                                  color: '#1C1C1A',
                                  fontSize: '13px',
                                  outline: 'none',
                                }}
                              />
                            </div>
                          </td>

                          {/* MRP Price Editable Input */}
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ color: '#8C857B', fontSize: '13px' }}>₹</span>
                              <input
                                type="number"
                                min="0"
                                value={p.originalPriceRupees}
                                onChange={(e) => handleFieldChange(p._id, 'originalPriceRupees', Number(e.target.value))}
                                style={{
                                  width: '95px',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  border: isModified ? '1px solid #B49A68' : '1px solid #DDD6C8',
                                  backgroundColor: isModified ? '#FAF6EC' : '#FFFFFF',
                                  color: '#68645C',
                                  fontSize: '13px',
                                  outline: 'none',
                                }}
                              />
                            </div>
                          </td>

                          {/* Stock Count Editable Input */}
                          <td style={{ padding: '14px 16px' }}>
                            <input
                              type="number"
                              min="0"
                              value={p.stock}
                              onChange={(e) => handleFieldChange(p._id, 'stock', Number(e.target.value))}
                              style={{
                                width: '75px',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: isModified ? '1px solid #B49A68' : '1px solid #DDD6C8',
                                backgroundColor: isModified ? '#FAF6EC' : '#FFFFFF',
                                fontWeight: 600,
                                color: p.stock < 5 ? '#9E2A2B' : '#1C1C1A',
                                fontSize: '13px',
                                outline: 'none',
                              }}
                            />
                          </td>

                          {/* Status & Change Flag */}
                          <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                            {isModified ? (
                              <span
                                style={{
                                  display: 'inline-block',
                                  backgroundColor: '#FBF5E8',
                                  color: '#8C6C26',
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  border: '1px solid #E8D7B5',
                                }}
                              >
                                Modified
                              </span>
                            ) : (
                              <span
                                style={{
                                  display: 'inline-block',
                                  backgroundColor: '#E8F5E9',
                                  color: '#2E7D32',
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                }}
                              >
                                Active
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CSV UPLOAD & VERIFICATION */}
      {activeTab === 'csv' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Instructions & Template Download Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E8E2D6',
              padding: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1C1C1A',
                  margin: '0 0 6px',
                }}
              >
                1. Download Zevro CSV Template
              </h3>
              <p style={{ color: '#68645C', fontSize: '13px', margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
                Use our pre-formatted spreadsheet to list items with headers for Name, Category, Price (₹), MRP (₹), Stock, and Fabric.
              </p>
            </div>

            <button
              onClick={handleDownloadTemplate}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: '#F8F6F0',
                color: '#1C1C1A',
                border: '1px solid #DDD6C8',
                cursor: 'pointer',
              }}
            >
              <Download size={14} color="#B49A68" />
              <span>Download Sample CSV</span>
            </button>
          </div>

          {/* Drag & Drop File Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '2px dashed #DDD6C8',
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#F8F6F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <UploadCloud size={24} color="#B49A68" />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1C1C1A', margin: '0 0 6px' }}>
              {csvFileName ? `Selected: ${csvFileName}` : 'Choose or drop your completed CSV spreadsheet'}
            </h4>
            <p style={{ fontSize: '12px', color: '#8C857B', margin: 0 }}>
              Supports standard UTF-8 .csv files exported from Excel, Google Sheets, or Apple Numbers.
            </p>
          </div>

          {/* Success Result Banner */}
          {csvImportResult && (
            <div
              style={{
                backgroundColor: '#E8F5E9',
                border: '1px solid #A5D6A7',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <CheckCircle2 size={20} color="#2E7D32" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1B5E20' }}>
                  Successfully imported {csvImportResult.count} products into your catalog!
                </div>
                {csvImportResult.errors.length > 0 && (
                  <div style={{ fontSize: '11px', color: '#C62828', marginTop: '4px' }}>
                    {csvImportResult.errors.join(' | ')}
                  </div>
                )}
              </div>
              <Link
                href="/seller/products"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1B5E20',
                  textDecoration: 'underline',
                }}
              >
                View in Products Manager →
              </Link>
            </div>
          )}

          {/* Client-Side CSV Verification Table Preview */}
          {csvRows.length > 0 && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E8E2D6',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#1C1C1A',
                      margin: '0 0 4px',
                    }}
                  >
                    2. Verification Preview ({csvRows.length} rows found)
                  </h3>
                  <p style={{ color: '#68645C', fontSize: '12px', margin: 0 }}>
                    Inspect the parsed rows below. Click "Confirm & Import Products" when ready.
                  </p>
                </div>

                <button
                  onClick={handleConfirmImport}
                  disabled={importingCsv}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 24px',
                    backgroundColor: '#1C1C1A',
                    color: '#FAF8F5',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: importingCsv ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                >
                  <FileCheck size={15} color="#E4D5B7" />
                  <span>{importingCsv ? 'Importing Products...' : `Confirm & Import ${csvRows.filter((r) => r.isValid).length} Products`}</span>
                </button>
              </div>

              {/* Parsed Preview Table */}
              <div style={{ overflowX: 'auto', border: '1px solid #E8E2D6', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8F6F0', borderBottom: '1px solid #E8E2D6' }}>
                      <th style={{ padding: '10px 14px', fontWeight: 600, color: '#68645C' }}>Row Status</th>
                      <th style={{ padding: '10px 14px', fontWeight: 600, color: '#68645C' }}>Product Name</th>
                      <th style={{ padding: '10px 14px', fontWeight: 600, color: '#68645C' }}>Category</th>
                      <th style={{ padding: '10px 14px', fontWeight: 600, color: '#68645C' }}>Price (₹)</th>
                      <th style={{ padding: '10px 14px', fontWeight: 600, color: '#68645C' }}>MRP (₹)</th>
                      <th style={{ padding: '10px 14px', fontWeight: 600, color: '#68645C' }}>Stock</th>
                      <th style={{ padding: '10px 14px', fontWeight: 600, color: '#68645C' }}>Fabric</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvRows.map((row, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid #F0ECE4',
                          backgroundColor: row.isValid ? '#FFFFFF' : '#FFF0F0',
                        }}
                      >
                        <td style={{ padding: '10px 14px' }}>
                          {row.isValid ? (
                            <span style={{ color: '#2E7D32', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={13} /> Valid
                            </span>
                          ) : (
                            <span style={{ color: '#C62828', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <AlertCircle size={13} /> {row.validationError}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1C1C1A' }}>{row.name}</td>
                        <td style={{ padding: '10px 14px', color: '#68645C' }}>{row.category}</td>
                        <td style={{ padding: '10px 14px', color: '#1C1C1A', fontWeight: 600 }}>₹{row.price}</td>
                        <td style={{ padding: '10px 14px', color: '#8C857B' }}>₹{row.originalPrice}</td>
                        <td style={{ padding: '10px 14px', color: '#1C1C1A' }}>{row.stock}</td>
                        <td style={{ padding: '10px 14px', color: '#68645C' }}>{row.fabric || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
