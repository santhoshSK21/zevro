import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Seller from '@/models/Seller';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await req.json();

    const { status, rejectionReason, commissionRate, isSingleClient } = body;

    const seller = await Seller.findById(id);
    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    if (status) {
      seller.status = status;
      if (status === 'APPROVED') {
        seller.approvedAt = new Date();
        seller.rejectionReason = undefined;
      } else if (status === 'REJECTED' && rejectionReason) {
        seller.rejectionReason = rejectionReason;
      }
    }

    if (commissionRate !== undefined) {
      seller.commissionRate = Number(commissionRate);
    }

    if (isSingleClient !== undefined) {
      seller.isSingleClient = Boolean(isSingleClient);
    }

    await seller.save();

    return NextResponse.json({
      success: true,
      message: `Seller status updated to ${seller.status}`,
      seller,
    });
  } catch (err: any) {
    console.error('Error updating seller status:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
