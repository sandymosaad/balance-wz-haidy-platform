export const APP_NAME = 'Art Therapy Coaching Platform';

export const NAV_ROUTES = [
  {key: 'home', href: '/'},
  {key: 'videos', href: '/videos'},
  {key: 'about', href: '/about'},
  {key: 'services', href: '/services'},
  {key: 'contact', href: '/contact'}
] as const;

export const SOCIAL_LINKS = [
  {key: 'facebook', href: 'https://facebook.com', label: 'Facebook'},
  {key: 'instagram', href: 'https://instagram.com', label: 'Instagram'},
  {key: 'tiktok', href: 'https://tiktok.com', label: 'TikTok'},
  {key: 'youtube', href: 'https://youtube.com', label: 'YouTube'}
] as const;

export const DEFAULT_METADATA = {
  title: 'Art Therapy Coaching & Wellness',
  description:
    'Explore art therapy coaching, wellness programs, and creative expression for meaningful personal growth.',
  openGraphImage: '/og-image.jpg'
} as const;
