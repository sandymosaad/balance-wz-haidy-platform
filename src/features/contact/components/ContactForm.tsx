'use client';

import {useState} from 'react';
import {z} from 'zod';
import {Input} from '@/components/ui/Input';
import {Textarea} from '@/components/ui/Textarea';
import {Select} from '@/components/ui/Select';
import {Button} from '@/components/ui/Button';
import {Alert} from '@/components/ui/Alert';
import {useTranslations} from '@/lib/use-translations';

const ContactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10)
});

export function ContactForm() {
  const t = useTranslations('phase3.contactPage');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({name: '', email: '', subject: '', message: ''});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      ContactFormSchema.parse(form);
      await new Promise((resolve) => setTimeout(resolve, 700));
      setStatus('success');
      setForm({name: '', email: '', subject: '', message: ''});
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {status === 'success' ? <Alert type="success" title={t('successTitle')} message={t('successMessage')} /> : null}
      {status === 'error' ? <Alert type="error" title={t('errorTitle')} message={t('errorMessage')} /> : null}

      <form className="space-y-5 rounded-gentle border border-art-sage bg-art-beige/50 p-6" onSubmit={handleSubmit}>
        <Input
          label={t('form.name')}
          value={form.name}
          onChange={(event) => setForm({...form, name: event.target.value})}
          required
        />
        <Input
          label={t('form.email')}
          type="email"
          value={form.email}
          onChange={(event) => setForm({...form, email: event.target.value})}
          required
        />
        <Select
          label={t('form.subject')}
          value={form.subject}
          onChange={(value) => setForm({...form, subject: value})}
          options={[
            {label: t('subjects.discovery'), value: 'discovery'},
            {label: t('subjects.coaching'), value: 'coaching'},
            {label: t('subjects.artTherapy'), value: 'art-therapy'}
          ]}
        />
        <Textarea
          label={t('form.message')}
          value={form.message}
          onChange={(event) => setForm({...form, message: event.target.value})}
          rows={6}
          required
        />
        <Button type="submit" loading={loading}>{t('form.submit')}</Button>
      </form>
    </>
  );
}
