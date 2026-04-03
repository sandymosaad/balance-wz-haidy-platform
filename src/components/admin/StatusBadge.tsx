import {cn} from '@/lib/utils';

type StatusBadgeProps = {
  status: 'published' | 'draft';
  onClick?: () => void;
};

export function StatusBadge({status, onClick}: StatusBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium capitalize',
        status === 'published'
          ? 'border-art-gold bg-art-gold/20 text-art-charcoal'
          : 'border-art-sage bg-art-sage/25 text-art-taupe',
        onClick ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
      )}
      aria-label={`Status: ${status}`}
    >
      {status}
    </button>
  );
}
