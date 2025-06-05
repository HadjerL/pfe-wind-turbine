import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthenticated = token === 'authenticated';

  if (pathname.startsWith('/login') && isAuthenticated) {
    const homeUrl = new URL('/managing/forecasting', request.url);
    return NextResponse.redirect(homeUrl);
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Protected routes
  if (pathname.startsWith('/managing') && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/managing/:path*'],
};