import mongoose, { Schema, Document } from 'mongoose';

export interface ISellerAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ISellerPickup {
  contactPerson: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ISellerBankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string;
  accountType: 'current' | 'savings';
}

export interface ISeller extends Document {
  userId: mongoose.Types.ObjectId;
  storeName: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  contactEmail: string;
  contactPhone: string;

  businessDetails: {
    legalName: string;
    businessType: 'proprietorship' | 'partnership' | 'llp' | 'private_limited' | 'individual';
    gstin?: string;
    pan?: string;
    registeredAddress?: ISellerAddress;
  };

  pickupAddress: ISellerPickup;
  bankDetails: ISellerBankDetails;

  status: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  rejectionReason?: string;
  approvedAt?: Date;

  isSingleClient: boolean;
  commissionRate: number; // percentage, e.g. 0 for specific client, can be tuned later

  settings: {
    autoAcceptOrders: boolean;
    notifications: {
      email: boolean;
      sms: boolean;
      whatsapp: boolean;
    };
  };

  metrics: {
    rating: number;
    ratingCount: number;
    totalOrders: number;
    totalSales: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema = new Schema<ISeller>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    storeName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    banner: { type: String, default: '' },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },

    businessDetails: {
      legalName: { type: String, required: true, trim: true },
      businessType: {
        type: String,
        enum: ['proprietorship', 'partnership', 'llp', 'private_limited', 'individual'],
        default: 'individual',
      },
      gstin: { type: String, uppercase: true, trim: true },
      pan: { type: String, uppercase: true, trim: true },
      registeredAddress: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' },
      },
    },

    pickupAddress: {
      contactPerson: { type: String, required: true },
      phone: { type: String, required: true },
      line1: { type: String, required: true },
      line2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },

    bankDetails: {
      accountHolderName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true, uppercase: true },
      bankName: { type: String, required: true },
      branchName: String,
      accountType: { type: String, enum: ['current', 'savings'], default: 'current' },
    },

    status: {
      type: String,
      enum: ['PENDING_VERIFICATION', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'APPROVED', // Default to APPROVED for smooth initial setup of specific client
    },
    rejectionReason: String,
    approvedAt: { type: Date, default: Date.now },

    isSingleClient: { type: Boolean, default: true },
    commissionRate: { type: Number, default: 0 },

    settings: {
      autoAcceptOrders: { type: Boolean, default: true },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        whatsapp: { type: Boolean, default: true },
      },
    },

    metrics: {
      rating: { type: Number, default: 5.0 },
      ratingCount: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
      totalSales: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

SellerSchema.index({ status: 1 });
SellerSchema.index({ slug: 1 });

const Seller = mongoose.models.Seller || mongoose.model<ISeller>('Seller', SellerSchema);
export { Seller };
export default Seller;
