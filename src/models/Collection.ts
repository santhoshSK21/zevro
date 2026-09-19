import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICollection extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CollectionSchema.index({ slug: 1 });
CollectionSchema.index({ isActive: 1 });

export const Collection: Model<ICollection> =
  mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);

export default Collection;
