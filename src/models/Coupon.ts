import mongoose, { Schema } from 'mongoose'

const CouponSchema = new Schema({
  code: { type: String, unique: true, uppercase: true, required: true },
  description: String,
  type: { type: String, enum: ['percent','fixed'], required: true },
  value: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: Number,
  usageLimit: Number,
  usedCount: { type: Number, default: 0 },
  userUsageLimit: { type: Number, default: 1 },
  applicableCategories: [String],
  expiresAt: Date,
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
export { Coupon };
export default Coupon;
