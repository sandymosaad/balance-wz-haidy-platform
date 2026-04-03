'use client';

import {Modal} from '@/components/ui/Modal';
import {Button} from '@/components/ui/Button';

type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDangerous?: boolean;
};

export function ConfirmationDialog({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading,
  isDangerous
}: ConfirmationDialogProps) {
  return (
    <Modal
      isOpen={open}
      onClose={onCancel}
      title={title}
      actions={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={isDangerous ? 'primary' : 'secondary'}
            className={isDangerous ? 'bg-art-terracotta hover:bg-red-700' : ''}
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-sm text-art-taupe">{message}</p>
    </Modal>
  );
}
