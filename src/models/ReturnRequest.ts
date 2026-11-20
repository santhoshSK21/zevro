import mongoose, { Schema, Document } from 'mongoose';

export type ReturnStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'PICKUP_SCHEDULED'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'INSPECTION_PENDING'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'REPLACEMENT_PROCESSING'
  | 'COMPLETED';

export type ReturnCondition = 'SELLABLE' | 'DAMAGED' | 'DEFECTIVE' | 'QUARANTINE';

export interface IReturnAudit {
  status: ReturnStatus;
  action: string;
  performedBy: string;
  notes?: string;
  timestamp: Date;
}

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
  resolutionType: 'REFUND' | 'REPLACEMENT';
  reason: string;
  details?: string;
  photos: string[];

  exchangePreference?: {
    size?: string;
    color?: string;
  };

  status: ReturnStatus;
  rejectionReason?: string;

  reverseCourier?: {
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    scheduledPickupDate?: Date;
    actualPickupDate?: Date;
    receivedDate?: Date;
  };

  inspection?: {
    condition?: ReturnCondition;
    inspectedBy?: string;
    inspectedAt?: Date;
    notes?: string;
    inventoryAction?: 'RESTOCKED_TO_SELLABLE' | 'SCRAPPED_DAMAGED' | 'HELD_IN_QUARANTINE' | 'NONE';
  };

  inventoryRestocked: boolean;
  restockedAt?: Date;

  refund?: {
    amount: number; // in paise
    status: 'pending' | 'processed' | 'failed';
    method?: string; // 'razorpay' | 'original_source' | 'store_credit' | 'bank_transfer'
    transactionId?: string;
    refundedAt?: Date;
  };

  replacement?: {
    size?: string;
    color?: string;
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    status?: 'PENDING' | 'DISPATCHED' | 'DELIVERED';
    dispatchedAt?: Date;
    deliveredAt?: Date;
  };

  auditLog?: IReturnAudit[];
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
    resolutionType: { type: String, enum: ['REFUND', 'REPLACEMENT'], default: 'REFUND' },
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
        'INSPECTION_PENDING',
        'REFUND_PENDING',
        'REFUNDED',
        'REPLACEMENT_PROCESSING',
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
      actualPickupDate: Date,
      receivedDate: Date,
    },

    inspection: {
      condition: {
        type: String,
        enum: ['SELLABLE', 'DAMAGED', 'DEFECTIVE', 'QUARANTINE'],
      },
      inspectedBy: String,
      inspectedAt: Date,
      notes: String,
      inventoryAction: {
        type: String,
        enum: ['RESTOCKED_TO_SELLABLE', 'SCRAPPED_DAMAGED', 'HELD_IN_QUARANTINE', 'NONE'],
      },
    },

    inventoryRestocked: { type: Boolean, default: false },
    restockedAt: Date,

    refund: {
      amount: { type: Number, default: 0 },
      status: { type: String, enum: ['pending', 'processed', 'failed'], default: 'pending' },
      method: { type: String, default: 'original_source' },
      transactionId: String,
      refundedAt: Date,
    },

    replacement: {
      size: String,
      color: String,
      courierName: String,
      trackingNumber: String,
      trackingUrl: String,
      status: { type: String, enum: ['PENDING', 'DISPATCHED', 'DELIVERED'], default: 'PENDING' },
      dispatchedAt: Date,
      deliveredAt: Date,
    },

    auditLog: [
      {
        status: { type: String, required: true },
        action: { type: String, required: true },
        performedBy: { type: String, default: 'System' },
        notes: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    slaDeadline: {
      type: Date,
      default: () => new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours SLA
    },
  },
  { timestamps: true }
);

ReturnRequestSchema.index({ sellerId: 1, status: 1 });
ReturnRequestSchema.index({ userId: 1, orderId: 1 });
ReturnRequestSchema.index({ createdAt: -1 });

// Avoid schema caching in hot reloads
if (mongoose.models.ReturnRequest) {
  delete mongoose.models.ReturnRequest;
}

const ReturnRequest = mongoose.model<IReturnRequest>('ReturnRequest', ReturnRequestSchema);

export { ReturnRequest };
export default ReturnRequest;
