import mongoose, { Schema } from 'mongoose'

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    variantId: String,
    size: String,
    material: String,
    quantity: { type: Number, default: 1 },
    price: Number,
    sku: String
  }]
}, { timestamps: true })

const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);
export { Cart };
export default Cart;
