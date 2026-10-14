'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Building2,
  MapPin,
  Landmark,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Check
} from 'lucide-react';
import { signIn } from 'next-auth/react';

interface FormData {
  // Step 1: Account & Store
  name: string;
  email: string;
  phone: string;
  password: string;
  storeName: string;
  description: string;

  // Step 2: Business & Tax
  legalName: string;
  businessType: 'proprietorship' | 'partnership' | 'llp' | 'private_limited' | 'individual';
  gstin: string;
  pan: string;

  // Step 3: Pickup
  pickupContact: string;
  pickupPhone: string;
  pickupLine1: string;
  pickupLine2: string;
  pickupCity: string;
  pickupState: string;
  pickupPincode: string;

  // Step 4: Bank Details
  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: 'current' | 'savings';

  // Step 5: Terms
  acceptedTerms: boolean;
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  storeName: '',
  description: '',
  legalName: '',
  businessType: 'individual',
  gstin: '',
  pan: '',
  pickupContact: '',
  pickupPhone: '',
  pickupLine1: '',
  pickupLine2: '',
  pickupCity: '',
  pickupState: '',
  pickupPincode: '',
  accountHolderName: '',
  accountNumber: '',
  confirmAccountNumber: '',
  ifscCode: '',
  bankName: '',
  branchName: '',
  accountType: 'current',
  acceptedTerms: false,
};

const STEPS = [
  { id: 1, title: 'Store Identity', icon: Store, desc: 'Brand & account info' },
  { id: 2, title: 'Business & Tax', icon: Building2, desc: 'Legal entity details' },
  { id: 3, title: 'Pickup Hub', icon: MapPin, desc: 'Dispatch & courier address' },
  { id: 4, title: 'Bank Settlement', icon: Landmark, desc: 'Payout account' },
  { id: 5, title: 'Review & Launch', icon: CheckCircle2, desc: 'Confirm & start selling' },
];

