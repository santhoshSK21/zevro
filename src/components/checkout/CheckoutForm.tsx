'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Hash, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  QrCode, 
  Truck, 
  ArrowRight, 
  ChevronLeft, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
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
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'upi'
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

  const tax = total * 0.05;
  const shippingThreshold = config?.freeShippingThreshold ?? 99900;
  const shippingFee = config?.shippingCharge ?? 15000;
  const shipping = total > shippingThreshold ? 0 : shippingFee;
  const finalTotal = total + tax + shipping - couponDiscount;
  const currencySymbol = config?.currencySymbol ?? '₹';

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Order in Database
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          paymentMethod: formData.paymentMethod,
          demoMode: !!(config?.demoMode || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID),
          couponCode: couponCode || undefined,
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

      // 2. Handle Demo Mode or COD
      if (formData.paymentMethod === 'cod' || config?.demoMode || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        clearCart();
        router.push(`/checkout/order-confirmed/${dbOrderId}`);
        return;
      }

      // 3. Load Razorpay Script
      const res = await loadRazorpayScript();
      if (!res) throw new Error("Razorpay SDK failed to load. Please check your internet connection.");

      // 4. Create Razorpay Order
      const rzpRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal, receipt: dbOrderId })
      });
      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) throw new Error(rzpData.error || 'Failed to initialize payment gateway');

      // 5. Open Razorpay Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rzpData.amount,
        currency: rzpData.currency || 'INR',
        name: config?.storeName || "ZEVRO LUXURY",
        description: "Bespoke Couture Order",
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
              alert("Payment verification failed. Please contact support.");
              setLoading(false);
            }
          } catch (err) {
            alert("Error verifying payment transaction");
            setLoading(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#0F172A" }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        alert("Payment was declined: " + (response.error?.description || "Transaction failed"));
        setLoading(false);
      });
      paymentObject.open();

    } catch (error: any) {
      alert(error.message || "An error occurred while creating order");
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkoutWrap}>
      
      {/* Step Navigation Pill Indicator */}
      <div className={styles.stepperHeader}>
        <button 
          type="button" 
          onClick={() => step > 1 && setStep(1)} 
          className={`${styles.stepPill} ${step === 1 ? styles.stepPillActive : ''} ${step > 1 ? styles.stepPillCompleted : ''}`}
        >
          <div className={`${styles.stepBadge} ${step === 1 ? styles.stepBadgeActive : ''} ${step > 1 ? styles.stepBadgeCompleted : ''}`}>
            {step > 1 ? '✓' : '1'}
          </div>
          <span>Shipping</span>
        </button>

        <div className={`${styles.stepConnector} ${step >= 2 ? styles.stepConnectorFilled : ''}`} />

        <button 
          type="button" 
          onClick={() => step > 2 && setStep(2)} 
          className={`${styles.stepPill} ${step === 2 ? styles.stepPillActive : ''} ${step > 2 ? styles.stepPillCompleted : ''}`}
        >
          <div className={`${styles.stepBadge} ${step === 2 ? styles.stepBadgeActive : ''} ${step > 2 ? styles.stepBadgeCompleted : ''}`}>
            {step > 2 ? '✓' : '2'}
          </div>
          <span>Payment</span>
        </button>

        <div className={`${styles.stepConnector} ${step >= 3 ? styles.stepConnectorFilled : ''}`} />

        <div className={`${styles.stepPill} ${step === 3 ? styles.stepPillActive : ''}`}>
          <div className={`${styles.stepBadge} ${step === 3 ? styles.stepBadgeActive : ''}`}>
            3
          </div>
          <span>Review</span>
        </div>
      </div>

      <form onSubmit={step === 3 ? handlePlaceOrder : handleNext}>
        
        {/* Step 1: Shipping Details */}
        {step === 1 && (
          <div>
            <h2 className={styles.sectionTitle}>Delivery Destination</h2>
            <p className={styles.sectionSubtitle}>Enter your shipping credentials for concierge white-glove delivery.</p>

            <div className={styles.fieldRow}>
              <div className={styles.inputFloatingWrapper}>
                <input 
                  required 
                  type="text" 
                  name="firstName" 
                  id="firstName"
                  value={formData.firstName} 
                  onChange={handleChange} 
                  placeholder=" " 
                  className={styles.luxInput} 
                />
                <label htmlFor="firstName" className={styles.luxLabel}>First Name</label>
                <div className={styles.inputIcon}><User size={16} /></div>
              </div>

              <div className={styles.inputFloatingWrapper}>
                <input 
                  required 
                  type="text" 
                  name="lastName" 
                  id="lastName"
                  value={formData.lastName} 
                  onChange={handleChange} 
                  placeholder=" " 
                  className={styles.luxInput} 
                />
                <label htmlFor="lastName" className={styles.luxLabel}>Last Name</label>
                <div className={styles.inputIcon}><User size={16} /></div>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.inputFloatingWrapper}>
                <input 
                  required 
                  type="email" 
                  name="email" 
                  id="email"
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder=" " 
                  className={styles.luxInput} 
                />
                <label htmlFor="email" className={styles.luxLabel}>Email Address</label>
                <div className={styles.inputIcon}><Mail size={16} /></div>
              </div>

              <div className={styles.inputFloatingWrapper}>
                <input 
                  required 
                  type="tel" 
                  name="phone" 
                  id="phone"
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder=" " 
                  className={styles.luxInput} 
                />
                <label htmlFor="phone" className={styles.luxLabel}>Mobile Number (+91)</label>
                <div className={styles.inputIcon}><Phone size={16} /></div>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div className={styles.inputFloatingWrapper}>
                <input 
                  required 
                  type="text" 
                  name="address" 
                  id="address"
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder=" " 
                  className={styles.luxInput} 
                />
                <label htmlFor="address" className={styles.luxLabel}>Flat / Villa / Street Address</label>
                <div className={styles.inputIcon}><MapPin size={16} /></div>
              </div>
            </div>

            <div className={styles.fieldRow3}>
              <div className={styles.inputFloatingWrapper}>
                <input 
                  required 
                  type="text" 
                  name="city" 
                  id="city"
                  value={formData.city} 
                  onChange={handleChange} 
                  placeholder=" " 
                  className={styles.luxInput} 
                />
                <label htmlFor="city" className={styles.luxLabel}>City</label>
                <div className={styles.inputIcon}><Building2 size={16} /></div>
              </div>

              <div className={styles.inputFloatingWrapper}>
                <input 
                  required 
                  type="text" 
                  name="state" 
                  id="state"
                  value={formData.state} 
                  onChange={handleChange} 
                  placeholder=" " 
                  className={styles.luxInput} 
                />
                <label htmlFor="state" className={styles.luxLabel}>State</label>
                <div className={styles.inputIcon}><Building2 size={16} /></div>
              </div>

              <div className={styles.inputFloatingWrapper}>
                <input 
                  required 
                  type="text" 
                  name="pincode" 
                  id="pincode"
                  value={formData.pincode} 
                  onChange={handleChange} 
                  placeholder=" " 
                  className={styles.luxInput} 
                />
                <label htmlFor="pincode" className={styles.luxLabel}>PIN Code</label>
                <div className={styles.inputIcon}><Hash size={16} /></div>
              </div>
            </div>

            <button type="submit" className={styles.submitBtnLuxury}>
              <span>Proceed to Payment</span>
              <ArrowRight size={16} />
              <span className={styles.btnPriceTag}>{currencySymbol}{(finalTotal / 100).toLocaleString('en-IN')}</span>
            </button>

            <div className={styles.securityNote}>
              <ShieldCheck size={14} color="#C5A880" />
              <span>256-bit Encrypted Checkout • Complimentary Luxury Packaging</span>
            </div>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <div>
            <h2 className={styles.sectionTitle}>Select Payment Gateway</h2>
            <p className={styles.sectionSubtitle}>Instant confirmation with encrypted banking protocols.</p>

            <div className={styles.paymentGrid}>
              
              {/* UPI Option */}
              <div 
                onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })} 
                className={`${styles.paymentCard} ${formData.paymentMethod === 'upi' ? styles.paymentCardActive : ''}`}
              >
                <div className={styles.paymentLeft}>
                  <div className={styles.paymentRadioOuter}>
                    <div className={styles.paymentRadioInner} />
                  </div>
                  <div>
                    <h3 className={styles.paymentTitle}>UPI Instant (Google Pay, PhonePe, Paytm, QR)</h3>
                    <p className={styles.paymentSub}>Fastest checkout with Zero Transaction Surcharge</p>
                  </div>
                </div>
                <div className={styles.paymentBadges}>
                  <span className={styles.tagPopular}>Recommended</span>
                  <QrCode size={20} color="#666" />
                </div>
              </div>

              {/* Cards Option */}
              <div 
                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })} 
                className={`${styles.paymentCard} ${formData.paymentMethod === 'card' ? styles.paymentCardActive : ''}`}
              >
                <div className={styles.paymentLeft}>
                  <div className={styles.paymentRadioOuter}>
                    <div className={styles.paymentRadioInner} />
                  </div>
                  <div>
                    <h3 className={styles.paymentTitle}>Credit / Debit Card</h3>
                    <p className={styles.paymentSub}>Visa, MasterCard, American Express, RuPay</p>
                  </div>
                </div>
                <CreditCard size={20} color="#666" />
              </div>

              {/* COD Option */}
              <div 
                onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })} 
                className={`${styles.paymentCard} ${formData.paymentMethod === 'cod' ? styles.paymentCardActive : ''}`}
              >
                <div className={styles.paymentLeft}>
                  <div className={styles.paymentRadioOuter}>
                    <div className={styles.paymentRadioInner} />
                  </div>
                  <div>
                    <h3 className={styles.paymentTitle}>Cash on Delivery (COD)</h3>
                    <p className={styles.paymentSub}>Pay safely in cash upon arrival of your garment</p>
                  </div>
                </div>
                <Truck size={20} color="#666" />
              </div>

            </div>

            <div className={styles.buttonRow}>
              <button type="button" onClick={() => setStep(1)} className={styles.btnBack}>
                <ChevronLeft size={16} /> Back
              </button>
              <button type="submit" className={styles.submitBtnLuxury} style={{ flex: 1 }}>
                <span>Review & Confirm Order</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review Order & Place */}
        {step === 3 && (
          <div>
            <h2 className={styles.sectionTitle}>Verify Order & Place</h2>
            <p className={styles.sectionSubtitle}>Please confirm your delivery coordinates and billing summary.</p>

            <div className={styles.reviewCard}>
              <div className={styles.reviewItem}>
                <span className={styles.reviewItemLabel}>Recipient & Address</span>
                <div className={styles.reviewItemValue}>
                  <strong>{formData.firstName} {formData.lastName}</strong><br />
                  {formData.address}<br />
                  {formData.city}, {formData.state} - {formData.pincode}<br />
                  <span style={{ color: '#79716B', fontSize: '12px' }}>{formData.phone} • {formData.email}</span>
                </div>
              </div>

              <div className={styles.reviewItem}>
                <span className={styles.reviewItemLabel}>Selected Payment</span>
                <div className={styles.reviewItemValue}>
                  {formData.paymentMethod === 'upi' ? '⚡ UPI Instant / QR Payment' : 
                   formData.paymentMethod === 'card' ? '💳 Credit / Debit Card' : 
                   '💵 Cash on Delivery (COD)'}
                </div>
              </div>

              <div className={styles.reviewItem}>
                <span className={styles.reviewItemLabel}>Order Total</span>
                <div className={styles.reviewItemValue} style={{ fontSize: '15px', fontWeight: 600, color: '#C5A880' }}>
                  {currencySymbol}{(finalTotal / 100).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className={styles.buttonRow}>
              <button type="button" onClick={() => setStep(2)} className={styles.btnBack} disabled={loading}>
                <ChevronLeft size={16} /> Back
              </button>
              <button type="submit" className={styles.submitBtnLuxury} style={{ flex: 1 }} disabled={loading}>
                {loading ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Authorize & Place Order</span>
                    <span className={styles.btnPriceTag}>{currencySymbol}{(finalTotal / 100).toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </div>

            <div className={styles.securityNote}>
              <CheckCircle2 size={14} color="#16A34A" />
              <span>Complimentary 7-day hassle-free exchanges & returns</span>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
