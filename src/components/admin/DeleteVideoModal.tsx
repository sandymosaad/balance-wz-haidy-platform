'use client';

import {ConfirmationDialog} from '@/components/admin/ConfirmationDialog';

type DeleteVideoModalProps = {
  open: boolean;
  title: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteVideoModal({open, title, loading, onCancel, onConfirm}: DeleteVideoModalProps) {
  return (
    <ConfirmationDialog
      open={open}
      title="Delete Video"
      message={`Are you sure you want to delete \"${title}\"? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={loading}
      isDangerous
    />
  );
}
