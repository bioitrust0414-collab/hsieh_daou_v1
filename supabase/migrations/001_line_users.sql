-- ============================================================
-- 謝天地的修道丹心 · Supabase 資料庫建置腳本
-- Migration 001: LINE 會員系統
-- ============================================================

-- 1. 建立 line_users 資料表
CREATE TABLE IF NOT EXISTS public.line_users (
  id                uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  line_user_id      text        NOT NULL UNIQUE,
  display_name      text,
  picture_url       text,
  status_message    text,
  is_in_client      boolean     NOT NULL DEFAULT false,
  login_count       integer     NOT NULL DEFAULT 1,
  first_seen_at     timestamptz NOT NULL DEFAULT now(),
  last_seen_at      timestamptz NOT NULL DEFAULT now()
);

-- 2. 建立索引加速查詢
CREATE INDEX IF NOT EXISTS idx_line_users_line_user_id ON public.line_users(line_user_id);
CREATE INDEX IF NOT EXISTS idx_line_users_last_seen ON public.line_users(last_seen_at DESC);

-- 3. 開啟 Row Level Security（資料表本身不允許前端直接讀寫）
ALTER TABLE public.line_users ENABLE ROW LEVEL SECURITY;

-- 4. 建立 record_line_login RPC 函數（Security Definer，繞過 RLS 安全寫入）
CREATE OR REPLACE FUNCTION public.record_line_login(
  p_line_user_id  text,
  p_display_name  text    DEFAULT NULL,
  p_picture_url   text    DEFAULT NULL,
  p_status_message text   DEFAULT NULL,
  p_is_in_client  boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.line_users (
    line_user_id,
    display_name,
    picture_url,
    status_message,
    is_in_client,
    login_count,
    first_seen_at,
    last_seen_at
  )
  VALUES (
    p_line_user_id,
    p_display_name,
    p_picture_url,
    p_status_message,
    p_is_in_client,
    1,
    now(),
    now()
  )
  ON CONFLICT (line_user_id) DO UPDATE SET
    display_name     = EXCLUDED.display_name,
    picture_url      = EXCLUDED.picture_url,
    status_message   = EXCLUDED.status_message,
    is_in_client     = EXCLUDED.is_in_client,
    login_count      = public.line_users.login_count + 1,
    last_seen_at     = now();
END;
$$;

-- 5. 授予 anon role 執行 RPC 函數的權限（前端可呼叫，但不能直接讀寫資料表）
GRANT EXECUTE ON FUNCTION public.record_line_login TO anon;
GRANT EXECUTE ON FUNCTION public.record_line_login TO authenticated;

-- 6. 建立 articles 資料表（知識庫文章，供 Supabase Realtime 推送）
CREATE TABLE IF NOT EXISTS public.articles (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          text        NOT NULL UNIQUE,
  collection    text        NOT NULL, -- 'shanhaijing' | 'daojia'
  episode       text        NOT NULL, -- 'EP01'
  title_zh      text        NOT NULL,
  title_en      text,
  subtitle_zh   text,
  subtitle_en   text,
  content_zh    text,
  content_en    text,
  tags          text[]      DEFAULT '{}',
  is_published  boolean     NOT NULL DEFAULT false,
  published_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- 7. 開啟 articles Realtime（讓前端即時接收更新）
ALTER TABLE public.articles REPLICA IDENTITY FULL;

-- 8. articles RLS：已發布的文章任何人可讀，未發布只有 authenticated 可讀
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are readable by everyone"
  ON public.articles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can read all articles"
  ON public.articles FOR SELECT
  TO authenticated
  USING (true);

-- 9. 自動更新 updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
