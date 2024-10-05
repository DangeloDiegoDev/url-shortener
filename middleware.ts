import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/actions/auth';

export async function middleware(req: NextRequest) {
  const email = await verifyToken()

  if (!email) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile'],
}