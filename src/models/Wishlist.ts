import mongoose, { Schema } from 'mongoose'

const WishlistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true })

const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);
export { Wishlist };
export default Wishlist;
