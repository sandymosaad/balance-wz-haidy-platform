import {z} from 'zod';

const EN = {
  required: 'This field is required.',
  invalidUrl: 'Please provide a valid URL.',
  invalidUuid: 'Please provide a valid identifier.',
  invalidNumber: 'Please provide a valid number.'
} as const;

const AR = {
  required: 'هذا الحقل مطلوب.',
  invalidUrl: 'يرجى إدخال رابط صحيح.',
  invalidUuid: 'يرجى إدخال معرف صالح.',
  invalidNumber: 'يرجى إدخال رقم صالح.'
} as const;

export type ValidationLocale = 'en' | 'ar';

export function getValidationMessages(locale: ValidationLocale = 'en') {
  return locale === 'ar' ? AR : EN;
}

export const SortOrderSchema = z.enum(['NEWEST', 'OLDEST', 'ALPHABETICAL']);
export const VideoSortOrderSchema = z.enum(['NEWEST', 'OLDEST', 'ALPHABETICAL', 'TRENDING']);

export const PlatformSchema = z.enum(['YOUTUBE', 'INSTAGRAM', 'TIKTOK']);
export const ContentTypeSchema = z.enum(['SERIES', 'COURSE', 'PLAYLIST']);

export const PlaylistCreateSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters.').max(100),
  slug: z.string().trim().min(3).max(140).optional(),
  description: z.string().trim().max(1000).optional(),
  cover_image: z.string().url(EN.invalidUrl).optional(),
  content_type: ContentTypeSchema.default('PLAYLIST'),
  order: z.number().int().min(0).optional(),
  is_published: z.boolean().optional()
});

export const PlaylistUpdateSchema = PlaylistCreateSchema.partial();

export const PlaylistFilterSchema = z.object({
  search: z.string().trim().optional(),
  sort: SortOrderSchema.default('NEWEST'),
  limit: z.number().int().min(1).max(100).default(20),
  page: z.number().int().min(1).default(1),
  is_published: z.boolean().optional()
});

export const VideoCreateSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(240).optional(),
  description: z.string().trim().max(2000).optional(),
  video_url: z.string().url(EN.invalidUrl),
  platform: PlatformSchema.optional(),
  video_id: z.string().trim().min(2).max(140).optional(),
  thumbnail_url: z.string().url(EN.invalidUrl).optional(),
  duration: z.number().int().min(0).optional(),
  playlist_id: z.string().uuid(EN.invalidUuid),
  tags: z.array(z.string().trim().min(1).max(40)).default([]),
  order_index: z.number().int().min(0).optional(),
  is_published: z.boolean().optional()
});

export const VideoUpdateSchema = VideoCreateSchema.partial();

export const VideoFilterSchema = z.object({
  playlist_id: z.string().uuid(EN.invalidUuid).optional(),
  platform: PlatformSchema.optional(),
  tags: z.array(z.string().trim()).optional(),
  search: z.string().trim().optional(),
  sort: VideoSortOrderSchema.default('NEWEST'),
  limit: z.number().int().min(1).max(100).default(20),
  page: z.number().int().min(1).default(1),
  is_published: z.boolean().optional()
});

export type PlaylistCreateInput = z.infer<typeof PlaylistCreateSchema>;
export type PlaylistUpdateInput = z.infer<typeof PlaylistUpdateSchema>;
export type PlaylistFilterInput = z.infer<typeof PlaylistFilterSchema>;
export type VideoCreateInput = z.infer<typeof VideoCreateSchema>;
export type VideoUpdateInput = z.infer<typeof VideoUpdateSchema>;
export type VideoFilterInput = z.infer<typeof VideoFilterSchema>;

export function validateInput<T>(schema: z.ZodType<T>, payload: unknown): T {
  return schema.parse(payload);
}
