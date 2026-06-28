'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cartStore';
import { useConfigStore } from '../../store/configStore';
import styles from './CheckoutForm.module.css';

export default function CheckoutForm() {
  const router = useRouter();
  const { items, total, couponCode, couponDiscount, clearCart } = useCartStore();
  const { config } = useConfigStore();
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      // 1. Calculate totals securely on client just to pass as references to server
      const tax = total * 0.05;
      const shippingThreshold = config?.freeShippingThreshold ?? 99900;
      const shippingFee = config?.shippingCharge ?? 15000;
      const shipping = total > shippingThreshold ? 0 : shippingFee;
      const finalTotal = total + tax + shipping - couponDiscount;

      // 2. Create Order in Database
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          paymentMethod: formData.paymentMethod,
          demoMode: !!(config?.demoMode || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID),
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: formData.phone,
            email: formData.email
          },
          pricing: {
            subtotal: total,
            tax,
            shipping,
            discount: couponDiscount,
            total: finalTotal,
            couponCode
          }
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order');

      const dbOrderId = orderData._id;

      // 3. Handle Demo Mode or COD
      if (formData.paymentMethod === 'cod' || config?.demoMode || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        clearCart();
        router.push(`/checkout/order-confirmed/${dbOrderId}`);
        return;
      }

      // 4. Load Razorpay Script
      const res = await loadRazorpayScript();
      if (!res) throw new Error("Razorpay SDK failed to load. Are you online?");

      // 5. Create Razorpay Order
      const rzpRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal, receipt: dbOrderId })
      });
      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) throw new Error(rzpData.error || 'Failed to initialize payment');

      // 6. Open Razorpay Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: config?.storeName || "Zevro",
        description: "Order Payment",
        order_id: rzpData.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                db_order_id: dbOrderId
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/checkout/order-confirmed/${dbOrderId}`);
            } else {
              alert("Payment verification failed");
              setLoading(false);
            }
          } catch (err) {
            alert("Error verifying payment");
            setLoading(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#0D0D0D" }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        alert("Payment failed: " + response.error.description);
        setLoading(false);
      });
      paymentObject.open();

    } catch (error: any) {
      alert(error.message || "An error occurred");
      setLoading(false);
    }
  };

  const progressWidth = step === 1 ? '0%' : step === 2 ? '50%' : '100%';

  return (
    <div className={styles.checkoutWrap}>
      
      {/* Progress */}
      <div className={styles.progressBar}>
        <div className={styles.progressTrack} />
        <div className={styles.progressFill} style={{ width: progressWidth }} />
        
        {['Shipping', 'Payment', 'Review'].map((label, i) => (
          <div
            key={label}
            className={`${styles.progressStep} ${i === 1 ? styles.progressStepCenter : ''} ${i === 2 ? styles.progressStepRight : ''}`}
          >
            <div className={`${styles.progressDot} ${step >= i + 1 ? styles.progressDotActive : ''} ${i === 1 ? styles.progressDotCenter : ''} ${i === 2 ? styles.progressDotRight : ''}`}>
              {i + 1}
            </div>
            <p className={`${styles.progressLabel} ${step >= i + 1 ? styles.progressLabelActive : ''}`}>
              {label}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={step === 3 ? handlePlaceOrder : handleNext}>
        
        {step === 1 && (
          <div className="fade-up">
            <h3 className={styles.sectionHeading}>Shipping Details</h3>
            
            <div className={styles.fieldGrid2}>
              <div>
                <label className={styles.fieldLabel}>First Name</label>
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className={styles.field} />
              </div>
              <div>
                <label className={styles.fieldLabel}>Last Name</label>
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className={styles.field} />
              </div>
            </div>
            <div className={styles.fieldGrid2}>
              <div>
                <label className={styles.fieldLabel}>Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className={styles.field} />
              </div>
              <div>
                <label className={styles.fieldLabel}>Phone Number</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className={styles.field} />
              </div>
            </div>
            <div className={styles.fieldFull}>
              <label className={styles.fieldLabel}>Street Address</label>
              <input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" className={styles.field} />
            </div>
            
            <div className={styles.fieldGrid3}>
              <div>
                <label className={styles.fieldLabel}>City</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className={styles.field} />
              </div>
              <div>
                <label className={styles.fieldLabel}>State</label>
                <input required type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className={styles.field} />
              </div>
              <div>
                <label className={styles.fieldLabel}>PIN Code</label>
                <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="PIN Code" className={styles.field} />
              </div>
            </div>

            <button type="submit" className="btn-primary">Continue to Payment</button>
          </div>
        )}

        {step === 2 && (
          <div className="fade-up">
            <h3 className={styles.sectionHeading}>Payment Method</h3>
            
            <div className={styles.paymentOptions}>
              <label className={`${styles.paymentOption} ${formData.paymentMethod === 'card' ? styles.paymentOptionActive : ''}`}>
                <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} className={styles.paymentRadio} />
                <span className={styles.paymentLabel}>Credit / Debit Card</span>
              </label>
              
              <label className={`${styles.paymentOption} ${formData.paymentMethod === 'upi' ? styles.paymentOptionActive : ''}`}>
                <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={handleChange} className={styles.paymentRadio} />
                <span className={styles.paymentLabel}>UPI (Google Pay, PhonePe)</span>
              </label>
              
              <label className={`${styles.paymentOption} ${formData.paymentMethod === 'cod' ? styles.paymentOptionActive : ''}`}>
                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className={styles.paymentRadio} />
                <span className={styles.paymentLabel}>Cash on Delivery</span>
              </label>
            </div>

            <div className={styles.buttonRow}>
              <button type="button" onClick={() => setStep(1)} className="btn-ghost">Back</button>
              <button type="submit" className="btn-primary">Review Order</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-up">
            <h3 className={styles.sectionHeading}>Review Order</h3>
            
            <div className={styles.reviewBlock}>
              <h4 className={styles.reviewTitle}>Shipping Address</h4>
              <p className={styles.reviewText}>
                {formData.firstName} {formData.lastName}<br/>
                {formData.address}, {formData.city}<br/>
                {formData.state} - {formData.pincode}<br/>
                {formData.phone}
              </p>
            </div>

            <div className={styles.reviewBlock}>
              <h4 className={styles.reviewTitle}>Payment</h4>
              <p className={styles.reviewText}>
                {formData.paymentMethod === 'card' ? 'Credit / Debit Card' : formData.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}
              </p>
            </div>

            <div className={styles.buttonRow}>
              <button type="button" onClick={() => setStep(2)} className="btn-ghost" disabled={loading}>Back</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
