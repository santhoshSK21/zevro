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
      const order = await Order.findByIdAndUpdate(db_order_id, {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        status: 'processing' // Automatically move to processing once paid
      });

      if (order && order.items && order.items.length > 0) {
        const { Product } = require('../../../../models/Product');
        for (const item of order.items) {
          // Decrement stock for the specific size
          await Product.updateOne(
            { _id: item.productId, "variants.sizes.size": item.size },
            { $inc: { "variants.$[].sizes.$[sizeElem].stock": -item.quantity } },
            { arrayFilters: [{ "sizeElem.size": item.size }] }
          );
        }
      }
      
      // Increment coupon usage after successful payment
      if (order && order.pricing && order.pricing.couponCode) {
        const { Coupon } = require('../../../../models/Coupon');
        await Coupon.findOneAndUpdate(
          { code: order.pricing.couponCode },
          { $inc: { usedCount: 1 } }
        );
      }
      
      if (order.userId) {
        const { Cart } = require('../../../../models/Cart');
        await Cart.findOneAndDelete({ userId: order.userId });
      }
      
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
