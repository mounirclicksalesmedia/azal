import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const locales = ['ar', 'en'];
const defaultLocale = 'ar';

// Routes that opt out of the locale rewrite (dashboard / auth / api).
const STAFF_PREFIXES = ['/dashboard', '/login', '/logout', '/api', '/auth'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) Refresh the Supabase session for any dashboard route so server pages see a fresh JWT.
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
    return refreshAndGate(request);
  }

  // 2) Staff/api/auth routes pass through unchanged.
  if (STAFF_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // 3) Marketing site: enforce locale prefix.
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

async function refreshAndGate(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Block /dashboard/* without session.
  if (path.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  // Skip /login when already signed in.
  if (path.startsWith('/login') && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|.*\\..*).*)',
  ],
};
