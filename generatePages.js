const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'app');

const createPage = (route, title, content) => {
  const dir = path.join(pagesDir, route);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), `
import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function ${route.replace(/-./g, x => x[1].toUpperCase()).replace(/^./, x => x.toUpperCase())}Page() {
  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="container" style={{ padding: '80px 24px', flex: 1, maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '32px', color: 'var(--espresso)' }}>${title}</h1>
        <div style={{ color: 'var(--warm-grey)', lineHeight: 1.8, fontSize: '15px' }}>
          ${content}
        </div>
      </main>
      <Footer />
    </div>
  );
}
  `);
};

createPage('returns', 'Returns & Exchanges', `
  <p>At Zevro, we offer a simple and easy 7-day return policy. If you are not satisfied with your purchase, you can return it within 7 days of delivery.</p>
  <h3 style={{marginTop: '24px', marginBottom: '16px', color: 'var(--espresso)'}}>How to Request a Return</h3>
  <ol style={{paddingLeft: '20px'}}>
    <li>Go to your <a href="/account/orders" style={{color: 'var(--gold)', textDecoration: 'underline'}}>Orders</a> page in your account.</li>
    <li>Select the order you wish to return.</li>
    <li>Click on "Request Return" and follow the instructions.</li>
  </ol>
`);

createPage('faq', 'Frequently Asked Questions', `
  <h3 style={{marginTop: '24px', marginBottom: '16px', color: 'var(--espresso)'}}>What payment methods do you accept?</h3>
  <p>We accept all major credit/debit cards, UPI, Net Banking, and Wallets via Razorpay. Cash on Delivery (COD) is available on select pin codes.</p>
  
  <h3 style={{marginTop: '24px', marginBottom: '16px', color: 'var(--espresso)'}}>How long does shipping take?</h3>
  <p>Orders are typically dispatched within 48 hours and delivered within 3-7 business days depending on your location.</p>
`);

createPage('contact', 'Contact Us', `
  <p>We would love to hear from you. Please fill out the form below or email us at support@zevro.in.</p>
  <form style={{display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px'}}>
    <input type="text" placeholder="Name" style={{padding: '12px', border: '1px solid var(--linen)'}} />
    <input type="email" placeholder="Email" style={{padding: '12px', border: '1px solid var(--linen)'}} />
    <input type="text" placeholder="Subject" style={{padding: '12px', border: '1px solid var(--linen)'}} />
    <textarea placeholder="Message" rows={5} style={{padding: '12px', border: '1px solid var(--linen)'}}></textarea>
    <button type="button" className="btn btn-primary">SEND MESSAGE</button>
  </form>
`);

createPage('careers', 'Careers', `
  <p>We're not currently hiring, but we are always looking for passionate people to join our team in the future. Please check back soon or email your resume to careers@zevro.in.</p>
`);

createPage('privacy-policy', 'Privacy Policy', `
  {/* Note: This is a template. Legal advisor review recommended before going live. */}
  <p>Zevro respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
  <h3 style={{marginTop: '24px', marginBottom: '16px', color: 'var(--espresso)'}}>Data Collection</h3>
  <p>We collect personal data such as name, email, and address strictly for order fulfillment and customer support purposes.</p>
`);

createPage('terms', 'Terms of Service', `
  {/* Note: This is a template. Legal advisor review recommended before going live. */}
  <p>Welcome to Zevro. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Zevro if you do not agree to all of the terms and conditions stated on this page.</p>
`);

createPage('shipping-policy', 'Shipping Policy', `
  {/* Note: This is a template. Legal advisor review recommended before going live. */}
  <p>We offer free shipping on orders above ₹999 within India. For orders below ₹999, a standard shipping fee applies.</p>
  <h3 style={{marginTop: '24px', marginBottom: '16px', color: 'var(--espresso)'}}>Delivery Times</h3>
  <p>Standard delivery takes 3-7 business days. You will receive a tracking link via email once your order has been dispatched.</p>
`);

createPage('size-guide', 'Size Guide', `
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
`);

console.log('Pages generated.');
