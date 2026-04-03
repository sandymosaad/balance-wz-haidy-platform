This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database Environment Strategy

- Local development uses `.env` / `.env.local` with local PostgreSQL.
- Production (Vercel) must use Vercel Environment Variables.
- Do not commit production database URLs into `.env`.

### Local Development

Use local URLs in `.env`:

```dotenv
DATABASE_URL="postgresql://bwhc_user:bwhc_pass123@localhost:5434/bwhc_db?schema=public"
DIRECT_URL="postgresql://bwhc_user:bwhc_pass123@localhost:5434/bwhc_db?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
ADMIN_PASSWORD="your-strong-password"
```

### Vercel Production Environment Variables

Set these in Vercel Project Settings -> Environment Variables:

- `DATABASE_URL`
: Supabase Connection Pooling URL (PgBouncer, transaction mode, port `6543`) with `?sslmode=require`.

Example:

```dotenv
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=require"
```

- `DIRECT_URL`
: Optional direct Supabase connection URL for migrations/deploy tasks.

Example:

```dotenv
DIRECT_URL="postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require"
```

- `NEXT_PUBLIC_APP_URL`
: Your Vercel domain, for example:

```dotenv
NEXT_PUBLIC_APP_URL="https://<your-vercel-domain>"
```

- `ADMIN_PASSWORD`
: Your admin login password for dashboard access.

### Important for Vercel

- Remove `NODE_ENV` from Vercel env vars (or ensure it is `production`).
- Ensure no build step writes a localhost `DATABASE_URL` during deploy.
- Redeploy after changing environment variables.

### Production Migration Command

Run against production database:

```bash
npx prisma migrate deploy
```

If your network cannot reach `db.<project-ref>.supabase.co:5432` (IPv6-only in some setups), use:

- `DATABASE_URL` with Supabase pooler (`:6543`) for runtime.
- A network/environment with IPv6 support for `DIRECT_URL` migration path, or run migrations from a CI/runtime that can reach it.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# balance-wz-haidy-platform
