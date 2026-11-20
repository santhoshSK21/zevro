import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { assertAdminAccess } from '@/lib/adminAuth';
import { ReturnRequest, ReturnStatus, ReturnCondition } from '@/models/ReturnRequest';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { Seller } from '@/models/Seller';
import { InventoryTransaction } from '@/models/InventoryTransaction';
import { Notification } from '@/models/Notification';

// 1. GET: Fetch return requests with rich filtering, search, pagination, and KPI counts
export async function GET(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sellerId = searchParams.get('sellerId');
    const reason = searchParams.get('reason');
    const dateRange = searchParams.get('dateRange'); // 'today' | '7days' | '30days' | 'all'
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const query: any = {};

    // Status filter
    if (status && status !== 'ALL') {
      if (status === 'ACTION_REQUIRED') {
        query.status = 'REQUESTED';
      } else if (status === 'IN_PROGRESS') {
        query.status = { $in: ['APPROVED', 'PICKUP_SCHEDULED', 'IN_TRANSIT', 'RECEIVED', 'INSPECTION_PENDING', 'REFUND_PENDING', 'REPLACEMENT_PROCESSING'] };
      } else {
        query.status = status;
      }
    }

    // Seller filter
    if (sellerId && sellerId !== 'ALL') {
      query.sellerId = sellerId;
    }

    // Reason filter
    if (reason && reason !== 'ALL') {
      query.reason = { $regex: new RegExp(reason, 'i') };
    }

    // Date Range filter
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let fromDate = new Date();
      if (dateRange === 'today') {
        fromDate.setHours(0, 0, 0, 0);
      } else if (dateRange === '7days') {
        fromDate.setDate(now.getDate() - 7);
      } else if (dateRange === '30days') {
        fromDate.setDate(now.getDate() - 30);
      }
      query.createdAt = { $gte: fromDate };
    }

    // Search query (order number, user email, user name, item name, SKU, tracking number)
    if (search && search.trim()) {
      const s = search.trim();
      const regex = new RegExp(s, 'i');
      query.$or = [
        { orderNumber: regex },
        { userEmail: regex },
        { userName: regex },
        { 'item.name': regex },
        { 'item.sku': regex },
        { 'reverseCourier.trackingNumber': regex },
      ];
    }

    const [returns, totalCount] = await Promise.all([
      ReturnRequest.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ReturnRequest.countDocuments(query),
    ]);

    // Aggregate summary metrics
    const allReturns = await ReturnRequest.find({}).lean();
    const counts = {
      total: allReturns.length,
      requested: allReturns.filter((r: any) => r.status === 'REQUESTED').length,
      approved: allReturns.filter((r: any) => r.status === 'APPROVED').length,
      pickupScheduled: allReturns.filter((r: any) => r.status === 'PICKUP_SCHEDULED').length,
      inTransit: allReturns.filter((r: any) => r.status === 'IN_TRANSIT').length,
      received: allReturns.filter((r: any) => r.status === 'RECEIVED').length,
      inspectionPending: allReturns.filter((r: any) => r.status === 'INSPECTION_PENDING').length,
      refundPending: allReturns.filter((r: any) => r.status === 'REFUND_PENDING').length,
      refunded: allReturns.filter((r: any) => r.status === 'REFUNDED').length,
      replacementProcessing: allReturns.filter((r: any) => r.status === 'REPLACEMENT_PROCESSING').length,
      completed: allReturns.filter((r: any) => r.status === 'COMPLETED').length,
      rejected: allReturns.filter((r: any) => r.status === 'REJECTED').length,
    };

    // Extract unique reasons and sellers for filters
    const reasons = Array.from(new Set(allReturns.map((r: any) => r.reason).filter(Boolean)));
    const sellers = await Seller.find({}).select('storeName _id').lean();

    return NextResponse.json({
      returns,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      counts,
      filterOptions: {
        reasons,
        sellers,
      },
    });
  } catch (error) {
    console.error('Fetch admin returns error:', error);
    return NextResponse.json({ error: 'Failed to fetch return requests' }, { status: 500 });
  }
}

