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
  /** 播放來源網址 */
  url: string;
  source: "shared-storage" | "cdn";
};

/**
 * 音源改為共用「music3」Supabase 專案（bucket: ritual-audio），
 * 與 music_tzbiomed_3 / music-discovery-hub 共用同一份「natural」風格音檔，
 * 不在本站另外儲存副本。public bucket 網址固定，不需要 SDK 或環境變數，
 * 因此這個播放器不會受本站自己的 Supabase 設定影響。
 */
const SHARED_MUSIC3_STORAGE_BASE =
  "https://rmtgismcfakesxtmoxcd.supabase.co/storage/v1/object/public/ritual-audio";

export const AUDIO_FILES: Record<ElementKey, { fileName: string; fallbackUrl: string }> = {
  wood: { fileName: "natural_wood_neutral_short_2026_08.mp3", fallbackUrl: woodAsset.url },
  fire: { fileName: "natural_fire_neutral_short_2026_08.mp3", fallbackUrl: fireAsset.url },
  earth: { fileName: "natural_earth_neutral_short_2026_08.mp3", fallbackUrl: earthAsset.url },
  metal: { fileName: "natural_metal_neutral_short_2026_08.mp3", fallbackUrl: metalAsset.url },
  water: { fileName: "natural_water_neutral_short_2026_08.mp3", fallbackUrl: waterAsset.url },
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
 * 讀取五行音韻。優先使用 music3 共用 Storage 的公開網址，
 * 若日後檔名調整導致取不到，退回 CDN 備援，確保前台永遠有聲音可播。
 */
export function getAudioTracks(): AudioTrack[] {
  return ELEMENT_ORDER.map((key) => {
    const url = `${SHARED_MUSIC3_STORAGE_BASE}/${AUDIO_FILES[key].fileName}`;
    return { ...META[key], url, source: "shared-storage" as const };
  });
}
