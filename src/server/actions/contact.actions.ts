'use server';

import {headers} from 'next/headers';
import {Resend} from 'resend';
import {ContactMessageSchema, type ContactMessageInput} from '@/lib/validation';
import {resolveContactRecipients} from '@/lib/email';
import {errorResponse, mapToApiError, ServerActionError, successResponse, type ApiResponse} from '@/lib/api-response';

type ContactSuccess = {
  queued: boolean;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestBuckets = new Map<string, {count: number; resetAt: number}>();

function getIpAddress(headerStore: Awaited<ReturnType<typeof headers>>): string {
  const forwarded = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = headerStore.get('x-real-ip')?.trim();
  return forwarded || realIp || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = requestBuckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    requestBuckets.set(ip, {count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS});
    return false;
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  bucket.count += 1;
  return false;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildEmailHtml(input: ContactMessageInput, timestampIso: string): string {
  const subjectText = input.subject?.trim() ? input.subject.trim() : 'No subject provided';

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
      <h2 style="margin-bottom: 12px;">New Contact Message</h2>
      <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(input.phone?.trim() || 'Not provided')}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subjectText)}</p>
      <p><strong>Locale:</strong> ${escapeHtml(input.locale)}</p>
      <p><strong>Timestamp:</strong> ${escapeHtml(timestampIso)}</p>
      <p><strong>Page URL:</strong> ${escapeHtml(input.pageUrl ?? 'Not provided')}</p>
      <hr style="margin: 16px 0; border: 0; border-top: 1px solid #e5e7eb;" />
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(input.message)}</p>
    </div>
  `;
}

function buildEmailText(input: ContactMessageInput, timestampIso: string): string {
  const subjectText = input.subject?.trim() ? input.subject.trim() : 'No subject provided';

  return [
    'New Contact Message',
    '',
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone?.trim() || 'Not provided'}`,
    `Subject: ${subjectText}`,
    `Locale: ${input.locale}`,
    `Timestamp: ${timestampIso}`,
    `Page URL: ${input.pageUrl ?? 'Not provided'}`,
    '',
    'Message:',
    input.message
  ].join('\n');
}

export async function submitContactMessageAction(input: unknown): Promise<ApiResponse<ContactSuccess>> {
  try {
    const parsed = ContactMessageSchema.parse(input);

    // Honeypot: silently accept and skip sending if bots fill the hidden field.
    if (parsed.website?.trim()) {
      return successResponse({queued: true});
    }

    const headerStore = await headers();
    const ip = getIpAddress(headerStore);

    if (isRateLimited(ip)) {
      return errorResponse('Too many requests. Please try again in a minute.', 'RATE_LIMITED');
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    const recipients = resolveContactRecipients(process.env.CONTACT_TO_EMAILS);

    if (!resendApiKey || !fromEmail || recipients.length === 0) {
      const missing: string[] = [];

      if (!resendApiKey) missing.push('RESEND_API_KEY');
      if (!fromEmail) missing.push('CONTACT_FROM_EMAIL');
      if (recipients.length === 0) missing.push('CONTACT_TO_EMAILS');

      return errorResponse(
        'Contact form email settings are missing.',
        'CONFIG_ERROR',
        {missing}
      );
    }

    const resend = new Resend(resendApiKey);
    const timestampIso = new Date().toISOString();
    const subject = `New Contact Message — ${parsed.name}`;

    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      replyTo: parsed.email,
      subject,
      html: buildEmailHtml(parsed, timestampIso),
      text: buildEmailText(parsed, timestampIso)
    });

    if (emailResult.error) {
      console.error('Resend contact email send failed:', emailResult.error);
      throw new ServerActionError('Unable to send contact email.', 'EMAIL_SEND_FAILED', {
        reason: emailResult.error.message ?? 'Resend rejected the message',
        name: emailResult.error.name ?? 'ResendError'
      });
    }

    return successResponse({queued: true});
  } catch (error) {
    return mapToApiError(error);
  }
}
