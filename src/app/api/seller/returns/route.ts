import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import { Seller } from '@/models/Seller';
import { ReturnRequest } from '@/models/ReturnRequest';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';

// 1. GET: Fetch all returns assigned to this seller
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const seller = await Seller.findOne({ userId: session.user.id }).lean();
    if (!seller) {
      return NextResponse.json({ error: 'Seller account not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status'); // 'REQUESTED' | 'PICKUP_SCHEDULED' | 'REFUNDED' etc.

    const query: any = {
      $or: [
        { sellerId: seller._id },
        { sellerStoreName: seller.storeName }
      ]
    };

    if (statusFilter && statusFilter !== 'ALL') {
      if (statusFilter === 'ACTION_REQUIRED') {
        query.status = 'REQUESTED';
      } else if (statusFilter === 'ACTIVE_PICKUP') {
        query.status = { $in: ['APPROVED', 'PICKUP_SCHEDULED', 'IN_TRANSIT'] };
      } else if (statusFilter === 'COMPLETED') {
        query.status = { $in: ['RECEIVED', 'REFUNDED', 'EXCHANGE_SHIPPED', 'COMPLETED'] };
      } else if (statusFilter === 'REJECTED') {
        query.status = 'REJECTED';
      } else {
        query.status = statusFilter;
      }
    }

    const returns = await ReturnRequest.find(query).sort({ createdAt: -1 }).lean();

    // Summary counts
    const allReturns = await ReturnRequest.find({
      $or: [
        { sellerId: seller._id },
        { sellerStoreName: seller.storeName }
      ]
    }).lean();

    const actionRequiredCount = allReturns.filter((r: any) => r.status === 'REQUESTED').length;
    const activePickupCount = allReturns.filter((r: any) => ['APPROVED', 'PICKUP_SCHEDULED', 'IN_TRANSIT'].includes(r.status)).length;
    const completedCount = allReturns.filter((r: any) => ['RECEIVED', 'REFUNDED', 'EXCHANGE_SHIPPED', 'COMPLETED'].includes(r.status)).length;
    const rejectedCount = allReturns.filter((r: any) => r.status === 'REJECTED').length;

    return NextResponse.json({
      returns,
      counts: {
        total: allReturns.length,
        actionRequired: actionRequiredCount,
        activePickup: activePickupCount,
        completed: completedCount,
        rejected: rejectedCount,
      },
    });
  } catch (error) {
    console.error('Fetch seller returns error:', error);
    return NextResponse.json({ error: 'Failed to fetch returns' }, { status: 500 });
  }
}