// 2. PATCH: Execute return lifecycle workflows
export async function PATCH(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const {
      returnId,
      action,
      rejectionReason,
      courierName = 'Delhivery Reverse Logistics',
      trackingNumber,
      trackingUrl,
      scheduledPickupDate,
      condition, // 'SELLABLE' | 'DAMAGED' | 'DEFECTIVE' | 'QUARANTINE'
      inspectionNotes,
      inspectorName = 'Senior Atelier Quality Inspector',
      refundAmount,
      refundMethod = 'original_source',
      refundTxnId,
      replacementCourier,
      replacementAwb,
      replacementTrackingUrl,
    } = body;

    if (!returnId || !action) {
      return NextResponse.json({ error: 'Missing returnId or action' }, { status: 400 });
    }

    const returnReq = await ReturnRequest.findById(returnId);
    if (!returnReq) {
      return NextResponse.json({ error: 'Return request not found' }, { status: 404 });
    }

    const order = await Order.findById(returnReq.orderId);

    // ==========================================
    // ACTION 1: APPROVE
    // ==========================================
    if (action === 'APPROVE') {
      const generatedAwb = trackingNumber || `REV-${Date.now().toString().slice(-6)}`;
      const pickupDate = scheduledPickupDate ? new Date(scheduledPickupDate) : new Date(Date.now() + 24 * 60 * 60 * 1000);

      returnReq.status = 'PICKUP_SCHEDULED';
      returnReq.reverseCourier = {
        courierName,
        trackingNumber: generatedAwb,
        trackingUrl: trackingUrl || `https://track.delhivery.com/p/${generatedAwb}`,
        scheduledPickupDate: pickupDate,
      };

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: 'PICKUP_SCHEDULED',
        action: 'APPROVED_AND_SCHEDULED',
        performedBy: 'Admin Quality Team',
        notes: `Return request approved. Doorstep pickup arranged via ${courierName} (AWB: ${generatedAwb}) on ${pickupDate.toLocaleDateString('en-IN')}`,
        timestamp: new Date(),
      });

      if (order) {
        order.timeline.push({
          status: 'return-approved',
          message: `Return request approved by ZEVRO Atelier. Doorstep pickup scheduled via ${courierName} (AWB: ${generatedAwb}).`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();

      // Notify customer
      if (returnReq.userId) {
        try {
          await Notification.create({
            userId: returnReq.userId,
            type: 'RETURN_APPROVED',
            title: 'Return Request Approved',
            message: `Your return request for ${returnReq.item.name} has been approved. Doorstep pickup scheduled via ${courierName} (AWB: ${generatedAwb}).`,
            link: `/account/orders/${returnReq.orderId}`,
          });
        } catch (e) {}
      }

      return NextResponse.json({
        success: true,
        message: `Return request approved. Pickup scheduled with ${courierName} (AWB: ${generatedAwb}).`,
        returnRequest: returnReq,
      });
    }

    // ==========================================
    // ACTION 2: REJECT
    // ==========================================
    if (action === 'REJECT') {
      if (!rejectionReason || !rejectionReason.trim()) {
        return NextResponse.json({ error: 'Please provide a clear reason for rejecting the return.' }, { status: 400 });
      }

      returnReq.status = 'REJECTED';
      returnReq.rejectionReason = rejectionReason.trim();

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: 'REJECTED',
        action: 'REJECTED',
        performedBy: 'Admin Quality Team',
        notes: `Return request declined. Reason: ${rejectionReason}`,
        timestamp: new Date(),
      });

      if (order) {
        order.timeline.push({
          status: 'return-rejected',
          message: `Return request declined by ZEVRO Atelier. Reason: ${rejectionReason}`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();

      // Notify customer
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

    // ==========================================
    // ACTION 3: UPDATE PICKUP / IN TRANSIT
    // ==========================================
    if (action === 'MARK_IN_TRANSIT') {
      returnReq.status = 'IN_TRANSIT';
      if (!returnReq.reverseCourier) {
        returnReq.reverseCourier = {
          courierName,
          trackingNumber: trackingNumber || `REV-${Date.now().toString().slice(-6)}`,
        };
      }
      returnReq.reverseCourier.actualPickupDate = new Date();

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: 'IN_TRANSIT',
        action: 'PICKUP_COMPLETED',
        performedBy: 'Logistics Partner',
        notes: `Item collected from customer doorstep and in transit to warehouse.`,
        timestamp: new Date(),
      });

      if (order) {
        order.timeline.push({
          status: 'return-in-transit',
          message: `Returned piece picked up by ${returnReq.reverseCourier?.courierName || 'carrier'} and in transit to atelier.`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();
      return NextResponse.json({
        success: true,
        message: 'Return marked as IN_TRANSIT.',
        returnRequest: returnReq,
      });
    }

    // ==========================================
    // ACTION 4: CONFIRM PRODUCT RECEIPT AT FACILITY
    // ==========================================
    if (action === 'MARK_RECEIVED') {
      returnReq.status = 'INSPECTION_PENDING';
      if (!returnReq.reverseCourier) {
        returnReq.reverseCourier = {};
      }
      returnReq.reverseCourier.receivedDate = new Date();

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: 'INSPECTION_PENDING',
        action: 'WAREHOUSE_RECEIVED',
        performedBy: 'Inbound Logistics Depot',
        notes: `Returned package received at fulfillment warehouse. Sent to quality inspection queue.`,
        timestamp: new Date(),
      });

      if (order) {
        order.timeline.push({
          status: 'return-received',
          message: `Returned shipment safely received at ZEVRO central warehouse. Quality inspection initiated.`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();
      return NextResponse.json({
        success: true,
        message: 'Returned shipment received at warehouse. Status updated to INSPECTION_PENDING.',
        returnRequest: returnReq,
      });
    }

    // ==========================================
    // ACTION 5: INSPECT RETURNED PRODUCT & CLASSIFY INVENTORY
    // STRICT INVENTORY RULE:
    // Stock is only increased if condition === 'SELLABLE'.
    // Damaged/Defective/Quarantine must NEVER increase sellable stock.
    // ==========================================
    if (action === 'INSPECT') {
      const validConditions: ReturnCondition[] = ['SELLABLE', 'DAMAGED', 'DEFECTIVE', 'QUARANTINE'];
      if (!condition || !validConditions.includes(condition as ReturnCondition)) {
        return NextResponse.json({
          error: 'Invalid inspection condition. Must be SELLABLE, DAMAGED, DEFECTIVE, or QUARANTINE.',
        }, { status: 400 });
      }

      let inventoryAction: 'RESTOCKED_TO_SELLABLE' | 'SCRAPPED_DAMAGED' | 'HELD_IN_QUARANTINE' | 'NONE' = 'NONE';
      let restockSuccess = false;
      let newStockLevel = 0;

      // 1. SELLABLE: Restore inventory stock and log InventoryTransaction
      if (condition === 'SELLABLE') {
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

              // Write Audit InventoryTransaction
              await InventoryTransaction.create({
                productId: product._id,
                variantId: targetVariant._id ? targetVariant._id.toString() : targetVariant.colorName || 'default',
                size: returnReq.item.size || 'M',
                sku: returnReq.item.sku,
                quantityChange: returnReq.item.quantity || 1,
                type: 'STOCK_RETURNED',
                reason: `Return inspection approved (Sellable condition). Return Ref #${returnReq._id}`,
                referenceType: 'Return',
                referenceId: returnReq._id.toString(),
              });
            }
          }
        }
      } 
      // 2. DAMAGED or DEFECTIVE: Do NOT increase sellable stock. Log scrap transaction
      else if (condition === 'DAMAGED' || condition === 'DEFECTIVE') {
        inventoryAction = 'SCRAPPED_DAMAGED';
        returnReq.inventoryRestocked = false;

        await InventoryTransaction.create({
          productId: returnReq.item.productId,
          variantId: returnReq.item.color || 'damaged-salvage',
          size: returnReq.item.size || 'N/A',
          sku: returnReq.item.sku,
          quantityChange: 0,
          type: 'STOCK_DAMAGED',
          reason: `Return inspection: ${condition} condition. Marked as unsellable scrap. Return Ref #${returnReq._id}`,
          referenceType: 'Return',
          referenceId: returnReq._id.toString(),
        });
      } 
      // 3. QUARANTINE: Do NOT increase sellable stock. Log quarantine hold
      else if (condition === 'QUARANTINE') {
        inventoryAction = 'HELD_IN_QUARANTINE';
        returnReq.inventoryRestocked = false;

        await InventoryTransaction.create({
          productId: returnReq.item.productId,
          variantId: returnReq.item.color || 'quarantine-bay',
          size: returnReq.item.size || 'N/A',
          sku: returnReq.item.sku,
          quantityChange: 0,
          type: 'STOCK_ADJUSTMENT',
          reason: `Return inspection: HELD IN QUARANTINE. Requires specialized refurbishment or deep cleaning. Return Ref #${returnReq._id}`,
          referenceType: 'Return',
          referenceId: returnReq._id.toString(),
        });
      }

      // Record inspection data
      returnReq.inspection = {
        condition: condition as ReturnCondition,
        inspectedBy: inspectorName,
        inspectedAt: new Date(),
        notes: inspectionNotes || `Quality inspection complete. Item classified as ${condition}.`,
        inventoryAction,
      };

      // Set next status based on resolution type
      const isReplacement = returnReq.resolutionType === 'REPLACEMENT' || returnReq.type === 'EXCHANGE';
      returnReq.status = isReplacement ? 'REPLACEMENT_PROCESSING' : 'REFUND_PENDING';

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: returnReq.status,
        action: 'INSPECTED',
        performedBy: inspectorName,
        notes: `Quality condition: ${condition}. Inventory action: ${inventoryAction}. Next stage: ${returnReq.status}. Notes: ${inspectionNotes || 'None'}`,
        timestamp: new Date(),
      });

      if (order) {
        order.timeline.push({
          status: 'return-inspected',
          message: `Quality assessment concluded: condition verified as ${condition}. Proceeding to ${isReplacement ? 'replacement fulfillment' : 'refund disbursement'}.`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();

      return NextResponse.json({
        success: true,
        message: `Inspection recorded. Condition: ${condition}. Stock updated: ${restockSuccess ? `YES (+${returnReq.item.quantity}, new level: ${newStockLevel})` : 'NO (Non-sellable)'}. Status advanced to ${returnReq.status}.`,
        restockSuccess,
        newStockLevel,
        returnRequest: returnReq,
      });
    }

    // ==========================================
    // ACTION 6: PROCESS REFUND
    // ==========================================
    if (action === 'PROCESS_REFUND') {
      const calculatedRefundPaise = refundAmount !== undefined ? Number(refundAmount) : (returnReq.item.price * returnReq.item.quantity);
      const txnRef = refundTxnId || `RFND-${Date.now().toString().slice(-8)}`;

      returnReq.status = 'REFUNDED';
      returnReq.refund = {
        amount: calculatedRefundPaise,
        status: 'processed',
        method: refundMethod,
        transactionId: txnRef,
        refundedAt: new Date(),
      };

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: 'REFUNDED',
        action: 'REFUND_DISBURSED',
        performedBy: 'Finance / Accounts Desk',
        notes: `Refund of ₹${(calculatedRefundPaise / 100).toLocaleString('en-IN')} disbursed via ${refundMethod}. Ref: ${txnRef}`,
        timestamp: new Date(),
      });

      if (order) {
        order.payment = order.payment || {};
        order.timeline.push({
          status: 'refunded',
          message: `Refund of ₹${(calculatedRefundPaise / 100).toLocaleString('en-IN')} successfully disbursed to customer (Ref: ${txnRef}, Method: ${refundMethod}).`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();

      // Notify customer
      if (returnReq.userId) {
        try {
          await Notification.create({
            userId: returnReq.userId,
            type: 'REFUND_PROCESSED',
            title: 'Refund Successfully Disbursed',
            message: `Your refund of ₹${(calculatedRefundPaise / 100).toLocaleString('en-IN')} for ${returnReq.item.name} has been processed (Ref: ${txnRef}).`,
            link: `/account/orders/${returnReq.orderId}`,
          });
        } catch (e) {}
      }

      return NextResponse.json({
        success: true,
        message: `Refund of ₹${(calculatedRefundPaise / 100).toLocaleString('en-IN')} processed successfully (Ref: ${txnRef}).`,
        returnRequest: returnReq,
      });
    }

    // ==========================================
    // ACTION 7: DISPATCH REPLACEMENT
    // ==========================================
    if (action === 'DISPATCH_REPLACEMENT') {
      const awb = replacementAwb || `RPL-${Date.now().toString().slice(-6)}`;
      const courier = replacementCourier || 'BlueDart Express';

      returnReq.status = 'REPLACEMENT_PROCESSING';
      returnReq.replacement = {
        ...returnReq.replacement,
        courierName: courier,
        trackingNumber: awb,
        trackingUrl: replacementTrackingUrl || `https://track.bluedart.com/track/${awb}`,
        status: 'DISPATCHED',
        dispatchedAt: new Date(),
      };

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: 'REPLACEMENT_PROCESSING',
        action: 'REPLACEMENT_DISPATCHED',
        performedBy: 'Fulfillment Logistics',
        notes: `Replacement piece dispatched via ${courier} (AWB: ${awb}).`,
        timestamp: new Date(),
      });

      if (order) {
        order.timeline.push({
          status: 'replacement-dispatched',
          message: `Replacement garment dispatched via ${courier} (AWB: ${awb}).`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();

      // Notify customer
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

    // ==========================================
    // ACTION 8: COMPLETE CYCLE
    // ==========================================
    if (action === 'COMPLETE') {
      returnReq.status = 'COMPLETED';
      if (returnReq.replacement) {
        returnReq.replacement.status = 'DELIVERED';
        returnReq.replacement.deliveredAt = new Date();
      }

      returnReq.auditLog = returnReq.auditLog || [];
      returnReq.auditLog.push({
        status: 'COMPLETED',
        action: 'CYCLE_COMPLETED',
        performedBy: 'Admin Management',
        notes: `Return & resolution lifecycle completed successfully.`,
        timestamp: new Date(),
      });

      if (order) {
        order.timeline.push({
          status: 'return-completed',
          message: `Return & resolution process fully completed.`,
          timestamp: new Date(),
        } as any);
        await order.save();
      }

      await returnReq.save();

      return NextResponse.json({
        success: true,
        message: 'Return cycle marked as COMPLETED.',
        returnRequest: returnReq,
      });
    }

    return NextResponse.json({ error: 'Unrecognized action provided' }, { status: 400 });
  } catch (error) {
    console.error('Admin returns action error:', error);
    return NextResponse.json({ error: 'Failed to process return action' }, { status: 500 });
  }
}

