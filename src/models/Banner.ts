import mongoose, { Schema } from 'mongoose'

const BannerSchema = new Schema({
  title: String,
  subtitle: String,
  image: String,
  ctaText: String,
  ctaLink: String,
  position: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true })

const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
export { Banner };
export default Banner;
