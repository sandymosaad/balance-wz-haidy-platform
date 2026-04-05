'use client';

import {useState} from 'react';
import {Input} from '@/components/ui/Input';
import {Textarea} from '@/components/ui/Textarea';
import {Select} from '@/components/ui/Select';
import {Button} from '@/components/ui/Button';
import {Alert} from '@/components/ui/Alert';
import {ContactMessageSchema} from '@/lib/validation';
import {useTranslations} from '@/lib/use-translations';
import {submitContactMessageAction} from '@/server/actions/contact.actions';

type ContactFormProps = {
  locale: string;
};

type ContactFieldError = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>;

export function ContactForm({locale}: ContactFormProps) {
  const t = useTranslations('phase3.contactPage');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldError>({});
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState({name: '', email: '', subject: '', message: '', website: ''});

  function updateField(key: keyof typeof form, value: string) {
    setForm((previous) => ({...previous, [key]: value}));

    if (key === 'name' || key === 'email' || key === 'subject' || key === 'message') {
      setFieldErrors((previous) => ({...previous, [key]: undefined}));
    }

    if (submitError) {
      setSubmitError('');
    }

    if (status === 'error') {
      setStatus('idle');
    }
  }

  function mapServerError(code?: string): string {
    if (code === 'RATE_LIMITED') {
      return t('errors.rateLimited');
    }

    if (code === 'CONFIG_ERROR') {
      return t('errors.configMissing');
    }

    if (code === 'VALIDATION_ERROR') {
      return t('errors.validation');
    }

    return t('errors.sendFailed');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus('idle');
    setFieldErrors({});
    setSubmitError('');

    try {
      const payload = {
        ...form,
        locale,
        pageUrl: typeof window !== 'undefined' ? window.location.href : undefined
      };

      const parsed = ContactMessageSchema.safeParse(payload);

      if (!parsed.success) {
        const nextErrors: ContactFieldError = {};
        const {fieldErrors: schemaFieldErrors} = parsed.error.flatten();

        if (schemaFieldErrors.name?.length) {
          nextErrors.name = t('validation.name');
        }

        if (schemaFieldErrors.email?.length) {
          nextErrors.email = t('validation.email');
        }

        if (schemaFieldErrors.message?.length) {
          nextErrors.message = t('validation.message');
        }

        if (schemaFieldErrors.subject?.length) {
          nextErrors.subject = t('validation.subject');
        }

        setFieldErrors(nextErrors);
        setSubmitError(t('errors.validation'));
        setStatus('error');
        return;
      }

      const response = await submitContactMessageAction(payload);

      if (!response.success) {
        const missingConfig = response.error?.details?.missing;

        if (response.error?.code === 'CONFIG_ERROR' && Array.isArray(missingConfig) && missingConfig.length > 0) {
          setSubmitError(`${t('errors.configMissing')}: ${missingConfig.join(', ')}`);
        } else {
          setSubmitError(mapServerError(response.error?.code));
        }
        setStatus('error');
        return;
      }

      setStatus('success');
      setSubmitError('');
      setFieldErrors({});
      setForm({name: '', email: '', subject: '', message: '', website: ''});
    } catch {
      setSubmitError(t('errors.sendFailed'));
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {status === 'success' ? <Alert type="success" title={t('successTitle')} message={t('successMessage')} /> : null}
      {status === 'error' ? <Alert type="error" title={t('errorTitle')} message={submitError || t('errorMessage')} /> : null}

      <form className="space-y-5 rounded-gentle border border-art-sage bg-art-beige/50 p-6" onSubmit={handleSubmit}>
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={(event) => updateField('website', event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <Input
          label={t('form.name')}
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          error={fieldErrors.name}
          helperText={fieldErrors.name}
          disabled={loading}
          required
        />
        <Input
          label={t('form.email')}
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          error={fieldErrors.email}
          helperText={fieldErrors.email}
          disabled={loading}
          required
        />
        <Select
          label={t('form.subject')}
          value={form.subject}
          onChange={(value) => updateField('subject', value)}
          disabled={loading}
          options={[
            {label: t('subjects.discovery'), value: 'discovery'},
            {label: t('subjects.coaching'), value: 'coaching'},
            {label: t('subjects.artTherapy'), value: 'art-therapy'}
          ]}
        />
        <Textarea
          label={t('form.message')}
          value={form.message}
          onChange={(event) => updateField('message', event.target.value)}
          error={fieldErrors.message}
          helperText={fieldErrors.message}
          disabled={loading}
          rows={6}
          required
        />
        <Button type="submit" loading={loading}>{t('form.submit')}</Button>
      </form>
    </>
  );
}
