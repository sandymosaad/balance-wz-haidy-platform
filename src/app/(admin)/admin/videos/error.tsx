'use client';

import {useEffect} from 'react';
import {Heading} from '@/components/ui/Heading';
import {Alert} from '@/components/ui/Alert';
import {Button} from '@/components/ui/Button';

export default function Error({
  error,
  reset
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Videos error:', error);
  }, [error]);

  return (
    <section className="space-y-5">
      <div>
        <Heading level={1}>Videos</Heading>
      </div>

      <Alert
        type="error"
        title="Error Loading Videos"
        message={error.message || 'Failed to load videos. Please try again.'}
      />

      <div className="flex gap-3">
        <Button onClick={() => reset()} variant="primary">
          Try Again
        </Button>
        <Button onClick={() => (window.location.href = '/admin')} variant="secondary"/>
        <Button onClick={() => window.location.href = '/admin'} variant="secondary">
          Back to Dashboard
        </Button>
      </div>
    </section>
  );
}