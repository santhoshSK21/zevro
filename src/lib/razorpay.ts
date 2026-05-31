import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance with placeholders (values provided in .env.local)
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

export const paymentService = {
  /**
   * Create a new Razorpay order
   * @param amount Amount in paise (1 INR = 100 paise)
   * @param receipt Unique receipt ID (e.g., your DB Order ID)
   */
  async createOrder(amount: number, receipt: string) {
    try {
      const options = {
        amount,
        currency: 'INR',
        receipt,
        payment_capture: 1
      };
      
      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Razorpay Order Creation Error:', error);
      throw new Error('Failed to create payment order');
    }
  },

  /**
   * Verify the Razorpay payment signature
   */
  verifyPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string): boolean {
    try {
      const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
      const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      return generated_signature === razorpay_signature;
    } catch (error) {
      console.error('Signature Verification Error:', error);
      return false;
    }
  }
};
