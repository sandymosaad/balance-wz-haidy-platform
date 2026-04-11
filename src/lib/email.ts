export const REQUIRED_CONTACT_RECIPIENT = 'sandymosaad24@gmail.com';

export function parseEmailList(rawValue: string | undefined): string[] {
  if (!rawValue) return [];

  return rawValue
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function resolveContactRecipients(rawValue: string | undefined): string[] {
  const parsed = parseEmailList(rawValue);
  if (parsed.length > 0) {
    return Array.from(new Set(parsed.map((email) => email.toLowerCase())));
  }

  return [REQUIRED_CONTACT_RECIPIENT.toLowerCase()];
}
