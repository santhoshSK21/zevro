import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD || 'password';

    // Prevent timing attacks
    const uMatch = crypto.timingSafeEqual(Buffer.from(username.padEnd(64)), Buffer.from(expectedUser.padEnd(64)));
    const pMatch = crypto.timingSafeEqual(Buffer.from(password.padEnd(64)), Buffer.from(expectedPass.padEnd(64)));

    if (uMatch && pMatch) {
      const secret = process.env.ADMIN_SESSION_SECRET || 'secret';
      const token = crypto.createHmac('sha256', secret).update(username).digest('hex');
      
      const cookieStore = await cookies();
      cookieStore.set({
        name: 'adminControlSession',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 // 1 day
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
