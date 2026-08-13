-- ============================================================
-- 謝天地的修道丹心 · 內容同步與審核發布中台
-- Migration 002: 由 hsieh_dauo_repo 同步 Markdown 至 review 文章
-- ============================================================

-- 保留既有 articles 結構，新增文案來源追溯與受控發布欄位。
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS source_article_id text,
  ADD COLUMN IF NOT EXISTS source_repo text,
  ADD COLUMN IF NOT EXISTS source_path text,
  ADD COLUMN IF NOT EXISTS source_commit text,
  ADD COLUMN IF NOT EXISTS source_version integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS content_markdown text,
  ADD COLUMN IF NOT EXISTS summary_zh text,
  ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'full_lecture',
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'public',
  ADD COLUMN IF NOT EXISTS publication_status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS line_push_status text NOT NULL DEFAULT 'not_requested',
  ADD COLUMN IF NOT EXISTS line_push_copy text,
  ADD COLUMN IF NOT EXISTS cover_image text,
  ADD COLUMN IF NOT EXISTS synced_at timestamptz;

-- 來源文章識別碼必須唯一，讓重複手動同步改為更新而非建立重複文章。
CREATE UNIQUE INDEX IF NOT EXISTS uq_articles_source_article_id
  ON public.articles (source_article_id)
  WHERE source_article_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_articles_publication_status
  ON public.articles (publication_status, collection, sort_order);

CREATE INDEX IF NOT EXISTS idx_articles_source_repository
  ON public.articles (source_repo, source_path);

-- 只允許既定的內容生命週期與推播生命週期。
ALTER TABLE public.articles
  DROP CONSTRAINT IF EXISTS articles_publication_status_check;

ALTER TABLE public.articles
  ADD CONSTRAINT articles_publication_status_check
  CHECK (publication_status IN ('draft', 'review', 'approved', 'published', 'archived'));

ALTER TABLE public.articles
  DROP CONSTRAINT IF EXISTS articles_visibility_check;

ALTER TABLE public.articles
  ADD CONSTRAINT articles_visibility_check
  CHECK (visibility IN ('public', 'members'));

ALTER TABLE public.articles
  DROP CONSTRAINT IF EXISTS articles_line_push_status_check;

ALTER TABLE public.articles
  ADD CONSTRAINT articles_line_push_status_check
  CHECK (line_push_status IN ('not_requested', 'pending_approval', 'sent', 'skipped'));

-- 既有 is_published 與新欄位的意義必須一致。
ALTER TABLE public.articles
  DROP CONSTRAINT IF EXISTS articles_published_status_consistency_check;

ALTER TABLE public.articles
  ADD CONSTRAINT articles_published_status_consistency_check
  CHECK (
    (is_published = false AND publication_status <> 'published')
    OR (is_published = true AND publication_status = 'published')
  );

COMMENT ON COLUMN public.articles.source_article_id IS
  'hsieh_dauo_repo Front Matter 的固定文章 ID；用於同步 upsert。';
COMMENT ON COLUMN public.articles.source_commit IS
  '文案來源的 Git commit SHA，供版本追溯與回復。';
COMMENT ON COLUMN public.articles.publication_status IS
  '內容狀態：draft、review、approved、published、archived。同步程序只能寫入 review。';
COMMENT ON COLUMN public.articles.line_push_status IS
  'LINE 推播狀態；內容同步不會直接送出推播。';

-- 將已公開的既有文章標記為 published；其餘既有資料保留 draft。
UPDATE public.articles
SET publication_status = CASE WHEN is_published THEN 'published' ELSE 'draft' END
WHERE publication_status IS NULL
   OR publication_status NOT IN ('draft', 'review', 'approved', 'published', 'archived');
