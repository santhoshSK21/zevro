import { NextResponse } from 'next/server';
import { paymentService } from '../../../../lib/razorpay';
import dbConnect from '../../../../lib/mongodb';
import { Order } from '../../../../models/Order';

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      db_order_id 
    } = await request.json();
    
    const isValid = paymentService.verifyPayment(
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature
    );
    
    if (isValid) {
      // Update order status in DB
      await dbConnect();
      await Order.findByIdAndUpdate(db_order_id, {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        status: 'processing' // Automatically move to processing once paid
      });
      
      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } else {
      await dbConnect();
      await Order.findByIdAndUpdate(db_order_id, {
        paymentStatus: 'failed'
      });
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
