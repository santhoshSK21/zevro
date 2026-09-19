import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import { Notification } from '../../../models/Notification';
import { auth } from '../../../auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Auto-delete notifications older than 30 days (cleanup)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    await Notification.deleteMany({ userId: session.user.id, createdAt: { $lt: thirtyDaysAgo } });

    const notifications = await Notification.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    if (body.action === 'markAllRead') {
      await Notification.updateMany({ userId: session.user.id, isRead: false }, { isRead: true });
      return NextResponse.json({ success: true });
    }
    
    if (body.id) {
      await Notification.findOneAndUpdate({ _id: body.id, userId: session.user.id }, { isRead: true });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
