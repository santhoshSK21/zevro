import mongoose, { Schema } from 'mongoose'

const OrderSchema = new Schema({
  orderId: { type: String, unique: true },   // ZEVRO-YYYY-XXXXX
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    variantId: String,
    name: String, image: String,
    color: String, size: String,
    material: String,
    quantity: Number,
    priceAtPurchase: Number,
    mrpAtPurchase: Number,
    sku: String
  }],
  
  shippingAddress: {
    name: String, phone: String, email: String,
    line1: String, line2: String, city: String,
    state: String, pincode: String, country: { type: String, default: 'India' }
  },
  
  pricing: {
    subtotal: Number,
    discount: Number,
    couponCode: String,
    couponDiscount: Number,
    shippingCharge: Number,
    codCharge: Number,
    gst: Number,
    total: Number
  },
  
  payment: {
    method: { type: String, enum: ['razorpay','cod','demo','wallet'] },
    status: { type: String, enum: ['pending','paid','failed','refunded','cod-pending'], default: 'pending' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date
  },
  
  shipping: {
    provider: String, awbCode: String, shipmentId: String,
    courierName: String, trackingUrl: String,
    estimatedDelivery: Date
  },
  
  status: {
    type: String,
    enum: ['placed','confirmed','processing','packed','shipped','out-for-delivery','delivered','cancelled','return-requested','return-approved','returned'],
    default: 'placed'
  },
  
  timeline: [{
    status: String, message: String,
    location: String, timestamp: { type: Date, default: Date.now }
  }],
  
  cancelReason: String,
  notes: String,
  invoiceUrl: String,
}, { timestamps: true })

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export { Order };
export default Order;
