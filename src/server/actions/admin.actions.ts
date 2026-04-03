'use server';

import {createHash, timingSafeEqual} from 'crypto';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {errorResponse, successResponse, type ApiResponse} from '@/lib/api-response';
import {ADMIN_COOKIE_MAX_AGE, ADMIN_COOKIE_NAME, ADMIN_EMAIL_COOKIE_NAME, ADMIN_ROUTES} from '@/lib/admin-constants';

const AdminLoginSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(4, 'Password is required.'),
  rememberMe: z.boolean().optional()
});

function createSessionValue(raw: string): string {
  return createHash('sha256').update(`${raw}:${process.env.ADMIN_PASSWORD ?? ''}`).digest('hex');
}

function safeCompare(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function verifyAdminPassword(input: unknown): Promise<ApiResponse<{ok: true}>> {
  const parsed = AdminLoginSchema.safeParse(input);
  if (!parsed.success) {
    return errorResponse('Invalid login input.', 'VALIDATION_ERROR', {
      issues: parsed.error.flatten()
    });
  }

  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envPassword) {
    return errorResponse('ADMIN_PASSWORD is not configured.', 'CONFIG_ERROR');
  }

  if (!safeCompare(parsed.data.password, envPassword)) {
    return errorResponse('Incorrect password.', 'AUTH_ERROR');
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, createSessionValue(parsed.data.password), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: parsed.data.rememberMe ? ADMIN_COOKIE_MAX_AGE * 7 : ADMIN_COOKIE_MAX_AGE
  });

  if (parsed.data.email) {
    store.set(ADMIN_EMAIL_COOKIE_NAME, parsed.data.email, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: ADMIN_COOKIE_MAX_AGE
    });
  }

  return successResponse({ok: true});
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  store.delete(ADMIN_EMAIL_COOKIE_NAME);
  redirect('/');
}

export async function getCurrentAdminSession(): Promise<{isAdmin: boolean; email?: string}> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  const email = store.get(ADMIN_EMAIL_COOKIE_NAME)?.value;
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!token || !envPassword) {
    return {isAdmin: false};
  }

  const expected = createSessionValue(envPassword);
  const isAdmin = safeCompare(token, expected);

  return isAdmin ? {isAdmin: true, email} : {isAdmin: false};
}

export async function requireAdminOrRedirect() {
  const session = await getCurrentAdminSession();
  if (!session.isAdmin) {
    redirect(ADMIN_ROUTES.login);
  }
  return session;
}
