import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import { Seller } from '@/models/Seller';
import { ReturnRequest, ReturnCondition } from '@/models/ReturnRequest';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { InventoryTransaction } from '@/models/InventoryTransaction';
import { Notification } from '@/models/Notification';

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
    const statusFilter = searchParams.get('status');

    const query: any = {
      $or: [
        { sellerId: seller._id },
        { sellerStoreName: seller.storeName },
      ],
    };

    if (statusFilter && statusFilter !== 'ALL') {
      if (statusFilter === 'ACTION_REQUIRED') {
        query.status = 'REQUESTED';
      } else if (statusFilter === 'ACTIVE_PICKUP') {
        query.status = { $in: ['APPROVED', 'PICKUP_SCHEDULED', 'IN_TRANSIT'] };
      } else if (statusFilter === 'INSPECTION') {
        query.status = { $in: ['RECEIVED', 'INSPECTION_PENDING'] };
      } else if (statusFilter === 'COMPLETED') {
        query.status = { $in: ['REFUNDED', 'COMPLETED'] };
      } else if (statusFilter === 'REJECTED') {
        query.status = 'REJECTED';
      } else {
        query.status = statusFilter;
      }
    }

    const returns = await ReturnRequest.find(query).sort({ createdAt: -1 }).lean();

    const allReturns = await ReturnRequest.find({
      $or: [
        { sellerId: seller._id },
        { sellerStoreName: seller.storeName },
      ],
    }).lean();

    const counts = {
      total: allReturns.length,
      actionRequired: allReturns.filter((r: any) => r.status === 'REQUESTED').length,
      activePickup: allReturns.filter((r: any) => ['APPROVED', 'PICKUP_SCHEDULED', 'IN_TRANSIT'].includes(r.status)).length,
      inspectionPending: allReturns.filter((r: any) => ['RECEIVED', 'INSPECTION_PENDING'].includes(r.status)).length,
      refundPending: allReturns.filter((r: any) => r.status === 'REFUND_PENDING').length,
      replacementProcessing: allReturns.filter((r: any) => r.status === 'REPLACEMENT_PROCESSING').length,
      completed: allReturns.filter((r: any) => ['REFUNDED', 'COMPLETED'].includes(r.status)).length,
      rejected: allReturns.filter((r: any) => r.status === 'REJECTED').length,
    };

    return NextResponse.json({
      returns,
      counts,
    });
  } catch (error) {
    console.error('Fetch seller returns error:', error);
    return NextResponse.json({ error: 'Failed to fetch returns' }, { status: 500 });
  }
}

