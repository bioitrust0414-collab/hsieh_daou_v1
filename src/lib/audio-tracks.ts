import { supabase } from "@/lib/supabase";
import earthAsset from "@/assets/audio/earth.mp3.asset.json";
import fireAsset from "@/assets/audio/fire.mp3.asset.json";
import metalAsset from "@/assets/audio/metal.mp3.asset.json";
import waterAsset from "@/assets/audio/water.mp3.asset.json";
import woodAsset from "@/assets/audio/wood.mp3.asset.json";

export type ElementKey = "wood" | "fire" | "earth" | "metal" | "water";

export type AudioTrack = {
  key: ElementKey;
  /** 五行 */
  glyph: string;
  name: { zh: string; en: string };
  /** 五音 */
  tone: { zh: string; en: string };
  note: { zh: string; en: string };
  /** 播放來源（Supabase Storage 公開網址，取不到時退回 CDN 備援） */
  url: string;
  source: "supabase" | "cdn";
};

/** Supabase Storage bucket / 檔名，與 migration 004 一致 */
export const AUDIO_BUCKET = "audio";

export const AUDIO_FILES: Record<ElementKey, { storagePath: string; fallbackUrl: string }> = {
  wood: { storagePath: "wuxing/wood.mp3", fallbackUrl: woodAsset.url },
  fire: { storagePath: "wuxing/fire.mp3", fallbackUrl: fireAsset.url },
  earth: { storagePath: "wuxing/earth.mp3", fallbackUrl: earthAsset.url },
  metal: { storagePath: "wuxing/metal.mp3", fallbackUrl: metalAsset.url },
  water: { storagePath: "wuxing/water.mp3", fallbackUrl: waterAsset.url },
};

const META: Record<ElementKey, Omit<AudioTrack, "url" | "source">> = {
  wood: {
    key: "wood",
    glyph: "木",
    name: { zh: "木", en: "Wood" },
    tone: { zh: "角音", en: "Jue Tone" },
    note: { zh: "調肝舒鬱，生發之氣，宜於清晨行功。", en: "Frees the liver qi; best at dawn." },
  },
  fire: {
    key: "fire",
    glyph: "火",
    name: { zh: "火", en: "Fire" },
    tone: { zh: "徵音", en: "Zhi Tone" },
    note: { zh: "通心養神，火候溫養，宜於午時靜坐。", en: "Warms the heart-spirit; best at noon." },
  },
  earth: {
    key: "earth",
    glyph: "土",
    name: { zh: "土", en: "Earth" },
    tone: { zh: "宮音", en: "Gong Tone" },
    note: { zh: "培中固脾，安定中宮，宜於飯後調息。", en: "Anchors the centre; best after meals." },
  },
  metal: {
    key: "metal",
    glyph: "金",
    name: { zh: "金", en: "Metal" },
    tone: { zh: "商音", en: "Shang Tone" },
    note: { zh: "肅肺理氣，收斂清降，宜於黃昏吐納。", en: "Clears the lungs; best at dusk." },
  },
  water: {
    key: "water",
    glyph: "水",
    name: { zh: "水", en: "Water" },
    tone: { zh: "羽音", en: "Yu Tone" },
    note: { zh: "滋腎藏精，水火既濟，宜於子時塞兌。", en: "Nourishes the kidneys; best at midnight." },
  },
};

export const ELEMENT_ORDER: ElementKey[] = ["wood", "fire", "earth", "metal", "water"];

function fallbackTrack(key: ElementKey): AudioTrack {
  return { ...META[key], url: AUDIO_FILES[key].fallbackUrl, source: "cdn" };
}

/**
 * 讀取五行音韻。優先使用 Supabase Storage 的公開網址（音檔調取來源），
 * 未設定或取不到時自動退回 CDN 備援，確保前台永遠有聲音可播。
 */
export function getAudioTracks(): AudioTrack[] {
  return ELEMENT_ORDER.map((key) => {
    if (!supabase) return fallbackTrack(key);
    try {
      const { data } = supabase.storage
        .from(AUDIO_BUCKET)
        .getPublicUrl(AUDIO_FILES[key].storagePath);
      return data?.publicUrl
        ? { ...META[key], url: data.publicUrl, source: "supabase" as const }
        : fallbackTrack(key);
    } catch {
      return fallbackTrack(key);
    }
  });
}
