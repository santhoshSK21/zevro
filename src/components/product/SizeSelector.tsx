'use client';

import React, { useState } from 'react';

interface SizeOption {
  size: string;
  inStock: boolean;
}

interface SizeSelectorProps {
  sizes: SizeOption[];
  selected: string | null;
  onChange: (s: string) => void;
}

export default function SizeSelector({ sizes, selected, onChange }: SizeSelectorProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [notifySize, setNotifySize] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const handleSizeClick = (sizeOption: SizeOption) => {
    if (sizeOption.inStock) {
      onChange(sizeOption.size);
      setNotifySize(null);
    } else {
      setNotifySize(sizeOption.size);
      onChange(sizeOption.size); // Still select it so we know which one is active for notification
    }
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`We will notify ${email} when size ${notifySize} is back in stock.`);
    setEmail('');
    setNotifySize(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em' }}>SELECT SIZE</h4>
        <button onClick={() => setModalOpen(true)} style={{ fontSize: '12px', color: 'var(--warm-grey)', textDecoration: 'underline' }}>Size Guide</button>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {sizes.map((s) => {
          const isSelected = selected === s.size;
          return (
            <div key={s.size} style={{ position: 'relative' }}>
              <button 
                onClick={() => handleSizeClick(s)}
                style={{
                  width: '48px', height: '48px',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--espresso)' : 'var(--linen)',
                  backgroundColor: isSelected ? (s.inStock ? 'var(--espresso)' : 'transparent') : 'transparent',
                  color: isSelected ? (s.inStock ? 'var(--ivory)' : 'var(--espresso)') : (s.inStock ? 'var(--espresso)' : 'var(--linen)'),
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {s.size}
                {/* Out of stock strike-through line */}
                {!s.inStock && (
                  <div style={{
                    position: 'absolute', top: '50%', left: '-10%', right: '-10%',
                    height: '1px', backgroundColor: 'var(--linen)',
                    transform: 'rotate(-45deg)'
                  }} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {notifySize && (
         <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--surface)', border: '1px solid var(--linen)' }}>
            <p style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--espresso)' }}>
              Size <strong>{notifySize}</strong> is currently out of stock.
            </p>
            <form onSubmit={handleNotifySubmit} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                placeholder="Enter your email to be notified"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ flex: 1, padding: '10px', fontSize: '13px', border: '1px solid var(--linen)' }}
              />
              <button type="submit" style={{ backgroundColor: 'var(--espresso)', color: 'white', padding: '0 16px', fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                Notify Me
              </button>
            </form>
         </div>
      )}

      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ backgroundColor: 'var(--ivory)', padding: '32px', maxWidth: '500px', width: '100%', position: 'relative' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '20px' }}>✕</button>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px', color: 'var(--espresso)' }}>Size Guide</h3>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '1px solid var(--linen)', textAlign: 'left'}}>
                  <th style={{padding: '8px'}}>Size</th><th style={{padding: '8px'}}>Bust (in)</th><th style={{padding: '8px'}}>Waist (in)</th><th style={{padding: '8px'}}>Hips (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{borderBottom: '1px solid var(--linen)'}}><td style={{padding: '8px'}}>XS</td><td style={{padding: '8px'}}>32</td><td style={{padding: '8px'}}>26</td><td style={{padding: '8px'}}>34</td></tr>
                <tr style={{borderBottom: '1px solid var(--linen)'}}><td style={{padding: '8px'}}>S</td><td style={{padding: '8px'}}>34</td><td style={{padding: '8px'}}>28</td><td style={{padding: '8px'}}>36</td></tr>
                <tr style={{borderBottom: '1px solid var(--linen)'}}><td style={{padding: '8px'}}>M</td><td style={{padding: '8px'}}>36</td><td style={{padding: '8px'}}>30</td><td style={{padding: '8px'}}>38</td></tr>
                <tr style={{borderBottom: '1px solid var(--linen)'}}><td style={{padding: '8px'}}>L</td><td style={{padding: '8px'}}>38</td><td style={{padding: '8px'}}>32</td><td style={{padding: '8px'}}>40</td></tr>
                <tr style={{borderBottom: '1px solid var(--linen)'}}><td style={{padding: '8px'}}>XL</td><td style={{padding: '8px'}}>40</td><td style={{padding: '8px'}}>34</td><td style={{padding: '8px'}}>42</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
