export const APP_NAME = 'balance wz haidy';

export const NAV_ROUTES = [
  {key: 'home', href: '/'},
  {key: 'videos', href: '/videos'},
  {key: 'about', href: '/about'},
  {key: 'services', href: '/services'},
  {key: 'contact', href: '/contact'}
] as const;

export const DEFAULT_METADATA = {
  title: 'balance wz haidy',
  description:
    'Explore art therapy coaching, wellness programs, and creative expression for meaningful personal growth.',
  openGraphImage: '/og-image.jpg'
} as const;
