// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const isManagingRoute = request.nextUrl.pathname.startsWith('/managing');

  if (isManagingRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}


export const config = {
  matcher: ['/managing/:path*'], 
};
