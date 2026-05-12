import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const locales = ['ar', 'en'];
const defaultLocale = 'ar';
const projects = ['azal', 'arsh'];

// Routes that opt out of the marketing-site locale rewrite.
const STAFF_PREFIXES = ['/dashboard', '/login', '/logout', '/api', '/auth'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) Refresh the Supabase session for any dashboard/login route.
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
    return refreshAndGate(request);
  }

  // 2) Staff/api/auth routes pass through unchanged.
  if (STAFF_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // 3) Root → default project + default locale.
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/azal/${defaultLocale}`;
    return NextResponse.redirect(url);
  }

  // 4) /<project> or /<project>/ → /<project>/<defaultLocale>.
  //    /<project>/<locale> passes through.
  for (const project of projects) {
    if (pathname === `/${project}` || pathname === `/${project}/`) {
      const url = request.nextUrl.clone();
      url.pathname = `/${project}/${defaultLocale}`;
      return NextResponse.redirect(url);
    }
    const hasLocale = locales.some(
      (locale) =>
        pathname === `/${project}/${locale}` ||
        pathname.startsWith(`/${project}/${locale}/`),
    );
    if (hasLocale) return;
  }

  // 5) Anything else: let Next.js handle (likely 404).
  return NextResponse.next();
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
