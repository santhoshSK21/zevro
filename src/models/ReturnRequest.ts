import mongoose, { Schema, Document } from 'mongoose';

export interface IReturnRequest extends Document {
  orderId: mongoose.Types.ObjectId;
  orderNumber: string;
  sellerId: mongoose.Types.ObjectId;
  sellerStoreName: string;
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  userPhone?: string;

  item: {
    productId: mongoose.Types.ObjectId;
    name: string;
    image: string;
    color?: string;
    size?: string;
    quantity: number;
    price: number; // in paise
    sku?: string;
  };

  type: 'RETURN' | 'EXCHANGE';
  reason: string;
  details?: string;
  photos: string[];

  exchangePreference?: {
    size?: string;
    color?: string;
  };

  status:
    | 'REQUESTED'
    | 'APPROVED'
    | 'REJECTED'
    | 'PICKUP_SCHEDULED'
    | 'IN_TRANSIT'
    | 'RECEIVED'
    | 'REFUNDED'
    | 'EXCHANGE_SHIPPED'
    | 'COMPLETED';

  rejectionReason?: string;

  reverseCourier?: {
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    scheduledPickupDate?: Date;
  };

  inventoryRestocked: boolean;
  restockedAt?: Date;

  refund?: {
    amount: number; // in paise
    status: 'pending' | 'processed';
    transactionId?: string;
    refundedAt?: Date;
  };

  slaDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReturnRequestSchema = new Schema<IReturnRequest>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    orderNumber: { type: String, required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    sellerStoreName: { type: String, default: 'ZEVRO Signature Atelier' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    userPhone: String,

    item: {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      image: { type: String, default: '/pdp_hero_1.png' },
      color: String,
      size: String,
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },
      sku: String,
    },

    type: { type: String, enum: ['RETURN', 'EXCHANGE'], default: 'RETURN' },
    reason: { type: String, required: true },
    details: { type: String, default: '' },
    photos: [{ type: String }],

    exchangePreference: {
      size: String,
      color: String,
    },

    status: {
      type: String,
      enum: [
        'REQUESTED',
        'APPROVED',
        'REJECTED',
        'PICKUP_SCHEDULED',
        'IN_TRANSIT',
        'RECEIVED',
        'REFUNDED',
        'EXCHANGE_SHIPPED',
        'COMPLETED',
      ],
      default: 'REQUESTED',
      index: true,
    },

    rejectionReason: String,

    reverseCourier: {
      courierName: String,
      trackingNumber: String,
      trackingUrl: String,
      scheduledPickupDate: Date,
    },

    inventoryRestocked: { type: Boolean, default: false },
    restockedAt: Date,

    refund: {
      amount: { type: Number, default: 0 },
      status: { type: String, enum: ['pending', 'processed'], default: 'pending' },
      transactionId: String,
      refundedAt: Date,
    },

    slaDeadline: {
      type: Date,
      default: () => new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours SLA
    },
  },
  { timestamps: true }
);

ReturnRequestSchema.index({ sellerId: 1, status: 1 });
ReturnRequestSchema.index({ userId: 1, orderId: 1 });

const ReturnRequest =
  mongoose.models.ReturnRequest ||
  mongoose.model<IReturnRequest>('ReturnRequest', ReturnRequestSchema);

export { ReturnRequest };
export default ReturnRequest;