// 2. PATCH: Seller action (Approve, Reject, Mark Received, Inspect, Restock, Refund, Exchange)
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
      action,
      courierName = 'Delhivery Reverse Logistics',
      customAwb,
      scheduledDate,
      rejectionReason,
      condition, // 'SELLABLE' | 'DAMAGED' | 'DEFECTIVE' | 'QUARANTINE'
      inspectionNotes,
      refundAmount,
      refundMethod = 'original_source',
      replacementCourier,
      replacementAwb,
    } = body;

    if (!returnId || !action) {
      return NextResponse.json({ error: 'Missing returnId or action' }, { status: 400 });
    }

    const returnReq = await ReturnRequest.findById(returnId);
    if (!returnReq) {
      return NextResponse.json({ error: 'Return request not found' }, { status: 404 });
    }

    const order = await Order.findById(returnReq.orderId);

    // ACTION: APPROVE
    if (action === 'APPROVE') {
      const reverseAwb = customAwb || `REV-${Date.now().toString().slice(-6)}`;
      const pickupDate = scheduledDate ? new Date(scheduledDate) : new Date(Date.now() + 24 * 60 * 60 * 1000);

      returnReq.status = 'PICKUP_SCHEDULED';
      returnReq.reverseCourier = {
        courierName,
        trackingNumber: reverseAwb,
        trackingUrl: `https://track.delhivery.com/p/${reverseAwb}`,
        scheduledPickupDate: pickupDate,
      };

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: 'PICKUP_SCHEDULED',
        action: 'APPROVED',
        performedBy: seller.storeName,
        notes: `Doorstep reverse pickup scheduled via ${courierName} (AWB: ${reverseAwb}).`,
        timestamp: new Date(),
      });

      if (order) {
        order.timeline.push({
          status: 'return-pickup-scheduled',
          message: `Reverse pickup approved by ${seller.storeName}. Doorstep collection assigned via ${courierName} (AWB: ${reverseAwb}).`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();

      if (returnReq.userId) {
        try {
          await Notification.create({
            userId: returnReq.userId,
            type: 'RETURN_APPROVED',
            title: 'Return Request Approved',
            message: `Your return request for ${returnReq.item.name} has been approved by ${seller.storeName}. Reverse pickup assigned via ${courierName} (AWB: ${reverseAwb}).`,
            link: `/account/orders/${returnReq.orderId}`,
          });
        } catch (e) {}
      }

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

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: 'REJECTED',
        action: 'REJECTED',
        performedBy: seller.storeName,
        notes: `Return declined. Reason: ${rejectionReason}`,
        timestamp: new Date(),
      });

      if (order) {
        order.timeline.push({
          status: 'return-rejected',
          message: `Return request declined by ${seller.storeName}. Reason: ${rejectionReason}`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();

      if (returnReq.userId) {
        try {
          await Notification.create({
            userId: returnReq.userId,
            type: 'RETURN_REJECTED',
            title: 'Return Request Declined',
            message: `Your return request for ${returnReq.item.name} could not be approved. Reason: ${rejectionReason}`,
            link: `/account/orders/${returnReq.orderId}`,
          });
        } catch (e) {}
      }

      return NextResponse.json({
        success: true,
        message: 'Return request rejected.',
        returnRequest: returnReq,
      });
    }

    // ACTION: MARK RECEIVED AT FACILITY
    if (action === 'MARK_RECEIVED') {
      returnReq.status = 'INSPECTION_PENDING';
      if (!returnReq.reverseCourier) returnReq.reverseCourier = {};
      returnReq.reverseCourier.receivedDate = new Date();

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: 'INSPECTION_PENDING',
        action: 'RECEIVED_AT_FACILITY',
        performedBy: seller.storeName,
        notes: `Returned item received at seller depot. Under inspection.`,
        timestamp: new Date(),
      });

      if (order) {
        order.timeline.push({
          status: 'return-received',
          message: `Returned package received at ${seller.storeName} facility. Quality inspection initiated.`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();
      return NextResponse.json({
        success: true,
        message: 'Item marked as received. Status updated to INSPECTION_PENDING.',
        returnRequest: returnReq,
      });
    }

    // ACTION: INSPECT & CLASSIFY INVENTORY
    if (action === 'INSPECT' || action === 'INSPECT_AND_RESTOCK') {
      const resolvedCondition = (condition || 'SELLABLE') as ReturnCondition;
      let inventoryAction: 'RESTOCKED_TO_SELLABLE' | 'SCRAPPED_DAMAGED' | 'HELD_IN_QUARANTINE' | 'NONE' = 'NONE';
      let restockSuccess = false;
      let newStockLevel = 0;

      // 1. SELLABLE: Restock inventory & record transaction
      if (resolvedCondition === 'SELLABLE') {
        inventoryAction = 'RESTOCKED_TO_SELLABLE';

        if (!returnReq.inventoryRestocked && returnReq.item.productId) {
          const product = await Product.findById(returnReq.item.productId);
          if (product && Array.isArray(product.variants) && product.variants.length > 0) {
            let targetVariant = product.variants[0];
            if (returnReq.item.color) {
              const foundVariant = product.variants.find(
                (v: any) => v.colorName?.toLowerCase() === returnReq.item.color?.toLowerCase()
              );
              if (foundVariant) targetVariant = foundVariant;
            }

            if (targetVariant.sizes && Array.isArray(targetVariant.sizes)) {
              const targetSize = targetVariant.sizes.find(
                (s: any) => s.size?.toUpperCase() === returnReq.item.size?.toUpperCase()
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
              returnReq.inventoryRestocked = true;
              returnReq.restockedAt = new Date();

              await InventoryTransaction.create({
                productId: product._id,
                variantId: targetVariant._id ? targetVariant._id.toString() : targetVariant.colorName || 'default',
                size: returnReq.item.size || 'M',
                sku: returnReq.item.sku,
                quantityChange: returnReq.item.quantity || 1,
                type: 'STOCK_RETURNED',
                reason: `Seller return inspection approved (Sellable condition). Return Ref #${returnReq._id}`,
                referenceType: 'Return',
                referenceId: returnReq._id.toString(),
              });
            }
          }
        }
      } 
      // 2. DAMAGED / DEFECTIVE: Unsellable
      else if (resolvedCondition === 'DAMAGED' || resolvedCondition === 'DEFECTIVE') {
        inventoryAction = 'SCRAPPED_DAMAGED';
        returnReq.inventoryRestocked = false;

        await InventoryTransaction.create({
          productId: returnReq.item.productId,
          variantId: returnReq.item.color || 'damaged-salvage',
          size: returnReq.item.size || 'N/A',
          sku: returnReq.item.sku,
          quantityChange: 0,
          type: 'STOCK_DAMAGED',
          reason: `Seller return inspection: ${resolvedCondition}. Non-sellable salvage. Return Ref #${returnReq._id}`,
          referenceType: 'Return',
          referenceId: returnReq._id.toString(),
        });
      }
      // 3. QUARANTINE
      else if (resolvedCondition === 'QUARANTINE') {
        inventoryAction = 'HELD_IN_QUARANTINE';
        returnReq.inventoryRestocked = false;

        await InventoryTransaction.create({
          productId: returnReq.item.productId,
          variantId: returnReq.item.color || 'quarantine-bay',
          size: returnReq.item.size || 'N/A',
          sku: returnReq.item.sku,
          quantityChange: 0,
          type: 'STOCK_ADJUSTMENT',
          reason: `Seller return inspection: HELD IN QUARANTINE. Return Ref #${returnReq._id}`,
          referenceType: 'Return',
          referenceId: returnReq._id.toString(),
        });
      }

      returnReq.inspection = {
        condition: resolvedCondition,
        inspectedBy: seller.storeName,
        inspectedAt: new Date(),
        notes: inspectionNotes || `Quality condition verified as ${resolvedCondition}.`,
        inventoryAction,
      };

      const isReplacement = returnReq.resolutionType === 'REPLACEMENT' || returnReq.type === 'EXCHANGE';
      returnReq.status = isReplacement ? 'REPLACEMENT_PROCESSING' : 'REFUND_PENDING';

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: returnReq.status,
        action: 'INSPECTION_RECORDED',
        performedBy: seller.storeName,
        notes: `Condition: ${resolvedCondition}. Inventory: ${inventoryAction}. Next: ${returnReq.status}. Notes: ${inspectionNotes || 'None'}`,
        timestamp: new Date(),
      });

      if (order) {
        order.timeline.push({
          status: 'return-inspected',
          message: `Item inspection completed by ${seller.storeName}: ${resolvedCondition}. Next stage: ${isReplacement ? 'replacement' : 'refund'}.`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();

      return NextResponse.json({
        success: true,
        message: `Inspection recorded. Condition: ${resolvedCondition}. Sellable restocked: ${restockSuccess ? `YES (+${returnReq.item.quantity})` : 'NO'}. Status: ${returnReq.status}.`,
        restockSuccess,
        newStockLevel,
        returnRequest: returnReq,
      });
    }

    // ACTION: PROCESS REFUND
    if (action === 'PROCESS_REFUND') {
      const refundPaise = refundAmount !== undefined ? Number(refundAmount) : (returnReq.item.price * returnReq.item.quantity);
      const refundTxn = `RFND-${Date.now().toString().slice(-8)}`;

      returnReq.status = 'REFUNDED';
      returnReq.refund = {
        amount: refundPaise,
        status: 'processed',
        method: refundMethod,
        transactionId: refundTxn,
        refundedAt: new Date(),
      };

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: 'REFUNDED',
        action: 'REFUND_ISSUED',
        performedBy: seller.storeName,
        notes: `Refund of ₹${(refundPaise / 100).toLocaleString('en-IN')} approved via ${refundMethod}. Ref: ${refundTxn}`,
        timestamp: new Date(),
      });

      if (order) {
        order.timeline.push({
          status: 'returned-and-refunded',
          message: `Refund of ₹${(refundPaise / 100).toLocaleString('en-IN')} issued by ${seller.storeName} (Ref: ${refundTxn}).`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();

      if (returnReq.userId) {
        try {
          await Notification.create({
            userId: returnReq.userId,
            type: 'REFUND_PROCESSED',
            title: 'Refund Successfully Disbursed',
            message: `Your refund of ₹${(refundPaise / 100).toLocaleString('en-IN')} for ${returnReq.item.name} has been processed (Ref: ${refundTxn}).`,
            link: `/account/orders/${returnReq.orderId}`,
          });
        } catch (e) {}
      }

      return NextResponse.json({
        success: true,
        message: `Refund processed (₹${(refundPaise / 100).toLocaleString('en-IN')}).`,
        returnRequest: returnReq,
      });
    }

    // ACTION: DISPATCH REPLACEMENT
    if (action === 'DISPATCH_REPLACEMENT') {
      const awb = replacementAwb || `RPL-${Date.now().toString().slice(-6)}`;
      const courier = replacementCourier || 'Delhivery Express';

      returnReq.status = 'REPLACEMENT_PROCESSING';
      returnReq.replacement = {
        ...returnReq.replacement,
        courierName: courier,
        trackingNumber: awb,
        status: 'DISPATCHED',
        dispatchedAt: new Date(),
      };

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: 'REPLACEMENT_PROCESSING',
        action: 'REPLACEMENT_DISPATCHED',
        performedBy: seller.storeName,
        notes: `Replacement piece dispatched via ${courier} (AWB: ${awb}).`,
        timestamp: new Date(),
      });

      if (order) {
        order.timeline.push({
          status: 'replacement-dispatched',
          message: `Replacement garment dispatched via ${courier} (AWB: ${awb}) by ${seller.storeName}.`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();

      if (returnReq.userId) {
        try {
          await Notification.create({
            userId: returnReq.userId,
            type: 'REPLACEMENT_DISPATCHED',
            title: 'Replacement Dispatched',
            message: `Your replacement for ${returnReq.item.name} has been dispatched via ${courier} (AWB: ${awb}).`,
            link: `/account/orders/${returnReq.orderId}`,
          });
        } catch (e) {}
      }

      return NextResponse.json({
        success: true,
        message: `Replacement dispatched via ${courier} (AWB: ${awb}).`,
        returnRequest: returnReq,
      });
    }

    // ACTION: COMPLETE
    if (action === 'COMPLETE_EXCHANGE' || action === 'COMPLETE') {
      returnReq.status = 'COMPLETED';
      if (returnReq.replacement) {
        returnReq.replacement.status = 'DELIVERED';
        returnReq.replacement.deliveredAt = new Date();
      }

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: 'COMPLETED',
        action: 'CYCLE_COMPLETED',
        performedBy: seller.storeName,
        notes: `Exchange/return cycle completed.`,
        timestamp: new Date(),
      });

      if (order) {
        order.timeline.push({
          status: 'exchange-completed',
          message: `Exchange garment confirmed delivered by ${seller.storeName}.`,
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
