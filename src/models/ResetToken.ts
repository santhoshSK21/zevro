import mongoose, { Schema } from 'mongoose';

const ResetTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tokenHash: { type: String, required: true }, // Hashed version of the token sent to user
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

// TTL index to automatically delete expired tokens
ResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ResetToken = mongoose.models.ResetToken || mongoose.model('ResetToken', ResetTokenSchema);
export { ResetToken };
export default ResetToken;
