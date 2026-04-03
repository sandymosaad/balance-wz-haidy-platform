import type {ReactNode} from 'react';
import {Button} from '@/components/ui/Button';
import {Breadcrumb} from '@/components/admin/Breadcrumb';

type FormWrapperProps = {
  title: string;
  breadcrumb: {label: string; href?: string}[];
  children: ReactNode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  submitText?: string;
  cancelHref?: string;
};

export function FormWrapper({
  title,
  breadcrumb,
  children,
  onSubmit,
  isLoading,
  submitText = 'Save',
  cancelHref = '/admin/dashboard'
}: FormWrapperProps) {
  return (
    <section className="space-y-5">
      <Breadcrumb items={breadcrumb} />
      <h1 className="font-serif text-3xl text-art-charcoal">{title}</h1>
      <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-art-sage bg-art-cream p-6">
        {children}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={isLoading}>{submitText}</Button>
          <Button type="button" variant="ghost" asChild>
            <a href={cancelHref}>Cancel</a>
          </Button>
        </div>
      </form>
    </section>
  );
}
