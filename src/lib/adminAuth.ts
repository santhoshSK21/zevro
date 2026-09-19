import { auth } from '../auth';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'zevro-admin-session-secret-key-change-in-prod';

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
      // 2a. Try verifying as JWT
      try {
        const decoded = jwt.verify(token, ADMIN_SECRET) as any;
        if (decoded && (decoded.role === 'admin' || decoded.role === 'super-admin')) {
          return true;
        }
      } catch (jwtErr) {
        // Fallback to legacy HMAC verification
      }

      // 2b. Fallback HMAC check for backwards compatibility
      const expectedUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
      const expectedToken = crypto.createHmac('sha256', ADMIN_SECRET).update(expectedUser).digest('hex');
      if (token.length === expectedToken.length && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken))) {
        return true;
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
