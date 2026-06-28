import mongoose, { Schema } from 'mongoose'

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  shortDescription: String,
  
  category: {
    type: String, required: true
  },
  subcategory: String,
  occasion: [String],         // ['festive','casual','wedding','office']
  
  variants: [{
    colorName: String,
    colorHex: String,
    images: [String],         // URLs
    sizes: [{
      size: String,           // XS S M L XL XXL or 36 38 40 etc.
      stock: { type: Number, default: 0 },
      sku: String
    }]
  }],
  
  materials: [{              // multiple material options for same product
    name: String,            // 'Pure Silk', 'Cotton Blend'
    priceModifier: Number,   // +500 for silk variant
    available: Boolean
  }],
  
  price: { type: Number, required: true },         // INR paise
  originalPrice: { type: Number, required: true }, // MRP in paise
  
  fabric: String,
  careInstructions: [String],
  features: [String],
  
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  
  tags: [String],
  isFeatured:    { type: Boolean, default: false },
  isNewArrival:  { type: Boolean, default: false },
  isBestseller:  { type: Boolean, default: false },
  isActive:      { type: Boolean, default: true },
  
  weight: Number,   // grams
  hsn: String,
  gst: { type: Number, default: 5 }, // GST percentage
  
  seoTitle: String,
  seoDescription: String,
}, { timestamps: true })

ProductSchema.index({ slug: 1 })
ProductSchema.index({ category: 1, isActive: 1 })
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' })

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export { Product };
export default Product;
