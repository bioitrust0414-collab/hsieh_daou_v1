/**
 * 將五行音韻音檔推送到 Supabase Storage（bucket: audio）。
 *
 * 先在 Supabase SQL Editor 執行 db/004_audio_tracks.sql，接著：
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=xxx \
 *   node scripts/push-audio-to-supabase.mjs
 *
 * 音檔來源為專案 CDN（src/assets/audio/*.asset.json），亦可用 --dir=/path/to/mp3
 * 指定本機資料夾（檔名需為 STORAGE_NAMES 對應的原始檔名）。
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const ELEMENTS = ["wood", "fire", "earth", "metal", "water"];
// Storage 內的實際檔名（bucket 根目錄，非 wuxing/ 子資料夾），需與 audio_tracks.storage_path 一致
const STORAGE_NAMES = {
  wood: "natural_wood_neutral_short_2026_08.mp3",
  fire: "natural_fire_neutral_short_2026_08.mp3",
  earth: "natural_earth_neutral_short_2026_08.mp3",
  metal: "natural_metal_neutral_short_2026_08.mp3",
  water: "natural_water_neutral_short_2026_08.mp3",
};
const CDN_BASE = process.env.CDN_BASE ?? "https://daou.lovable.app";
const BUCKET = "audio";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const localDir = process.argv.find((a) => a.startsWith("--dir="))?.slice(6);

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY 環境變數。");
  process.exit(1);
}

async function loadBytes(element) {
  if (localDir) {
    return new Uint8Array(await readFile(path.join(localDir, `${element}.mp3`)));
  }
  const pointer = JSON.parse(
    await readFile(new URL(`../src/assets/audio/${element}.mp3.asset.json`, import.meta.url), "utf8"),
  );
  const res = await fetch(`${CDN_BASE}${pointer.url}`);
  if (!res.ok) throw new Error(`下載 ${element} 失敗：${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

for (const element of ELEMENTS) {
  const bytes = await loadBytes(element);
  const target = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${STORAGE_NAMES[element]}`;
  const res = await fetch(target, {
    method: "POST",
    headers: {
      authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      "content-type": "audio/mpeg",
      "x-upsert": "true",
    },
    body: bytes,
  });
  if (!res.ok) {
    console.error(`上傳 ${element} 失敗：${res.status} ${await res.text()}`);
    process.exit(1);
  }
  console.log(`✓ ${element}.mp3 已上傳（${(bytes.length / 1024 / 1024).toFixed(1)} MB）`);
}

console.log("完成：五行音韻已推送至 Supabase Storage。");
