-- ============================================================
-- Migration 003: 讓 PostgREST 可依 source_article_id 進行 upsert
-- ============================================================

-- PostgREST 的 on_conflict 需要完整唯一索引；PostgreSQL 仍允許多筆 NULL，
-- 因此不需要 partial index 即可同時保留未同步舊文章。
DROP INDEX IF EXISTS public.uq_articles_source_article_id;

CREATE UNIQUE INDEX IF NOT EXISTS uq_articles_source_article_id
  ON public.articles (source_article_id);
