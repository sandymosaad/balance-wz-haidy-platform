import {z} from 'zod';
import {detectPlatform} from '@/lib/video-platform';
import {isRenderableImageSrc} from '@/lib/images';

const EN = {
  required: 'This field is required.',
  invalidUrl: 'Please provide a valid URL.',
  invalidEmail: 'Please provide a valid email address.',
  invalidUuid: 'Please provide a valid identifier.',
  invalidNumber: 'Please provide a valid number.'
} as const;

const AR = {
  required: 'هذا الحقل مطلوب.',
  invalidUrl: 'يرجى إدخال رابط صحيح.',
  invalidEmail: 'يرجى إدخال بريد إلكتروني صالح.',
  invalidUuid: 'يرجى إدخال معرف صالح.',
  invalidNumber: 'يرجى إدخال رقم صالح.'
} as const;

export type ValidationLocale = 'en' | 'ar';

export function getValidationMessages(locale: ValidationLocale = 'en') {
  return locale === 'ar' ? AR : EN;
}

export const SortOrderSchema = z.enum(['NEWEST', 'OLDEST', 'ALPHABETICAL']);
export const VideoSortOrderSchema = z.enum(['NEWEST', 'OLDEST', 'ALPHABETICAL', 'TRENDING']);

export const VideoPlatformSchema = z.enum(['YOUTUBE', 'INSTAGRAM', 'TIKTOK', 'FACEBOOK']);
export const PlatformSchema = VideoPlatformSchema;
export const ContentTypeSchema = z.enum(['SERIES', 'COURSE', 'PLAYLIST']);

const ImageUrlSchema = z
  .string()
  .trim()
  .refine((value) => isRenderableImageSrc(value), EN.invalidUrl);

export const VideoSourceSchema = z
  .object({
    url: z.string().trim().url(EN.invalidUrl),
    platform: VideoPlatformSchema.optional(),
    isPrimary: z.boolean().optional()
  })
  .superRefine((source, ctx) => {
    try {
      const detected = detectPlatform(source.url);

      if (source.platform && source.platform !== detected) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['platform'],
          message: `Selected platform does not match the URL. Supported: YouTube, Instagram, TikTok, Facebook.`
        });
      }
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['url'],
        message: error instanceof Error ? error.message : `Unsupported video platform. ${EN.invalidUrl}`
      });
    }
  });

export const PlaylistCreateSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters.').max(100),
  slug: z.string().trim().min(3).max(140).optional(),
  description: z.string().trim().max(1000).optional(),
  cover_image: ImageUrlSchema.optional(),
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

const VideoBaseSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(240).optional(),
  description: z.string().trim().max(2000).optional(),
  thumbnail_url: z.string().url(EN.invalidUrl).optional(),
  duration: z.number().int().min(0).optional(),
  playlist_id: z.string().uuid(EN.invalidUuid),
  tags: z.array(z.string().trim().min(1).max(40)).default([]),
  order_index: z.number().int().min(0).optional(),
  is_published: z.boolean().optional(),
  sources: z.array(VideoSourceSchema)
});

function validateVideoSources(data: {sources?: Array<z.infer<typeof VideoSourceSchema>>}, ctx: z.RefinementCtx) {
  if (!data.sources?.length) {
    return;
  }

  const seenPlatforms = new Map<string, number>();
  let primaryCount = 0;

  data.sources.forEach((source, index) => {
    try {
      const platform = source.platform ?? detectPlatform(source.url);
      const existingIndex = seenPlatforms.get(platform);

      if (typeof existingIndex === 'number') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['sources', index, 'platform'],
          message: 'Duplicate platform links are not allowed.'
        });
      } else {
        seenPlatforms.set(platform, index);
      }

      if (source.isPrimary) {
        primaryCount += 1;
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sources', index, 'url'],
        message: 'Unsupported video platform. Supported: YouTube, Instagram, TikTok, Facebook.'
      });
    }
  });

  if (primaryCount > 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['sources'],
      message: 'Only one primary platform can be selected.'
    });
  }
}

export const VideoCreateSchema = VideoBaseSchema.extend({
  sources: z.array(VideoSourceSchema).min(1, 'Add at least one platform link.')
}).superRefine(validateVideoSources);

export const VideoUpdateSchema = VideoBaseSchema.partial().superRefine(validateVideoSources);

export const VideoFilterSchema = z.object({
  playlist_id: z.string().uuid(EN.invalidUuid).optional(),
  platform: VideoPlatformSchema.optional(),
  tags: z.array(z.string().trim()).optional(),
  search: z.string().trim().optional(),
  sort: VideoSortOrderSchema.default('NEWEST'),
  limit: z.number().int().min(1).max(100).default(20),
  page: z.number().int().min(1).default(1),
  is_published: z.boolean().optional()
});

export const ContactMessageSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(120),
  email: z.string().trim().email(EN.invalidEmail).max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\-\d\s]{7,20}$/, 'Please enter a valid phone number.')
    .optional()
    .or(z.literal('')),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.').max(4000),
  locale: z.string().trim().min(2).max(10),
  pageUrl: z.string().trim().url(EN.invalidUrl).optional(),
  website: z.string().trim().max(0).optional()
});

export type PlaylistCreateInput = z.infer<typeof PlaylistCreateSchema>;
export type PlaylistUpdateInput = z.infer<typeof PlaylistUpdateSchema>;
export type PlaylistFilterInput = z.infer<typeof PlaylistFilterSchema>;
export type VideoCreateInput = z.infer<typeof VideoCreateSchema>;
export type VideoUpdateInput = z.infer<typeof VideoUpdateSchema>;
export type VideoFilterInput = z.infer<typeof VideoFilterSchema>;
export type VideoSourceInput = z.infer<typeof VideoSourceSchema>;
export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;

export function validateInput<T>(schema: z.ZodType<T>, payload: unknown): T {
  return schema.parse(payload);
}
