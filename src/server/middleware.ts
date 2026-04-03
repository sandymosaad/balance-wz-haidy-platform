import {ZodError, type z} from 'zod';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {NextResponse} from 'next/server';
import {ADMIN_COOKIE_NAME, ADMIN_ROUTES} from '@/lib/admin-constants';

export function handleServerError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        details: error.flatten()
      },
      {status: 400}
    );
  }

  const message = error instanceof Error ? error.message : 'Internal server error';
  return NextResponse.json({success: false, error: message}, {status: 500});
}

export function parseRequestBody<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data);
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return Boolean(session);
}

export async function requireAdminRouteAccess() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) {
    redirect(ADMIN_ROUTES.login);
  }
}
