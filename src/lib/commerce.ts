import dbConnect from './mongodb';
import { Product } from '../models/Product';
import { Coupon } from '../models/Coupon';
import { StoreConfig } from '../models/StoreConfig';

export interface CheckoutRequestItem {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
}

export interface ValidatedItem {
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  image: string;
  color: string;
  size: string;
  material?: string;
  quantity: number;
  price: number; // Final selling price in paise
  originalPrice: number; // MRP in paise
  taxRate: number;
}

export interface OrderPricing {
  items: ValidatedItem[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
  couponDiscount: number;
  shippingCharge: number;
  tax: number;
  total: number;
}

export async function calculateOrderTotals(
  items: CheckoutRequestItem[],
  couponCode?: string | null
): Promise<OrderPricing> {
  await dbConnect();
  
  const validatedItems: ValidatedItem[] = [];
  let subtotal = 0;
  let savings = 0;

  for (const reqItem of items) {
    if (!reqItem.productId || !reqItem.quantity || reqItem.quantity <= 0) continue;

    const product = await Product.findById(reqItem.productId).lean();
    if (!product || !product.isActive) {
      throw new Error(`Product not found or unavailable`);
    }

    const variant = product.variants?.find((v: any) => String(v._id) === reqItem.variantId) || product.variants?.[0];
    if (!variant) {
      throw new Error(`Variant not found for product ${product.name}`);
    }

    const sizeObj = variant.sizes?.find((s: any) => s.size === reqItem.size);
    if (!sizeObj) {
      throw new Error(`Size ${reqItem.size} not found for product ${product.name}`);
    }

    if (sizeObj.stock < reqItem.quantity) {
      throw new Error(`Insufficient stock for ${product.name} (Size: ${reqItem.size})`);
    }

    const price = product.price;
    const originalPrice = product.originalPrice;
    
    // Default GST to 5% if not defined on product
    const taxRate = product.gst ?? 5;

    validatedItems.push({
      productId: String(product._id),
      variantId: String(variant._id),
      sku: sizeObj.sku || '',
      name: product.name,
      image: variant.images?.[0] || product.images?.[0] || '',
      color: variant.colorName || variant.color || 'Default',
      size: reqItem.size,
      quantity: reqItem.quantity,
      price,
      originalPrice,
      taxRate
    });

    subtotal += price * reqItem.quantity;
    savings += (originalPrice - price) * reqItem.quantity;
  }

  let couponDiscount = 0;
  let appliedCouponCode: string | null = null;
  
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon) {
      const now = new Date();
      if (!coupon.expiresAt || now <= new Date(coupon.expiresAt)) {
        if (!coupon.minOrderValue || subtotal >= coupon.minOrderValue) {
          if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
            
            if (coupon.type === 'percent') {
              let calculatedDiscount = (subtotal * coupon.value) / 100;
              if (coupon.maxDiscount) {
                calculatedDiscount = Math.min(calculatedDiscount, coupon.maxDiscount);
              }
              couponDiscount = Math.round(calculatedDiscount);
              appliedCouponCode = coupon.code;
            } else if (coupon.type === 'fixed') {
              couponDiscount = Math.round(coupon.value);
              appliedCouponCode = coupon.code;
            }
            
            couponDiscount = Math.min(couponDiscount, subtotal);
          }
        }
      }
    }
  }

  const taxableAmount = subtotal - couponDiscount;

  let tax = 0;
  for (const item of validatedItems) {
    const proportion = (item.price * item.quantity) / subtotal;
    const itemDiscount = couponDiscount * proportion;
    const itemTaxable = (item.price * item.quantity) - itemDiscount;
    tax += itemTaxable * (item.taxRate / 100);
  }
  tax = Math.round(tax);

  const config = await StoreConfig.findOne().lean();
  const freeShippingThreshold = config?.freeShippingThreshold ?? 99900;
  const standardShippingCharge = config?.shippingCharge ?? 15000;
  
  const shippingCharge = taxableAmount > freeShippingThreshold ? 0 : standardShippingCharge;

  const total = taxableAmount + tax + shippingCharge;

  return {
    items: validatedItems,
    subtotal,
    discount: savings,
    couponCode: appliedCouponCode,
    couponDiscount,
    shippingCharge,
    tax,
    total
  };
}
