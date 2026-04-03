'use client';

import {Button} from '@/components/ui/Button';

type Action = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
};

type ActionButtonsProps = {
  actions: Action[];
};

export function ActionButtons({actions}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action) => (
        <Button key={action.label} variant={action.variant ?? 'ghost'} size="sm" onClick={action.onClick}>
          {action.icon}
          <span>{action.label}</span>
        </Button>
      ))}
    </div>
  );
}
