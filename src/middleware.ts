import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static assets, images, api routes, next internals, and Admin/Superadmin management portals
  if (
    pathname === '/' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/superadmin') ||
    pathname.startsWith('/adminControl') ||
    pathname.includes('.')
  ) {
    // Admin Control legacy protection
    if (pathname.startsWith('/adminControl')) {
      if (pathname === '/adminControl/login') return NextResponse.next();
      const adminToken = request.cookies.get('adminControlSession');
      if (!adminToken) {
        return NextResponse.redirect(new URL('/adminControl/login', request.url));
      }
    }
    return NextResponse.next();
  }

  // Check if navigation is initiated directly from URL bar or externally
  const secFetchSite = request.headers.get('sec-fetch-site');
  const referer = request.headers.get('referer');
  const isRSC = request.headers.get('rsc') === '1' || request.headers.get('next-router-state-tree');
  const hasInAppCookie = request.cookies.get('zevro_in_app')?.value === '1';

  const host = request.headers.get('host') || '';
  const isInternalReferer = referer && (referer.includes(host) || referer.startsWith(request.nextUrl.origin));

  // If directly typed in address bar (sec-fetch-site === 'none') or opened without in-app context
  // (Excluding internal client-side router requests)
  if (!isRSC && (secFetchSite === 'none' || (!isInternalReferer && !hasInAppCookie))) {
    // Redirect direct URL access to the homepage
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - static assets (_next/static, _next/image, favicon, images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
