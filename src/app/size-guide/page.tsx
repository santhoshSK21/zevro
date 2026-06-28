
import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function SizeGuidePage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="container" style={{ padding: '80px 24px', flex: 1, maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '32px', color: 'var(--espresso)' }}>Size Guide</h1>
        <div style={{ color: 'var(--warm-grey)', lineHeight: 1.8, fontSize: '15px' }}>
          
  <p>Find your perfect fit with our comprehensive size guide.</p>
  <table style={{width: '100%', marginTop: '32px', borderCollapse: 'collapse'}}>
    <thead>
      <tr style={{borderBottom: '1px solid var(--linen)', textAlign: 'left'}}>
        <th style={{padding: '12px'}}>Size</th>
        <th style={{padding: '12px'}}>Bust (in)</th>
        <th style={{padding: '12px'}}>Waist (in)</th>
        <th style={{padding: '12px'}}>Hips (in)</th>
      </tr>
    </thead>
    <tbody>
      <tr style={{borderBottom: '1px solid var(--linen)'}}>
        <td style={{padding: '12px'}}>XS</td><td style={{padding: '12px'}}>32</td><td style={{padding: '12px'}}>26</td><td style={{padding: '12px'}}>34</td>
      </tr>
      <tr style={{borderBottom: '1px solid var(--linen)'}}>
        <td style={{padding: '12px'}}>S</td><td style={{padding: '12px'}}>34</td><td style={{padding: '12px'}}>28</td><td style={{padding: '12px'}}>36</td>
      </tr>
      <tr style={{borderBottom: '1px solid var(--linen)'}}>
        <td style={{padding: '12px'}}>M</td><td style={{padding: '12px'}}>36</td><td style={{padding: '12px'}}>30</td><td style={{padding: '12px'}}>38</td>
      </tr>
      <tr style={{borderBottom: '1px solid var(--linen)'}}>
        <td style={{padding: '12px'}}>L</td><td style={{padding: '12px'}}>38</td><td style={{padding: '12px'}}>32</td><td style={{padding: '12px'}}>40</td>
      </tr>
      <tr style={{borderBottom: '1px solid var(--linen)'}}>
        <td style={{padding: '12px'}}>XL</td><td style={{padding: '12px'}}>40</td><td style={{padding: '12px'}}>34</td><td style={{padding: '12px'}}>42</td>
      </tr>
    </tbody>
  </table>

        </div>
      </main>
      <Footer />
    </div>
  );
}
  