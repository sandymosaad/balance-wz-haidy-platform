'use client';

import {ConfirmationDialog} from '@/components/admin/ConfirmationDialog';

type DeletePlaylistModalProps = {
  open: boolean;
  title: string;
  videoCount: number;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeletePlaylistModal({
  open,
  title,
  videoCount,
  loading,
  onCancel,
  onConfirm
}: DeletePlaylistModalProps) {
  return (
    <ConfirmationDialog
      open={open}
      title="Delete Playlist"
      message={`Delete \"${title}\" and its ${videoCount} videos? This action cannot be undone.`}
      confirmText="Delete Playlist"
      cancelText="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={loading}
      isDangerous
    />
  );
}
