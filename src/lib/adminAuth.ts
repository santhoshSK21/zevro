import { auth } from '../auth';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function assertAdminAccess(): Promise<boolean> {
  try {
    // 1. Check NextAuth session
    const session = await auth();
    if (session?.user?.role === 'admin' || session?.user?.role === 'super-admin') {
      return true;
    }

    // 2. Check adminControl cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('adminControlSession')?.value;
    
    if (token) {
      const expectedUser = process.env.ADMIN_USERNAME || 'admin';
      const secret = process.env.ADMIN_SESSION_SECRET || 'secret';
      const expectedToken = crypto.createHmac('sha256', secret).update(expectedUser).digest('hex');
      
      // Use timingSafeEqual to prevent timing attacks
      if (token.length === expectedToken.length) {
        const isValid = crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken));
        if (isValid) return true;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

export async function assertSuperAdminAccess(): Promise<boolean> {
  try {
    const session = await auth();
    if (session?.user?.role === 'super-admin') {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export async function assertOwnership(resourceUserId: string): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user?.id) return false;
    
    // Admins can access anything
    if (await assertAdminAccess()) return true;
    
    // Users can access their own
    return session.user.id === resourceUserId;
  } catch (error) {
    return false;
  }
}

