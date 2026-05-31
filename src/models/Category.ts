import mongoose, { Schema } from 'mongoose'

const CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Category' },
  image: String,
  description: String,
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export { Category };
export default Category;
