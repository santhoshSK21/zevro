import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import { ResetToken } from '../../../../models/ResetToken';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    await dbConnect();
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // To prevent email enumeration, we always return a success message 
    // even if the user doesn't exist.
    if (user) {
      // 1. Generate a secure random token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      
      // 2. Set expiry to 1 hour
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
      
      // 3. Save to database
      await ResetToken.create({
        userId: user._id,
        tokenHash,
        expiresAt
      });
      
      // 4. Send Email (Stubbed for now, waiting for SMTP config)
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      console.log(`[STUB] Password reset email would be sent to ${user.email}. Link: ${resetUrl}`);
      // In production: await sendEmail(user.email, 'Password Reset', htmlTemplate(resetUrl));
    }
    
    return NextResponse.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
