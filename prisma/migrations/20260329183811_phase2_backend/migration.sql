-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('YOUTUBE', 'INSTAGRAM', 'TIKTOK');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('SERIES', 'COURSE', 'PLAYLIST');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "playlists" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(140) NOT NULL,
    "description" TEXT,
    "cover_image" TEXT,
    "content_type" "ContentType" NOT NULL DEFAULT 'PLAYLIST',
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(240) NOT NULL,
    "description" TEXT,
    "video_url" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "video_id" VARCHAR(140) NOT NULL,
    "thumbnail_url" TEXT,
    "duration" INTEGER,
    "playlist_id" UUID NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120),
    "email" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "viewing_history" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "video_id" UUID NOT NULL,
    "watched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "watch_seconds" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "viewing_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "video_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "user_id" UUID NOT NULL,
    "video_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "playlists_slug_key" ON "playlists"("slug");

-- CreateIndex
CREATE INDEX "playlists_title_idx" ON "playlists"("title");

-- CreateIndex
CREATE INDEX "playlists_is_published_idx" ON "playlists"("is_published");

-- CreateIndex
CREATE INDEX "playlists_created_at_idx" ON "playlists"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "videos_slug_key" ON "videos"("slug");

-- CreateIndex
CREATE INDEX "videos_title_idx" ON "videos"("title");

-- CreateIndex
CREATE INDEX "videos_platform_idx" ON "videos"("platform");

-- CreateIndex
CREATE INDEX "videos_playlist_id_idx" ON "videos"("playlist_id");

-- CreateIndex
CREATE INDEX "videos_is_published_idx" ON "videos"("is_published");

-- CreateIndex
CREATE INDEX "videos_video_id_idx" ON "videos"("video_id");

-- CreateIndex
CREATE INDEX "videos_tags_idx" ON "videos" USING GIN ("tags");

-- CreateIndex
CREATE UNIQUE INDEX "videos_playlist_id_order_index_key" ON "videos"("playlist_id", "order_index");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "viewing_history_watched_at_idx" ON "viewing_history"("watched_at");

-- CreateIndex
CREATE UNIQUE INDEX "viewing_history_user_id_video_id_key" ON "viewing_history"("user_id", "video_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_video_id_key" ON "favorites"("user_id", "video_id");

-- CreateIndex
CREATE INDEX "comments_is_approved_idx" ON "comments"("is_approved");

-- CreateIndex
CREATE INDEX "comments_created_at_idx" ON "comments"("created_at");

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewing_history" ADD CONSTRAINT "viewing_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewing_history" ADD CONSTRAINT "viewing_history_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
