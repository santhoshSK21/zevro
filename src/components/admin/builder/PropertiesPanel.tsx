'use client';

import React from 'react';
import { useBuilder } from './BuilderContext';
import { Sliders, Trash2, CheckCircle2 } from 'lucide-react';

export function PropertiesPanel() {
  const { components, selectedId, updateComponentProps, removeComponent } = useBuilder();

  const selectedComponent = components.find((c) => c.id === selectedId);

  if (!selectedComponent) {
    return (
      <div style={{ width: '300px', backgroundColor: '#FFFFFF', borderLeft: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#64748B', height: '100%' }}>
        <Sliders size={32} color="#CBD5E1" style={{ marginBottom: '12px' }} />
        <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', margin: '0 0 6px 0' }}>Block Properties</h4>
        <p style={{ fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
          Click any block on the canvas to configure its copy, images, and layout settings.
        </p>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    updateComponentProps(selectedComponent.id, { [key]: value });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #CBD5E1',
    borderRadius: '4px',
    fontSize: '12px',
    backgroundColor: '#FAF8F5',
    color: '#0F172A',
    outline: 'none'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '4px',
    display: 'block'
  };

  return (
    <div style={{ width: '300px', backgroundColor: '#FFFFFF', borderLeft: '1px solid #E2E8F0', padding: '20px', overflowY: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
            {selectedComponent.type.replace('-', ' ')}
          </h3>
          <span style={{ fontSize: '10px', color: '#94A3B8' }}>Block ID: {selectedComponent.id}</span>
        </div>
        <button
          type="button"
          onClick={() => removeComponent(selectedComponent.id)}
          title="Delete this block"
          style={{ background: 'transparent', border: '1px solid #FCA5A5', color: '#EF4444', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        
        {/* HERO PROPERTIES */}
        {selectedComponent.type === 'hero' && (
          <>
            <div>
              <label style={labelStyle}>Badge Tag</label>
              <input
                type="text"
                value={selectedComponent.props.badgeText || ''}
                onChange={(e) => handleChange('badgeText', e.target.value)}
                style={inputStyle}
                placeholder="e.g. AUTUMN / WINTER 2026"
              />
            </div>
            <div>
              <label style={labelStyle}>Headline</label>
              <input
                type="text"
                value={selectedComponent.props.headline || ''}
                onChange={(e) => handleChange('headline', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Subheadline</label>
              <textarea
                value={selectedComponent.props.subheadline || ''}
                onChange={(e) => handleChange('subheadline', e.target.value)}
                style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={labelStyle}>CTA Button Text</label>
              <input
                type="text"
                value={selectedComponent.props.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>CTA Button Link</label>
              <input
                type="text"
                value={selectedComponent.props.buttonLink || ''}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
                style={inputStyle}
              />
            </div>
          </>
        )}

        {/* PRODUCT GRID PROPERTIES */}
        {selectedComponent.type === 'product-grid' && (
          <>
            <div>
              <label style={labelStyle}>Section Heading</label>
              <input
                type="text"
                value={selectedComponent.props.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Section Subtitle</label>
              <input
                type="text"
                value={selectedComponent.props.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Display Product Count</label>
              <select
                value={selectedComponent.props.limit || 4}
                onChange={(e) => handleChange('limit', parseInt(e.target.value))}
                style={inputStyle}
              >
                <option value={4}>4 Products (1 Row)</option>
                <option value={8}>8 Products (2 Rows)</option>
                <option value={12}>12 Products (3 Rows)</option>
              </select>
            </div>
          </>
        )}

        {/* EDITORIAL BANNER PROPERTIES */}
        {selectedComponent.type === 'editorial-banner' && (
          <>
            <div>
              <label style={labelStyle}>Editorial Tag</label>
              <input
                type="text"
                value={selectedComponent.props.tag || ''}
                onChange={(e) => handleChange('tag', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Story Title</label>
              <input
                type="text"
                value={selectedComponent.props.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Story Narrative</label>
              <textarea
                value={selectedComponent.props.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Button Label</label>
              <input
                type="text"
                value={selectedComponent.props.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                style={inputStyle}
              />
            </div>
          </>
        )}

        {/* TRUST BAR PROPERTIES */}
        {selectedComponent.type === 'trust-bar' && (
          <>
            <div>
              <label style={labelStyle}>Benefit 1</label>
              <input
                type="text"
                value={selectedComponent.props.item1 || ''}
                onChange={(e) => handleChange('item1', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Benefit 2</label>
              <input
                type="text"
                value={selectedComponent.props.item2 || ''}
                onChange={(e) => handleChange('item2', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Benefit 3</label>
              <input
                type="text"
                value={selectedComponent.props.item3 || ''}
                onChange={(e) => handleChange('item3', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Benefit 4</label>
              <input
                type="text"
                value={selectedComponent.props.item4 || ''}
                onChange={(e) => handleChange('item4', e.target.value)}
                style={inputStyle}
              />
            </div>
          </>
        )}

        {/* NEWSLETTER PROPERTIES */}
        {selectedComponent.type === 'newsletter' && (
          <>
            <div>
              <label style={labelStyle}>VIP Title</label>
              <input
                type="text"
                value={selectedComponent.props.headline || ''}
                onChange={(e) => handleChange('headline', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>VIP Description</label>
              <textarea
                value={selectedComponent.props.subheadline || ''}
                onChange={(e) => handleChange('subheadline', e.target.value)}
                style={{ ...inputStyle, minHeight: '60px' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Button Label</label>
              <input
                type="text"
                value={selectedComponent.props.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                style={inputStyle}
              />
            </div>
          </>
        )}

        {/* TEXT PROPERTIES */}
        {selectedComponent.type === 'text' && (
          <>
            <div>
              <label style={labelStyle}>Editorial Statement</label>
              <textarea
                value={selectedComponent.props.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                style={{ ...inputStyle, minHeight: '100px' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Text Alignment</label>
              <select
                value={selectedComponent.props.align || 'center'}
                onChange={(e) => handleChange('align', e.target.value)}
                style={inputStyle}
              >
                <option value="left">Left Aligned</option>
                <option value="center">Centered</option>
                <option value="right">Right Aligned</option>
              </select>
            </div>
          </>
        )}

        {/* SPACER PROPERTIES */}
        {selectedComponent.type === 'spacer' && (
          <div>
            <label style={labelStyle}>Vertical Gap: {selectedComponent.props.height || 50}px</label>
            <input
              type="range"
              value={selectedComponent.props.height || 50}
              onChange={(e) => handleChange('height', parseInt(e.target.value))}
              min="20"
              max="200"
              step="10"
              style={{ width: '100%' }}
            />
          </div>
        )}

      </div>

      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontSize: '11px' }}>
        <CheckCircle2 size={14} />
        <span>Changes sync instantly on canvas</span>
      </div>

    </div>
  );
}
