import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "zh" | "en";
export type L = { zh: string; en: string };
export type LArr = { zh: string[]; en: string[] };

export const L = (zh: string, en: string): L => ({ zh, en });
export const LA = (zh: string[], en: string[]): LArr => ({ zh, en });

export function pick<T>(field: { zh: T; en: T }, lang: Lang): T {
  return field[lang];
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void };
const LangContext = createContext<Ctx>({ lang: "zh", setLang: () => {}, toggle: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("lang") : null;
    if (saved === "zh" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, toggle: () => setLang(lang === "zh" ? "en" : "zh") }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

// UI dictionary
const dict = {
  nav_home: L("首頁", "Home"),
  nav_shanhaijing: L("山海經", "Shan Hai Jing"),
  nav_daojia: L("道家心法", "Daoist Practice"),
  hero_tagline: L(
    "以講演筆記為體，以古籍為骨。從《山海經》到道家內丹，逐篇重構華夏文明的地理、生物、醫藥與神話。",
    "Lecture notes on classical Chinese texts. From the Shan Hai Jing to Daoist internal alchemy — reconstructing ancient geography, biology, medicine, and myth."
  ),
  enter_collection: L("進入", "Enter"),
  episodes_count: L("集講演", "episodes"),
  chapters_count: L("篇", "chapters"),
  currently_hosting: L("目前收錄", "Currently hosting"),
  collection_label: L("當期典藏", "Current Collection"),
  coming_soon_label: L("待啟卷宗", "Coming Soon"),
  coming_soon_title: L("後續典藏", "Future Volumes"),
  preparing: L("籌備中", "In preparation"),
  footer_line: L("以講演之筆重繪古卷", "Redrawing ancient scrolls with a lecturer's pen"),
  read_open: L("展卷閱讀", "Open scroll"),
  prev_ep: L("上一集", "Previous"),
  next_ep: L("下一集", "Next"),
  not_found_title: L("篇章未找到", "Episode not found"),
  not_found_desc: L("此卷尚未收錄，或連結有誤。", "This scroll has not been collected, or the link is broken."),
  back_to: L("返回目錄", "Back to index"),
  load_failed: L("載入失敗", "Load failed"),
  retry: L("重試", "Retry"),
  note_label: L("按語", "Note"),
  lang_switch: L("EN", "中"),
  lang_switch_label: L("切換英文", "Switch to Chinese"),
} as const;

export type UIKey = keyof typeof dict;
export function useT() {
  const { lang } = useLang();
  return (k: UIKey) => dict[k][lang];
}
