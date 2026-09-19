import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import dbConnect from '../../../../lib/mongodb';
import { User } from '../../../../models/User';
import { assertAdminAccess } from '../../../../lib/adminAuth';

const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'zevro-admin-session-secret-key-change-in-prod';

// GET: Check current admin authentication status
export async function GET() {
  try {
    const isAuthed = await assertAdminAccess();
    return NextResponse.json({ authenticated: isAuthed });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}

// POST: Log in as admin
export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();
    const identifier = (email || username || '').trim().toLowerCase();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Email/Username and password are required' }, { status: 400 });
    }

    let isValid = false;
    let adminName = 'Admin';
    let adminRole = 'admin';

    // 1. Check environment variable credentials
    const expectedUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const expectedPass = process.env.ADMIN_PASSWORD || 'adminpassword';

    if ((identifier === expectedUser || identifier === 'admin@zevro.in') && password === expectedPass) {
      isValid = true;
      adminName = 'System Administrator';
    }

    // 2. If not matched with env, check MongoDB User collection
    if (!isValid) {
      try {
        await dbConnect();
        const user = await User.findOne({ 
          email: identifier, 
          role: { $in: ['admin', 'super-admin'] },
          isActive: true 
        }).select('+password +passwordHash');

        if (user) {
          const storedHash = user.passwordHash || user.password;
          if (storedHash) {
            isValid = await bcrypt.compare(password, storedHash);
            if (isValid) {
              adminName = user.name || 'Admin';
              adminRole = user.role;
            }
          }
        }
      } catch (dbErr) {
        console.error('Admin DB check error:', dbErr);
      }
    }

    if (isValid) {
      // Create signed JWT token
      const token = jwt.sign(
        { 
          user: identifier, 
          name: adminName, 
          role: adminRole 
        }, 
        ADMIN_SECRET, 
        { expiresIn: '7d' }
      );

      const cookieStore = await cookies();
      cookieStore.set({
        name: 'adminControlSession',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Admin authenticated successfully',
        admin: { name: adminName, role: adminRole }
      });
    }

    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}

// DELETE: Logout admin
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('adminControlSession');
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
