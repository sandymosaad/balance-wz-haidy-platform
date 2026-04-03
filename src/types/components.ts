import type {ReactNode} from 'react';

export type Option = {
  label: string;
  value: string;
};

export type CtaLink = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
};

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterOptions = {
  platforms: FilterOption[];
  tags: FilterOption[];
  playlists: FilterOption[];
};

export type ModalAction = ReactNode;
