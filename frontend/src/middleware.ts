import { NextRequest, NextResponse } from 'next/server';

const TOKEN_COOKIE = 'nm_token';

/** Protege /admin: exige la cookie de sesión (validación real en la API). */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(TOKEN_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
