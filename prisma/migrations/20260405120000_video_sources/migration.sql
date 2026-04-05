CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Platform')
     AND NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'VideoPlatform') THEN
    ALTER TYPE "Platform" RENAME TO "VideoPlatform";
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'VideoPlatform' AND e.enumlabel = 'FACEBOOK'
  ) THEN
    ALTER TYPE "VideoPlatform" ADD VALUE 'FACEBOOK';
  END IF;
END $$;

CREATE TABLE "video_sources" (
  "id" UUID NOT NULL,
  "video_id" UUID NOT NULL,
  "platform" "VideoPlatform" NOT NULL,
  "url" TEXT NOT NULL,
  "external_id" VARCHAR(140),
  "is_primary" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "video_sources_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "video_sources_video_id_idx" ON "video_sources"("video_id");
CREATE INDEX "video_sources_platform_idx" ON "video_sources"("platform");
CREATE UNIQUE INDEX "video_sources_video_id_platform_key" ON "video_sources"("video_id", "platform");

INSERT INTO "video_sources" ("id", "video_id", "platform", "url", "external_id", "is_primary", "created_at", "updated_at")
SELECT
  gen_random_uuid(),
  "id",
  "platform"::text::"VideoPlatform",
  "video_url",
  "video_id",
  TRUE,
  "created_at",
  "updated_at"
FROM "videos";

ALTER TABLE "videos" DROP COLUMN "video_url",
DROP COLUMN "platform",
DROP COLUMN "video_id";
