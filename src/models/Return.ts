import mongoose, { Schema } from 'mongoose'

const ReturnSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ orderItemId: String, quantity: Number, reason: String }],
  type: { type: String, enum: ['refund','exchange','store-credit'] },
  reason: String,
  exchangeDetails: { size: String, color: String },
  photos: [String],
  status: {
    type: String,
    enum: ['requested','approved','pickup-scheduled','picked-up','inspected','refunded','rejected'],
    default: 'requested'
  },
  pickupDate: Date,
  refundAmount: Number,
  refundedAt: Date,
}, { timestamps: true })

const Return = mongoose.models.Return || mongoose.model('Return', ReturnSchema);
export { Return };
export default Return;