export default function SellerRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zevro_seller_reg_draft');
      if (saved) {
        setFormData(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      try {
        localStorage.setItem('zevro_seller_reg_draft', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setErrorMsg('');
  };

  const validateCurrentStep = (): boolean => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!formData.storeName.trim()) {
        setErrorMsg('Please enter your store display name.');
        return false;
      }
      if (!formData.name.trim()) {
        setErrorMsg('Please enter your full contact name.');
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return false;
      }
      if (!formData.phone.trim() || formData.phone.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return false;
      }
      if (!formData.password || formData.password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return false;
      }
      if (!formData.pickupContact) updateField('pickupContact', formData.name);
      if (!formData.pickupPhone) updateField('pickupPhone', formData.phone);
      if (!formData.legalName) updateField('legalName', formData.storeName);
      if (!formData.accountHolderName) updateField('accountHolderName', formData.name);
    }

    if (currentStep === 2) {
      if (!formData.legalName.trim()) {
        setErrorMsg('Please specify your registered business/legal name.');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.pickupContact.trim() || !formData.pickupPhone.trim()) {
        setErrorMsg('Please specify contact person and phone number for courier pickups.');
        return false;
      }
      if (!formData.pickupLine1.trim() || !formData.pickupCity.trim() || !formData.pickupState.trim() || !formData.pickupPincode.trim()) {
        setErrorMsg('Please provide complete street address, city, state and pincode.');
        return false;
      }
      if (formData.pickupPincode.trim().length !== 6) {
        setErrorMsg('Please enter a valid 6-digit postal pincode.');
        return false;
      }
    }

    if (currentStep === 4) {
      if (!formData.accountHolderName.trim()) {
        setErrorMsg('Please enter the account holder name as registered with the bank.');
        return false;
      }
      if (!formData.accountNumber.trim()) {
        setErrorMsg('Please enter your bank account number.');
        return false;
      }
      if (formData.accountNumber !== formData.confirmAccountNumber) {
        setErrorMsg('Account numbers do not match. Please verify.');
        return false;
      }
      if (!formData.ifscCode.trim() || formData.ifscCode.length < 9) {
        setErrorMsg('Please enter a valid Bank IFSC code.');
        return false;
      }
      if (!formData.bankName.trim()) {
        setErrorMsg('Please specify your bank name (e.g. HDFC Bank, ICICI Bank, SBI).');
        return false;
      }
    }

    if (currentStep === 5) {
      if (!formData.acceptedTerms) {
        setErrorMsg('Please review and accept the marketplace seller agreement to proceed.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        storeName: formData.storeName,
        description: formData.description,
        businessDetails: {
          legalName: formData.legalName,
          businessType: formData.businessType,
          gstin: formData.gstin.toUpperCase().trim(),
          pan: formData.pan.toUpperCase().trim(),
          registeredAddress: {
            line1: formData.pickupLine1,
            line2: formData.pickupLine2,
            city: formData.pickupCity,
            state: formData.pickupState,
            pincode: formData.pickupPincode,
            country: 'India',
          },
        },
        pickupAddress: {
          contactPerson: formData.pickupContact,
          phone: formData.pickupPhone,
          line1: formData.pickupLine1,
          line2: formData.pickupLine2,
          city: formData.pickupCity,
          state: formData.pickupState,
          pincode: formData.pickupPincode,
          country: 'India',
        },
        bankDetails: {
          accountHolderName: formData.accountHolderName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode.toUpperCase().trim(),
          bankName: formData.bankName,
          branchName: formData.branchName,
          accountType: formData.accountType,
        },
      };

      const res = await fetch('/api/seller/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete registration');
      }

      // Clear draft on success
      localStorage.removeItem('zevro_seller_reg_draft');
      setIsSuccess(true);

      // Sign user into NextAuth session automatically
      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      // Redirect after smooth celebration
      setTimeout(() => {
        router.push('/seller');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: 'easeInOut' as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeInOut' as const },
    }),
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F1E8', color: '#1C1C1A', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header
        style={{
          borderBottom: '1px solid #DDD6C8',
          background: 'rgba(245, 241, 232, 0.95)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.12em', color: '#1C1C1A' }}>ZEVRO</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                background: '#1C1C1A',
                color: '#FAF8F5',
                padding: '2px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}
            >
              Seller Hub
            </span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
          <span style={{ color: '#68645C' }}>Already have a seller account?</span>
          <Link
            href="/seller/login"
            style={{
              color: '#1C1C1A',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '6px 14px',
              border: '1px solid #1C1C1A',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '960px', width: '100%', margin: '0 auto', padding: '36px 20px 60px' }}>
        {/* Header Intro */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#EAE4D8',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#1C1C1A',
              marginBottom: '12px',
            }}
          >
            <Sparkles size={14} color="#B49A68" />
            Merchant Partner Registration
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            Setup Your Seller Account
          </h1>
          <p style={{ color: '#68645C', fontSize: '15px', margin: 0 }}>
            List products, fulfill customer orders, and track payouts in your dedicated portal.
          </p>
        </div>

        {/* Multi-step Progress Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            marginBottom: '40px',
            padding: '0 12px',
          }}
        >
          {/* Background Track Line */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: '48px',
              right: '48px',
              height: '2px',
              background: '#DDD6C8',
              zIndex: 0,
            }}
          />
          {/* Active Filled Track Line */}
          <motion.div
            style={{
              position: 'absolute',
              top: '18px',
              left: '48px',
              height: '2px',
              background: '#1C1C1A',
              zIndex: 1,
            }}
            initial={false}
            animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 88}%` }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          />

          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 2,
                  cursor: isCompleted ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (isCompleted) {
                    setDirection(-1);
                    setCurrentStep(step.id);
                  }
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isCompleted ? '#1C1C1A' : isActive ? '#FAF8F5' : '#EAE4D8',
                    border: isActive ? '2px solid #1C1C1A' : '1px solid #DDD6C8',
                    color: isCompleted ? '#FAF8F5' : isActive ? '#1C1C1A' : '#68645C',
                    boxShadow: isActive ? '0 0 0 4px rgba(28, 28, 26, 0.08)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isCompleted ? <Check size={18} strokeWidth={2.5} /> : <Icon size={18} />}
                </div>
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#1C1C1A' : isCompleted ? '#1C1C1A' : '#68645C',
                    }}
                  >
                    {step.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#FDECEA',
              color: '#9E2A2B',
              border: '1px solid #F5C6CB',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '24px',
              fontSize: '14px',
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Card Form Container */}
        <div
          style={{
            background: '#FAF8F5',
            borderRadius: '16px',
            border: '1px solid #DDD6C8',
            padding: '36px 32px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: 'center', padding: '40px 20px' }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: '#E8F5E9',
                  color: '#2E7D32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <CheckCircle2 size={40} />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: 600, margin: '0 0 8px' }}>Registration Complete!</h2>
              <p style={{ color: '#68645C', fontSize: '15px', maxWidth: '460px', margin: '0 auto 24px' }}>
                Your merchant profile for <strong>{formData.storeName}</strong> has been configured. Entering your seller dashboard...
              </p>
              <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid #DDD6C8', borderTopColor: '#1C1C1A', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </motion.div>
          ) : (
            <AnimatePresence custom={direction} mode="wait">
              {/* STEP 1: Store & Account */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  <div style={{ borderBottom: '1px solid #EAE4D8', paddingBottom: '16px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 4px' }}>Store & Account Identity</h3>
                    <p style={{ fontSize: '13px', color: '#68645C', margin: 0 }}>
                      Provide your storefront display brand and the primary owner credentials.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Store Display Name *
                      </label>
                      <input
                        type="text"
                        value={formData.storeName}
                        onChange={(e) => updateField('storeName', e.target.value)}
                        placeholder="e.g. Royal Atelier, House of Zevro"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                      <span style={{ fontSize: '11px', color: '#68645C', marginTop: '4px', display: 'block' }}>
                        This is the name customers will see on product listings and receipts.
                      </span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Store Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        placeholder="e.g. Handcrafted bespoke garments and luxury silks"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Full Contact Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="e.g. Santhosh Kumar"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="10-digit mobile number"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Business Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="seller@yourbrand.com"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Seller Portal Password *
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        placeholder="At least 6 characters"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Business & Tax */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  <div style={{ borderBottom: '1px solid #EAE4D8', paddingBottom: '16px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 4px' }}>Business & Tax Information</h3>
                    <p style={{ fontSize: '13px', color: '#68645C', margin: 0 }}>
                      Provide your legal company details for invoicing, GST compliance, and settlement reporting.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Legal Registered Entity Name *
                      </label>
                      <input
                        type="text"
                        value={formData.legalName}
                        onChange={(e) => updateField('legalName', e.target.value)}
                        placeholder="e.g. Zevro Textiles Private Limited"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Business Constitution Type
                      </label>
                      <select
                        value={formData.businessType}
                        onChange={(e: any) => updateField('businessType', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      >
                        <option value="individual">Individual / Sole Proprietor</option>
                        <option value="proprietorship">Sole Proprietorship</option>
                        <option value="partnership">Partnership Firm</option>
                        <option value="llp">Limited Liability Partnership (LLP)</option>
                        <option value="private_limited">Private Limited Company (Pvt Ltd)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        GSTIN (Goods & Services Tax ID)
                      </label>
                      <input
                        type="text"
                        value={formData.gstin}
                        onChange={(e) => updateField('gstin', e.target.value)}
                        placeholder="e.g. 33AAAAA0000A1Z5"
                        maxLength={15}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          textTransform: 'uppercase',
                          outline: 'none',
                        }}
                      />
                      <span style={{ fontSize: '11px', color: '#68645C', marginTop: '4px', display: 'block' }}>
                        Required for automated B2B customer invoices and GST returns.
                      </span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Business PAN (Permanent Account Number)
                      </label>
                      <input
                        type="text"
                        value={formData.pan}
                        onChange={(e) => updateField('pan', e.target.value)}
                        placeholder="e.g. ABCDE1234F"
                        maxLength={10}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          textTransform: 'uppercase',
                          outline: 'none',
                        }}
                      />
                      <span style={{ fontSize: '11px', color: '#68645C', marginTop: '4px', display: 'block' }}>
                        Used for TDS / TCS compliance and annual tax statements.
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Pickup Hub */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  <div style={{ borderBottom: '1px solid #EAE4D8', paddingBottom: '16px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 4px' }}>Pickup & Dispatch Location</h3>
                    <p style={{ fontSize: '13px', color: '#68645C', margin: 0 }}>
                      Couriers (e.g. Shiprocket, Bluedart, Delhivery) will arrive at this address to collect packed orders.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Pickup Contact Person *
                      </label>
                      <input
                        type="text"
                        value={formData.pickupContact}
                        onChange={(e) => updateField('pickupContact', e.target.value)}
                        placeholder="Warehouse manager or dispatch contact"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Pickup Contact Phone *
                      </label>
                      <input
                        type="tel"
                        value={formData.pickupPhone}
                        onChange={(e) => updateField('pickupPhone', e.target.value)}
                        placeholder="Courier driver will call this number"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                      Street Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={formData.pickupLine1}
                      onChange={(e) => updateField('pickupLine1', e.target.value)}
                      placeholder="Building, Plot No., Industrial Estate, Street"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '1px solid #DDD6C8',
                        borderRadius: '8px',
                        background: '#FAF8F5',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.pickupLine2}
                      onChange={(e) => updateField('pickupLine2', e.target.value)}
                      placeholder="Floor, Landmark, Unit details"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '1px solid #DDD6C8',
                        borderRadius: '8px',
                        background: '#FAF8F5',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.pickupCity}
                        onChange={(e) => updateField('pickupCity', e.target.value)}
                        placeholder="e.g. Chennai, Mumbai"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.pickupState}
                        onChange={(e) => updateField('pickupState', e.target.value)}
                        placeholder="e.g. Tamil Nadu, Maharashtra"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={formData.pickupPincode}
                        onChange={(e) => updateField('pickupPincode', e.target.value)}
                        placeholder="6-digit pincode"
                        maxLength={6}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Bank Settlement */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  <div style={{ borderBottom: '1px solid #EAE4D8', paddingBottom: '16px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 4px' }}>Bank Account & Settlements</h3>
                    <p style={{ fontSize: '13px', color: '#68645C', margin: 0 }}>
                      Sales revenue after order delivery will be disbursed directly to this verified bank account.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Beneficiary / Account Holder Name *
                      </label>
                      <input
                        type="text"
                        value={formData.accountHolderName}
                        onChange={(e) => updateField('accountHolderName', e.target.value)}
                        placeholder="Exact name as in bank passbook"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Account Type
                      </label>
                      <select
                        value={formData.accountType}
                        onChange={(e: any) => updateField('accountType', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      >
                        <option value="current">Current Account (Recommended for Business)</option>
                        <option value="savings">Savings Account</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Bank Account Number *
                      </label>
                      <input
                        type="password"
                        value={formData.accountNumber}
                        onChange={(e) => updateField('accountNumber', e.target.value)}
                        placeholder="Enter account number"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Re-enter Bank Account Number *
                      </label>
                      <input
                        type="text"
                        value={formData.confirmAccountNumber}
                        onChange={(e) => updateField('confirmAccountNumber', e.target.value)}
                        placeholder="Confirm account number"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        value={formData.ifscCode}
                        onChange={(e) => updateField('ifscCode', e.target.value)}
                        placeholder="e.g. HDFC0001234"
                        maxLength={11}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          textTransform: 'uppercase',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => updateField('bankName', e.target.value)}
                        placeholder="e.g. HDFC Bank, SBI, ICICI Bank"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid #DDD6C8',
                          borderRadius: '8px',
                          background: '#FAF8F5',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: Review & Launch */}
              {currentStep === 5 && (
                <motion.div
                  key="step-5"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                >
                  <div style={{ borderBottom: '1px solid #EAE4D8', paddingBottom: '16px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 4px' }}>Review & Final Confirmation</h3>
                    <p style={{ fontSize: '13px', color: '#68645C', margin: 0 }}>
                      Verify your seller credentials before launching your merchant dashboard.
                    </p>
                  </div>

                  {/* Summary Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {/* Store Card */}
                    <div style={{ border: '1px solid #DDD6C8', borderRadius: '10px', padding: '16px', background: '#F5F1E8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#68645C' }}>Store Info</span>
                        <button
                          onClick={() => { setDirection(-1); setCurrentStep(1); }}
                          style={{ background: 'none', border: 'none', fontSize: '12px', color: '#1C1C1A', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 600 }}>{formData.storeName}</div>
                      <div style={{ fontSize: '13px', color: '#68645C', marginTop: '4px' }}>{formData.email} • {formData.phone}</div>
                    </div>

                    {/* Business Card */}
                    <div style={{ border: '1px solid #DDD6C8', borderRadius: '10px', padding: '16px', background: '#F5F1E8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#68645C' }}>Business & Tax</span>
                        <button
                          onClick={() => { setDirection(-1); setCurrentStep(2); }}
                          style={{ background: 'none', border: 'none', fontSize: '12px', color: '#1C1C1A', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 600 }}>{formData.legalName}</div>
                      <div style={{ fontSize: '13px', color: '#68645C', marginTop: '4px' }}>
                        GSTIN: {formData.gstin || 'Not Provided'} | PAN: {formData.pan || 'Not Provided'}
                      </div>
                    </div>

                    {/* Pickup Address Card */}
                    <div style={{ border: '1px solid #DDD6C8', borderRadius: '10px', padding: '16px', background: '#F5F1E8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#68645C' }}>Dispatch Pickup</span>
                        <button
                          onClick={() => { setDirection(-1); setCurrentStep(3); }}
                          style={{ background: 'none', border: 'none', fontSize: '12px', color: '#1C1C1A', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{formData.pickupContact} ({formData.pickupPhone})</div>
                      <div style={{ fontSize: '13px', color: '#68645C', marginTop: '4px' }}>
                        {formData.pickupLine1}, {formData.pickupCity}, {formData.pickupState} - {formData.pickupPincode}
                      </div>
                    </div>

                    {/* Bank Settlement Card */}
                    <div style={{ border: '1px solid #DDD6C8', borderRadius: '10px', padding: '16px', background: '#F5F1E8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#68645C' }}>Settlement Account</span>
                        <button
                          onClick={() => { setDirection(-1); setCurrentStep(4); }}
                          style={{ background: 'none', border: 'none', fontSize: '12px', color: '#1C1C1A', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{formData.bankName}</div>
                      <div style={{ fontSize: '13px', color: '#68645C', marginTop: '4px' }}>
                        A/C: •••• {formData.accountNumber.slice(-4)} | IFSC: {formData.ifscCode}
                      </div>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div
                    style={{
                      borderTop: '1px solid #EAE4D8',
                      paddingTop: '20px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.acceptedTerms}
                      onChange={(e) => updateField('acceptedTerms', e.target.checked)}
                      style={{ marginTop: '3px', width: '18px', height: '18px', accentColor: '#1C1C1A', cursor: 'pointer' }}
                    />
                    <label htmlFor="terms" style={{ fontSize: '13px', color: '#1C1C1A', cursor: 'pointer', lineHeight: 1.5 }}>
                      I agree to the <strong>Seller Marketplace Terms & Conditions</strong> and acknowledge that all product listings, orders, and customer fulfillments will adhere to marketplace policies.
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Navigation Controls */}
          {!isSuccess && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid #EAE4D8',
              }}
            >
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'transparent',
                    border: '1px solid #DDD6C8',
                    color: '#1C1C1A',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#1C1C1A',
                    color: '#FAF8F5',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#1C1C1A',
                    color: '#FAF8F5',
                    border: 'none',
                    padding: '12px 28px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isSubmitting ? (
                    'Launching Store...'
                  ) : (
                    <>
                      <Sparkles size={16} color="#B49A68" /> Complete & Launch Portal
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
