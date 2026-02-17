import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // Debug: Monitor cookie presence after proxy implementation
  console.log('[Proxy/Middleware Debug]', {
    pathname,
    hasAuthToken: !!token,
    userRole,
    allCookies: request.cookies.getAll().map(c => c.name).join(', ')
  });

  // 1. If trying to access protected routes without a token, redirect to login
  if (!token && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If logged in and trying to access login page, redirect to appropriate dashboard
  if (token && pathname === '/login') {
    const dashboard = userRole === 'admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // 3. Admin-only route protection
  if (pathname.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. User-only route protection (Admins should go to admin panel)
  if (pathname.startsWith('/dashboard') && userRole === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login'],
};
