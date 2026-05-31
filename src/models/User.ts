import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  phone?: string
  passwordHash?: string
  role: 'customer' | 'admin'
  avatar?: string
  gender?: string
  dob?: Date
  emailVerified: boolean
  isActive: boolean
  resetToken?: string
  resetTokenExpiry?: Date
  walletBalance: number
  preferences: {
    emailNotifications: boolean
    smsNotifications: boolean
    whatsappNotifications: boolean
  }
  lastLoginAt?: Date
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: String,
  passwordHash: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  avatar: String,
  gender: String,
  dob: Date,
  emailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  resetToken: String,
  resetTokenExpiry: Date,
  walletBalance: { type: Number, default: 0 },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    whatsappNotifications: { type: Boolean, default: true },
  },
  lastLoginAt: Date,
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export { User };
export default User;
