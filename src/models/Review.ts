import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  body?: string;
  images?: string[];
  helpfulVotes: number;
  verifiedPurchase: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  body: String,
  images: [String],
  
  helpfulVotes: { type: Number, default: 0 },
  verifiedPurchase: { type: Boolean, default: false },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  
  createdAt: { type: Date, default: Date.now }
});

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export default Review;
