import {createElement, type ReactNode} from 'react';
import {FileImage, FileText} from 'lucide-react';

export function formatDate(date: Date | string): string {
  const value = typeof date === 'string' ? new Date(date) : date;
  return value.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileIcon(fileName: string): ReactNode {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png')) {
    return createElement(FileImage, {className: 'h-4 w-4'});
  }
  return createElement(FileText, {className: 'h-4 w-4'});
}

export function classifyContentType(type: string): string {
  if (type === 'SERIES') return 'Series';
  if (type === 'COURSE') return 'Course';
  return 'Playlist';
}
