import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SECURITY_HEADERS = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

function applySecurityHeaders(res: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  return res;
}

function hasValidSession(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value ||
    request.cookies.get('adminControlSession')?.value
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Static assets & Next internals — fast bypass
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Admin Control Portal Protection
  if (pathname.startsWith('/adminControl')) {
    if (pathname === '/adminControl/login') {
      return applySecurityHeaders(NextResponse.next());
    }
    const adminToken = request.cookies.get('adminControlSession');
    if (!adminToken) {
      return applySecurityHeaders(NextResponse.redirect(new URL('/adminControl/login', request.url)));
    }
    return applySecurityHeaders(NextResponse.next());
  }

  // 3. Protected Customer Account Routes (/account, /account/orders, /account/settings, etc.)
  if (pathname.startsWith('/account')) {
    if (!hasValidSession(request)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  // 4. Protected Checkout Route (/checkout)
  if (pathname.startsWith('/checkout')) {
    if (!hasValidSession(request)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  // 5. In-App Navigation Referrer Guard (preserves intentional store entry protection)
  const isExcludedFromReferrerGuard = 
    pathname === '/' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/superadmin') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/account');

  if (!isExcludedFromReferrerGuard) {
    const secFetchSite = request.headers.get('sec-fetch-site');
    const referer = request.headers.get('referer');
    const isRSC = request.headers.get('rsc') === '1' || request.headers.get('next-router-state-tree');
    const hasInAppCookie = request.cookies.get('zevro_in_app')?.value === '1';

    const host = request.headers.get('host') || '';
    const isInternalReferer = referer && (referer.includes(host) || referer.startsWith(request.nextUrl.origin));

    if (!isRSC && (secFetchSite === 'none' || (!isInternalReferer && !hasInAppCookie))) {
      return applySecurityHeaders(NextResponse.redirect(new URL('/', request.url)));
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export default proxy;

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
