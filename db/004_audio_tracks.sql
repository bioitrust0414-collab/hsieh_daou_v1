-- ============================================================
-- 謝天地的修道丹心 · 004: 五行音韻（音檔調取來源）
-- 在 Supabase Dashboard → SQL Editor 執行此檔
-- 建立公開 storage bucket「audio」與 audio_tracks 目錄表
-- ============================================================

-- 1. 公開音檔 bucket（前台以 public URL 直接播放）
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. 任何人可讀取 audio bucket 內容；寫入僅限 service_role（推送腳本）
DROP POLICY IF EXISTS "audio public read" ON storage.objects;
CREATE POLICY "audio public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'audio');

-- 3. 音檔目錄表
CREATE TABLE IF NOT EXISTS public.audio_tracks (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  element_key   text        NOT NULL UNIQUE,
  glyph         text        NOT NULL,
  title_zh      text        NOT NULL,
  title_en      text        NOT NULL,
  tone_zh       text        NOT NULL,
  tone_en       text        NOT NULL,
  note_zh       text,
  note_en       text,
  bucket        text        NOT NULL DEFAULT 'audio',
  storage_path  text        NOT NULL,
  sort_order    integer     NOT NULL DEFAULT 0,
  is_published  boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.audio_tracks TO anon, authenticated;
GRANT ALL ON public.audio_tracks TO service_role;

ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audio_tracks public read" ON public.audio_tracks;
CREATE POLICY "audio_tracks public read" ON public.audio_tracks
  FOR SELECT USING (is_published = true);

-- 4. 五行音韻資料
INSERT INTO public.audio_tracks
  (element_key, glyph, title_zh, title_en, tone_zh, tone_en, note_zh, note_en, storage_path, sort_order)
VALUES
  ('wood',  '木', '木', 'Wood',  '角音', 'Jue Tone',   '調肝舒鬱，生發之氣，宜於清晨行功。', 'Frees the liver qi; best at dawn.',       'natural_wood_neutral_short_2026_08.mp3',  1),
  ('fire',  '火', '火', 'Fire',  '徵音', 'Zhi Tone',   '通心養神，火候溫養，宜於午時靜坐。', 'Warms the heart-spirit; best at noon.',    'natural_fire_neutral_short_2026_08.mp3',  2),
  ('earth', '土', '土', 'Earth', '宮音', 'Gong Tone',  '培中固脾，安定中宮，宜於飯後調息。', 'Anchors the centre; best after meals.',    'natural_earth_neutral_short_2026_08.mp3', 3),
  ('metal', '金', '金', 'Metal', '商音', 'Shang Tone', '肅肺理氣，收斂清降，宜於黃昏吐納。', 'Clears the lungs; best at dusk.',          'natural_metal_neutral_short_2026_08.mp3', 4),
  ('water', '水', '水', 'Water', '羽音', 'Yu Tone',    '滋腎藏精，水火既濟，宜於子時塞兌。', 'Nourishes the kidneys; best at midnight.', 'natural_water_neutral_short_2026_08.mp3', 5)
ON CONFLICT (element_key) DO UPDATE SET
  glyph = EXCLUDED.glyph,
  title_zh = EXCLUDED.title_zh,
  title_en = EXCLUDED.title_en,
  tone_zh = EXCLUDED.tone_zh,
  tone_en = EXCLUDED.tone_en,
  note_zh = EXCLUDED.note_zh,
  note_en = EXCLUDED.note_en,
  storage_path = EXCLUDED.storage_path,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();
