import { NextResponse } from 'next/server';
import { paymentService } from '../../../../lib/razorpay';
import dbConnect from '../../../../lib/mongodb';
import { Order } from '../../../../models/Order';
import { InventoryTransaction } from '../../../../models/InventoryTransaction';
import { Product } from '../../../../models/Product';
import { Coupon } from '../../../../models/Coupon';
import { Cart } from '../../../../models/Cart';

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      db_order_id 
    } = await request.json();
    
    await dbConnect();
    
    // 1. Fetch order and check for idempotency
    const order = await Order.findById(db_order_id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    
    // Idempotency: If already paid, acknowledge gracefully (webhook retry)
    if (order.payment.status === 'paid' || order.paymentStatus === 'paid') {
      return NextResponse.json({ success: true, message: 'Payment already verified' });
    }
    
    const isValid = paymentService.verifyPayment(
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature
    );
    
    if (isValid) {
      // 2. Safely deduct inventory atomically
      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          
          // Atomic decrement, strictly ensuring stock >= quantity
          const result = await Product.updateOne(
            { 
              _id: item.productId, 
              "variants.sizes": { $elemMatch: { size: item.size, stock: { $gte: item.quantity } } } 
            },
            { 
              $inc: { "variants.$[].sizes.$[sizeElem].stock": -item.quantity } 
            },
            { 
              arrayFilters: [{ "sizeElem.size": item.size }] 
            }
          );
          
          // If result.modifiedCount === 0, the stock was insufficient. 
          // In a real app we might handle partial fulfillment or immediate refund,
          // but here we log it as a critical failure for admin attention.
          if (result.modifiedCount === 0) {
            console.error(`CRITICAL: Stock deduction failed for ${item.name} size ${item.size} on order ${order.orderId}. Out of stock.`);
            // You can optionally add logic to refund the Razorpay payment here.
          } else {
            // Log the inventory transaction
            await InventoryTransaction.create({
              productId: item.productId,
              variantId: item.variantId,
              size: item.size,
              sku: item.sku,
              quantityChange: -item.quantity,
              type: 'STOCK_SOLD',
              reason: `Sold in order ${order.orderId}`,
              referenceType: 'Order',
              referenceId: order._id,
              performedBy: order.userId
            });
          }
        }
      }
      
      // 3. Mark Order as Paid
      order.payment.status = 'paid';
      order.payment.razorpayPaymentId = razorpay_payment_id;
      order.payment.razorpaySignature = razorpay_signature;
      order.payment.paidAt = new Date();
      order.paymentStatus = 'paid';
      order.status = 'processing';
      order.timeline.push({
        status: 'processing',
        message: 'Payment received, order processing',
        timestamp: new Date()
      });
      await order.save();
      
      // 4. Increment coupon usage 
      if (order.pricing && order.pricing.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: order.pricing.couponCode },
          { $inc: { usedCount: 1 } }
        );
      }
      
      // 5. Clear Cart
      if (order.userId) {
        await Cart.findOneAndDelete({ userId: order.userId });
      }
      
      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
      
    } else {
      order.payment.status = 'failed';
      order.paymentStatus = 'failed';
      order.timeline.push({
        status: 'payment-failed',
        message: 'Payment signature verification failed',
        timestamp: new Date()
      });
      await order.save();
      
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}

