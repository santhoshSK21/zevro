import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/adminControl')) {
    if (pathname === '/adminControl/login') return NextResponse.next();

    const adminToken = request.cookies.get('adminControlSession');
    if (!adminToken) {
      return NextResponse.redirect(new URL('/adminControl/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/adminControl/:path*'],
};
