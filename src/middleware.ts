import createMiddleware from 'next-intl/middleware';
import {NextResponse, type NextRequest} from 'next/server';
import {routing} from '@/i18n/routing';
import {ADMIN_COOKIE_NAME, ADMIN_ROUTES} from '@/lib/admin-constants';
import {getLocaleFromPathname, localeCookieName} from '@/i18n.config';

const intlMiddleware = createMiddleware(routing);

function withLocalePersistence(request: NextRequest, response: NextResponse) {
  const localeFromPath = getLocaleFromPathname(request.nextUrl.pathname);
  if (localeFromPath) {
    response.cookies.set(localeCookieName, localeFromPath, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax'
    });
  }
  return response;
}

export default function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (pathname === ADMIN_ROUTES.login || pathname.startsWith(`${ADMIN_ROUTES.login}/`)) {
      return NextResponse.next();
    }

    const session = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!session) {
      return NextResponse.redirect(new URL(ADMIN_ROUTES.login, request.url));
    }

    return NextResponse.next();
  }

  const response = intlMiddleware(request);
  return withLocalePersistence(request, response);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};