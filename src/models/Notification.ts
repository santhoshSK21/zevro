import mongoose, { Schema } from 'mongoose'

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: String,
  title: String,
  message: String,
  isRead: { type: Boolean, default: false },
  link: String
}, { timestamps: true })

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
export { Notification };
export default Notification;
