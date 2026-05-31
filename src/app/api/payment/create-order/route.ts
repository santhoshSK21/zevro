import { NextResponse } from 'next/server';
import { paymentService } from '../../../../lib/razorpay';
import { auth } from '../../../../auth';

export async function POST(request: Request) {
  try {
    const session = await auth();
    // Allows guest checkout if no session, or can enforce auth
    
    const { amount, receipt } = await request.json();
    
    if (!amount || !receipt) {
      return NextResponse.json({ error: 'Missing amount or receipt ID' }, { status: 400 });
    }
    
    const order = await paymentService.createOrder(amount, receipt);
    
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 });
  }
}
