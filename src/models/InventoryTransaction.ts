import mongoose, { Schema } from 'mongoose';

const InventoryTransactionSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: String, required: true },
  size: { type: String, required: true },
  sku: { type: String },
  
  quantityChange: { type: Number, required: true },
  
  type: {
    type: String,
    enum: [
      'STOCK_RECEIVED',
      'STOCK_ADJUSTMENT',
      'STOCK_SOLD',
      'STOCK_RETURNED',
      'STOCK_CANCELLED',
      'STOCK_DAMAGED'
    ],
    required: true
  },
  
  reason: { type: String },
  
  referenceType: { type: String, enum: ['Order', 'Admin', 'Return'] },
  referenceId: { type: String }, // e.g., Order ID
  
  performedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // User or Admin ID
  
}, { timestamps: true });

// Indexes for quick lookups by product/order
InventoryTransactionSchema.index({ productId: 1, variantId: 1, size: 1 });
InventoryTransactionSchema.index({ referenceId: 1 });
InventoryTransactionSchema.index({ createdAt: -1 });

const InventoryTransaction = mongoose.models.InventoryTransaction || mongoose.model('InventoryTransaction', InventoryTransactionSchema);
export { InventoryTransaction };
export default InventoryTransaction;
