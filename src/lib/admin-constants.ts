export const ADMIN_COOKIE_NAME = 'admin_session';
export const ADMIN_EMAIL_COOKIE_NAME = 'admin_email';
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 12;

export const ADMIN_ROUTES = {
  login: '/admin/login',
  dashboard: '/admin/dashboard',
  videos: '/admin/videos',
  addVideo: '/admin/videos/add',
  playlists: '/admin/playlists',
  addPlaylist: '/admin/playlists/add'
} as const;

export const TABLE_PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20
} as const;

export const FILE_SIZE_LIMITS = {
  image: 5 * 1024 * 1024
} as const;

export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'] as const;

export const DEFAULT_SORT_OPTIONS = {
  videos: 'NEWEST',
  playlists: 'NEWEST'
} as const;
