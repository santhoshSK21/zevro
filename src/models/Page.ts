import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPageBlock {
  id: string;
  type: string;
  props: Record<string, any>;
}

export interface IPage extends Document {
  slug: string; // e.g., 'home', 'about'
  title: string;
  status: 'draft' | 'published';
  blocks: IPageBlock[];
  createdAt: Date;
  updatedAt: Date;
}

const PageBlockSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  props: { type: Schema.Types.Mixed, required: true },
}, { _id: false });

const PageSchema = new Schema<IPage>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  blocks: [PageBlockSchema],
}, {
  timestamps: true,
});

export const Page: Model<IPage> = mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);
