import mongoose, { Schema } from 'mongoose';

const StoreConfigSchema = new Schema({
  // General
  storeName: { type: String, default: 'Zevro' },
  storeLogoUrl: { type: String, default: '' },
  storeDescription: { type: String, default: '' },
  
  // Contact
  supportEmail: { type: String, default: 'hello@zevro.in' },
  supportPhone: { type: String, default: '+91 98765 43210' },
  whatsappNumber: { type: String, default: '' },
  
  // Social
  instagramUrl: { type: String, default: '' },
  facebookUrl: { type: String, default: '' },
  xUrl: { type: String, default: '' },
  pinterestUrl: { type: String, default: '' },
  
  // Commerce
  currency: { type: String, default: 'INR' },
  currencySymbol: { type: String, default: '₹' },
  freeShippingThreshold: { type: Number, default: 99900 }, // In paise
  shippingCharge: { type: Number, default: 15000 }, // In paise
  codEnabled: { type: Boolean, default: true },
  demoMode: { type: Boolean, default: false },
  
  // Brand
  announcementText: { type: String, default: 'FREE SHIPPING ON ORDERS OVER ₹999' },
  footerCopyright: { type: String, default: '© 2024 Zevro. All rights reserved.' },
  supportHours: { type: String, default: 'Mon-Sat, 9AM-6PM IST' }
}, { timestamps: true });

const StoreConfig = mongoose.models.StoreConfig || mongoose.model('StoreConfig', StoreConfigSchema);
export { StoreConfig };
export default StoreConfig;
