import {PrismaClient} from '@prisma/client';

const globalForPrisma = globalThis as unknown as {prisma?: PrismaClient};

function sanitizeDatabaseUrl(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

export function createPrismaClient() {
  const datasourceUrl = sanitizeDatabaseUrl(process.env.DATABASE_URL);

  return new PrismaClient({
    ...(datasourceUrl ? {datasourceUrl} : {}),
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error']
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
