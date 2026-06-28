import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { Order } from '../../../../models/Order';
import { auth } from '../../../../auth';
import { assertAdminAccess } from '../../../../lib/adminAuth';
import { shippingService } from '../../../../lib/shiprocket';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const isAdmin = await assertAdminAccess();
    const session = await auth();
    await dbConnect();
    
    const order = await Order.findById(resolvedParams.id).lean();
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    // Auth check (admin or owner)
    if (order.userId?.toString() !== session?.user?.id && !isAdmin) {
      // Basic guest check (ideally requires order token, but for now simple check)
      if (order.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const body = await request.json();
    
    // If status updated to processing, potentially trigger shiprocket
    if (body.status === 'processing' && body.triggerShipping) {
      const order = await Order.findById(resolvedParams.id);
      if (order) {
         // Create shipping placeholder data mapping
         const shippingData = {
           order_id: order._id.toString(),
           order_date: new Date(order.createdAt).toISOString(),
           pickup_location: "Primary",
           billing_customer_name: order.shippingAddress?.firstName,
           billing_last_name: order.shippingAddress?.lastName,
           billing_address: order.shippingAddress?.address,
           billing_city: order.shippingAddress?.city,
           billing_pincode: order.shippingAddress?.pincode,
           billing_state: order.shippingAddress?.state,
           billing_email: order.shippingAddress?.email,
           billing_phone: order.shippingAddress?.phone,
           shipping_is_billing: true,
           order_items: order.items.map((i: any) => ({
             name: i.name,
             sku: i.sku,
             units: i.quantity,
             selling_price: i.price / 100
           })),
           payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
           sub_total: order.totalAmount / 100,
           length: 10, breadth: 10, height: 10, weight: 0.5 // defaults
         };
         
         const shipment = await shippingService.createShipment(shippingData);
         body.shippingDetails = {
           shipmentId: shipment.shipment_id,
           orderId: shipment.order_id,
           provider: 'shiprocket'
         };
      }
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(resolvedParams.id, body, { new: true });
    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
