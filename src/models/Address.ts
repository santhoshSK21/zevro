import mongoose, { Schema } from 'mongoose'

const AddressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  label: String,
  isDefault: { type: Boolean, default: false },
  name: String,
  phone: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: 'India' }
}, { timestamps: true })

const Address = mongoose.models.Address || mongoose.model('Address', AddressSchema);
export { Address };
export default Address;