// 2. PATCH: Seller action (Approve, Reject, or Inspect & Restock inventory)
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const seller = await Seller.findOne({ userId: session.user.id }).lean();
    if (!seller) {
      return NextResponse.json({ error: 'Seller account not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      returnId,
      action, // 'APPROVE' | 'REJECT' | 'INSPECT_AND_RESTOCK' | 'COMPLETE_EXCHANGE'
      courierName = 'Delhivery Reverse Logistics',
      customAwb,
      rejectionReason,
    } = body;

    if (!returnId || !action) {
      return NextResponse.json({ error: 'Missing returnId or action' }, { status: 400 });
    }

    const returnReq = await ReturnRequest.findById(returnId);
    if (!returnReq) {
      return NextResponse.json({ error: 'Return request not found' }, { status: 404 });
    }

    // ACTION: APPROVE
    if (action === 'APPROVE') {
      const reverseAwb = customAwb || `REV-${Date.now().toString().slice(-6)}`;
      returnReq.status = 'PICKUP_SCHEDULED';
      returnReq.reverseCourier = {
        courierName,
        trackingNumber: reverseAwb,
        trackingUrl: `https://track.delhivery.com/p/${reverseAwb}`,
        scheduledPickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next-day doorstep pickup
      };

      // Add to Order timeline
      const order = await Order.findById(returnReq.orderId);
      if (order) {
        order.timeline.push({
          status: 'return-pickup-scheduled',
          message: `Reverse pickup approved by ${seller.storeName}. Doorstep collection assigned via ${courierName} (AWB: ${reverseAwb}).`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();
      return NextResponse.json({
        success: true,
        message: 'Return approved! Doorstep reverse pickup has been scheduled.',
        returnRequest: returnReq,
      });
    }

    // ACTION: REJECT
    if (action === 'REJECT') {
      if (!rejectionReason) {
        return NextResponse.json({ error: 'Please provide a reason for rejecting the return.' }, { status: 400 });
      }

      returnReq.status = 'REJECTED';
      returnReq.rejectionReason = rejectionReason;

      const order = await Order.findById(returnReq.orderId);
      if (order) {
        order.timeline.push({
          status: 'return-rejected',
          message: `Return request declined by ${seller.storeName}. Reason: ${rejectionReason}`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();
      return NextResponse.json({
        success: true,
        message: 'Return request rejected.',
        returnRequest: returnReq,
      });
    }

    // ACTION: INSPECT & RESTOCK (Automatic Inventory Stock Update)
    if (action === 'INSPECT_AND_RESTOCK') {
      returnReq.status = 'REFUNDED';
      returnReq.inventoryRestocked = true;
      returnReq.restockedAt = new Date();

      const refundTxn = `RFND-${Date.now().toString().slice(-8)}`;
      returnReq.refund = {
        amount: returnReq.item.price * returnReq.item.quantity,
        status: 'processed',
        transactionId: refundTxn,
        refundedAt: new Date(),
      };

      // PRIORITY REQUIREMENT: Automatically RESTOCK item inventory in MongoDB
      let restockSuccess = false;
      let newStockLevel = 0;

      if (returnReq.item.productId) {
        const product = await Product.findById(returnReq.item.productId);
        if (product && Array.isArray(product.variants) && product.variants.length > 0) {
          // Find matching variant or default to first variant
          let targetVariant = product.variants[0];
          if (returnReq.item.color) {
            const foundVariant = product.variants.find(
              (v: any) => v.colorName?.toLowerCase() === returnReq.item.color?.toLowerCase()
            );
            if (foundVariant) targetVariant = foundVariant;
          }

          if (targetVariant.sizes && Array.isArray(targetVariant.sizes)) {
            const targetSize = targetVariant.sizes.find(
              (s: any) => s.size === returnReq.item.size
            );

            if (targetSize) {
              targetSize.stock = (targetSize.stock || 0) + (returnReq.item.quantity || 1);
              newStockLevel = targetSize.stock;
            } else {
              targetVariant.sizes.push({
                size: returnReq.item.size || 'M',
                stock: returnReq.item.quantity || 1,
                sku: returnReq.item.sku,
              });
              newStockLevel = returnReq.item.quantity || 1;
            }

            await product.save();
            restockSuccess = true;
          }
        }
      }

      // Add to Order timeline
      const order = await Order.findById(returnReq.orderId);
      if (order) {
        order.timeline.push({
          status: 'returned-and-refunded',
          message: `Returned piece inspected and accepted by ${seller.storeName}. Inventory restocked (+${returnReq.item.quantity}) and ₹${(returnReq.refund.amount / 100).toLocaleString('en-IN')} refund initiated (Ref: ${refundTxn}).`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();
      return NextResponse.json({
        success: true,
        message: `Warehouse inspection complete! ${returnReq.item.name} (Size: ${returnReq.item.size}) has been restocked (+${returnReq.item.quantity} units, new stock: ${newStockLevel}) and buyer refund issued.`,
        restockSuccess,
        newStockLevel,
        returnRequest: returnReq,
      });
    }

    // ACTION: COMPLETE EXCHANGE
    if (action === 'COMPLETE_EXCHANGE') {
      returnReq.status = 'COMPLETED';

      const order = await Order.findById(returnReq.orderId);
      if (order) {
        order.timeline.push({
          status: 'exchange-completed',
          message: `Exchanged garment dispatched and delivered to customer by ${seller.storeName}.`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();
      return NextResponse.json({
        success: true,
        message: 'Exchange cycle completed.',
        returnRequest: returnReq,
      });
    }

    return NextResponse.json({ error: 'Invalid action provided' }, { status: 400 });
  } catch (error) {
    console.error('Seller returns action error:', error);
    return NextResponse.json({ error: 'Failed to process return action' }, { status: 500 });
  }
}
