import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import { ResetToken } from '../../../../models/ResetToken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();
    
    if (!token || !newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'Invalid token or password too short' }, { status: 400 });
    }
    
    await dbConnect();
    
    // Hash the provided token to compare with DB
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // Find valid token
    const resetRecord = await ResetToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() } // Must not be expired
    });
    
    if (!resetRecord) {
      return NextResponse.json({ error: 'Token is invalid or has expired' }, { status: 400 });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user
    await User.findByIdAndUpdate(resetRecord.userId, { password: hashedPassword });
    
    // Invalidate ALL reset tokens for this user so they can't be reused
    await ResetToken.deleteMany({ userId: resetRecord.userId });
    
    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
