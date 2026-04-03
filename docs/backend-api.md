# Phase 2 Backend API Design

## Architecture

- Prisma ORM with PostgreSQL and UUID primary keys.
- Repository pattern for database access.
- Server Actions are thin wrappers around repositories.
- Zod validation at action boundaries.
- Unified response format via ApiResponse.

## Core Modules

- src/lib/api-response.ts
- src/lib/validation.ts
- src/lib/video-platform.ts
- src/server/repositories/playlist.repository.ts
- src/server/repositories/video.repository.ts
- src/server/actions/playlist.actions.ts
- src/server/actions/video.actions.ts

## Response Contract

```ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
  };
  metadata?: {
    timestamp: string;
    version: string;
  };
}
```

## Filtering and Pagination

- Playlist and video listing methods support search, sort, limit, and page.
- Return includes pagination metadata: total, page, limit, pageCount.

## Search

- Implemented as case-insensitive search on title and description.
- Schema and indexes are ready for PostgreSQL full-text search expansion.

## Video Metadata Extraction

- detectPlatform(url)
- extractVideoId(url, platform)
- getThumbnailUrl(platform, videoId)
- extractVideoMetadata(url)

## Runbook

1. npm install
2. npx prisma migrate dev --name phase2_backend
3. npx prisma db seed
4. npx prisma studio
5. npm run dev
