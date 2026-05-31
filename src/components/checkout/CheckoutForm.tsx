'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
    paymentMethod: 'card'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // Mock API call
      const dummyOrderId = 'ZEV-' + Math.floor(Math.random() * 1000000);
      router.push(`/checkout/order-confirmed/${dummyOrderId}`);
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '40px', boxShadow: 'var(--shadow-sm)' }}>
      
      {/* Progress */}
      <div style={{ display: 'flex', marginBottom: '48px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '12px', left: 0, right: 0, height: '2px', backgroundColor: 'var(--linen)', zIndex: 1 }} />
        <div style={{ position: 'absolute', top: '12px', left: 0, width: step === 1 ? '0%' : step === 2 ? '50%' : '100%', height: '2px', backgroundColor: 'var(--gold)', zIndex: 2, transition: 'width 0.3s' }} />
        
        {['Shipping', 'Payment', 'Review'].map((label, i) => (
          <div key={label} style={{ flex: 1, textAlign: i === 0 ? 'left' : i === 1 ? 'center' : 'right', position: 'relative', zIndex: 3 }}>
            <div style={{ 
              width: '24px', height: '24px', borderRadius: '50%', 
              backgroundColor: step >= i + 1 ? 'var(--gold)' : '#fff', 
              border: `2px solid ${step >= i + 1 ? 'var(--gold)' : 'var(--linen)'}`,
              color: step >= i + 1 ? '#fff' : 'var(--warm-grey)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
              margin: i === 0 ? '0' : i === 1 ? '0 auto' : '0 0 0 auto',
              transition: 'all 0.3s'
            }}>
              {i + 1}
            </div>
            <p style={{ fontSize: '12px', marginTop: '8px', color: step >= i + 1 ? 'var(--espresso)' : 'var(--warm-grey)', fontWeight: step >= i + 1 ? 600 : 400 }}>{label}</p>
          </div>
        ))}
      </div>

      <form onSubmit={step === 3 ? handlePlaceOrder : handleNext}>
        
        {step === 1 && (
          <div className="fade-up">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '24px' }}>SHIPPING DETAILS</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" style={{ padding: '16px', border: '1px solid var(--linen)', width: '100%', outline: 'none' }} />
              <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" style={{ padding: '16px', border: '1px solid var(--linen)', width: '100%', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" style={{ padding: '16px', border: '1px solid var(--linen)', width: '100%', outline: 'none' }} />
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" style={{ padding: '16px', border: '1px solid var(--linen)', width: '100%', outline: 'none' }} />
            </div>
            <input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" style={{ padding: '16px', border: '1px solid var(--linen)', width: '100%', marginBottom: '20px', outline: 'none' }} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
              <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" style={{ padding: '16px', border: '1px solid var(--linen)', width: '100%', outline: 'none' }} />
              <input required type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" style={{ padding: '16px', border: '1px solid var(--linen)', width: '100%', outline: 'none' }} />
              <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="PIN Code" style={{ padding: '16px', border: '1px solid var(--linen)', width: '100%', outline: 'none' }} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '16px 40px' }}>CONTINUE TO PAYMENT</button>
          </div>
        )}

        {step === 2 && (
          <div className="fade-up">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '24px' }}>PAYMENT METHOD</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', border: '1px solid', borderColor: formData.paymentMethod === 'card' ? 'var(--gold)' : 'var(--linen)', cursor: 'pointer' }}>
                <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} style={{ accentColor: 'var(--gold)', width: '18px', height: '18px' }} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Credit / Debit Card</span>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', border: '1px solid', borderColor: formData.paymentMethod === 'upi' ? 'var(--gold)' : 'var(--linen)', cursor: 'pointer' }}>
                <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={handleChange} style={{ accentColor: 'var(--gold)', width: '18px', height: '18px' }} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>UPI (Google Pay, PhonePe)</span>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', border: '1px solid', borderColor: formData.paymentMethod === 'cod' ? 'var(--gold)' : 'var(--linen)', cursor: 'pointer' }}>
                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} style={{ accentColor: 'var(--gold)', width: '18px', height: '18px' }} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Cash on Delivery</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button type="button" onClick={() => setStep(1)} className="btn btn-outline-gold" style={{ padding: '16px 40px' }}>BACK</button>
              <button type="submit" className="btn btn-primary" style={{ padding: '16px 40px' }}>REVIEW ORDER</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-up">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '24px' }}>REVIEW ORDER</h3>
            
            <div style={{ backgroundColor: 'var(--beige)', padding: '24px', marginBottom: '40px' }}>
              <h4 style={{ fontSize: '12px', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '16px' }}>SHIPPING ADDRESS</h4>
              <p style={{ color: 'var(--warm-grey)', lineHeight: 1.6 }}>
                {formData.firstName} {formData.lastName}<br/>
                {formData.address}, {formData.city}<br/>
                {formData.state} - {formData.pincode}<br/>
                {formData.phone}
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--beige)', padding: '24px', marginBottom: '40px' }}>
              <h4 style={{ fontSize: '12px', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '16px' }}>PAYMENT</h4>
              <p style={{ color: 'var(--warm-grey)' }}>
                {formData.paymentMethod === 'card' ? 'Credit / Debit Card' : formData.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button type="button" onClick={() => setStep(2)} className="btn btn-outline-gold" style={{ padding: '16px 40px' }} disabled={loading}>BACK</button>
              <button type="submit" className="btn btn-primary" style={{ padding: '16px 40px' }} disabled={loading}>
                {loading ? 'PROCESSING...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
