'use client';

import {useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {z} from 'zod';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/Input';
import {Card} from '@/components/ui/Card';
import {Heading} from '@/components/ui/Heading';
import {Text} from '@/components/ui/Text';
import {Alert} from '@/components/ui/Alert';
import {verifyAdminPassword} from '@/server/actions/admin.actions';

const schema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(4),
  rememberMe: z.boolean()
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({email: '', password: '', rememberMe: true});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError('Please enter a valid password.');
      return;
    }

    startTransition(async () => {
      const result = await verifyAdminPassword(parsed.data);
      if (!result.success) {
        setError(result.error?.message ?? 'Login failed.');
        return;
      }
      router.push('/admin/dashboard');
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-art-beige/30 px-4">
      <Card className="w-full max-w-md bg-art-cream">
        <Heading level={2}>Admin Login</Heading>
        <Text variant="small">Enter your admin password to access content management.</Text>
        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          <Input
            label="Email (optional)"
            value={form.email}
            onChange={(event) => setForm((prev) => ({...prev, email: event.target.value}))}
            type="email"
          />
          <Input
            label="Password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({...prev, password: event.target.value}))}
            type="password"
            required
          />

          <label className="flex items-center gap-2 text-sm text-art-taupe">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(event) => setForm((prev) => ({...prev, rememberMe: event.target.checked}))}
            />
            Remember me
          </label>

          {error ? <Alert type="error" title="Login error" message={error} /> : null}

          <Button className="w-full" loading={isPending} type="submit">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}
