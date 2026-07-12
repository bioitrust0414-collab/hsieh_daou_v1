import { createFileRoute, Link } from "@tanstack/react-router";
import { LangProvider, useLang, useT, pick, type Lang } from "@/lib/i18n";
import { collections } from "@/content/collections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "謝天地的修道丹心 · 國學典籍講演筆記" },
      {
        name: "description",
        content:
          "謝天地的修道丹心：以講演筆記重構《山海經》與道家內丹修行，從地理、動物、醫藥到節氣與煉丹，逐篇解構華夏先民的世界觀。",
      },
      { property: "og:title", content: "謝天地的修道丹心 · 國學典籍講演筆記" },
      {
        property: "og:description",
        content: "以講演筆記重構《山海經》與道家內丹修行，從地理、醫藥到煉丹，逐篇解構華夏文化。",
      },
    ],
  }),
  component: HomeWrapper,
});

function HomeWrapper() {
  return (
    <LangProvider>
      <Home />
    </LangProvider>
  );
}

function Home() {
  const { lang } = useLang();
  const t = useT();
  const totalEpisodes = collections.reduce((s, c) => s + c.allEpisodes.length, 0);
  const totalChapters = collections.reduce((s, c) => s + c.chapters.length, 0);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pb-24">
        {/* Hero */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="absolute right-4 top-16 hidden md:block">
            <div className="seal text-lg">{lang === "zh" ? "國學典藏" : "CLASSICS"}</div>
          </div>
          <p className="text-sm tracking-[0.4em] text-bronze mb-6">XIÈ · TIĀN · DÌ</p>
          <h1 className="brand-title text-6xl md:text-8xl font-normal text-foreground leading-tight">
            {lang === "zh" ? "謝天地的修道丹心" : "Xie Tian Di"}
          </h1>
          {lang === "en" && (
            <p className="mt-3 text-2xl text-foreground/70 font-serif-tc">A Cultivator's Cinnabar Heart</p>
          )}
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("hero_tagline")}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/shanhaijing"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              {t("enter_collection")} · {pick(collections[0].meta.title, lang)}
              <span aria-hidden>→</span>
            </Link>
            <Link
              to="/daojia"
              className="inline-flex items-center gap-2 rounded-md border border-primary/40 px-6 py-3 text-foreground hover:bg-primary/10 transition-colors"
            >
              {t("enter_collection")} · {pick(collections[1].meta.title, lang)}
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {t("currently_hosting")}{" "}
            <span className="text-foreground font-medium">{totalEpisodes}</span>{" "}
            {t("episodes_count")} · {totalChapters} {t("chapters_count")}
          </div>
        </section>

        <Divider />

        {collections.map((col) => (
          <section key={col.meta.key} className="py-16">
            <div className="mb-10">
              <p className="text-sm tracking-widest text-bronze mb-2">
                {pick(col.meta.index, lang)} · {col.meta.pinyin}
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                {pick(col.meta.title, lang)}
              </h2>
              <p className="mt-2 text-muted-foreground">{pick(col.meta.subtitle, lang)}</p>
            </div>

            <p className="max-w-3xl text-foreground/85 leading-loose mb-10">
              {pick(col.meta.description, lang)}
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {col.chapters.map((c) => (
                <Link
                  key={c.key}
                  to={col.meta.href}
                  className="scroll-card p-6 group transition-transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs tracking-widest text-bronze">
                        {pick(c.direction, lang)} · CHAPTER
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold">{pick(c.name, lang)}</h3>
                    </div>
                    <div className="seal text-xs h-14">{c.directionChar}</div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                    {pick(c.intro, lang)}
                  </p>
                  <div className="mt-5 pt-4 border-t border-border/70 text-xs text-bronze flex items-center gap-2">
                    {c.episodes.length} {t("episodes_count")}
                    <span aria-hidden className="ml-auto transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <Divider />

        {/* Coming soon */}
        <section className="py-16">
          <p className="text-sm tracking-widest text-bronze mb-3">{t("coming_soon_label")}</p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">{t("coming_soon_title")}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { zh: "海外經", en: "Overseas Classics", note: { zh: "四方海外的異域與神話疆界", en: "Foreign lands and mythic borders" } },
              { zh: "黃帝內經", en: "Yellow Emperor's Inner Canon", note: { zh: "中醫奠基之作，臟腑經絡與陰陽五行", en: "The foundation of Chinese medicine" } },
              { zh: "周易", en: "Book of Changes", note: { zh: "八卦六十四卦與宇宙變化之道", en: "Hexagrams and the way of change" } },
            ].map((x) => (
              <div key={x.zh} className="rounded-lg border border-dashed border-border p-5 bg-card/40">
                <div className="text-lg font-semibold text-foreground/80">
                  {lang === "zh" ? x.zh : x.en}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {lang === "zh" ? x.note.zh : x.note.en}
                </div>
                <div className="mt-3 text-xs text-bronze">{t("preparing")}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export function SiteHeader() {
  const { lang, toggle } = useLang();
  const t = useT();
  return (
    <header className="border-b border-border/70 backdrop-blur bg-background/70 sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="seal text-xs h-9">丹</span>
          <span className="brand-title text-xl">
            {lang === "zh" ? "謝天地的修道丹心" : "Xie Tian Di"}
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }}>
            {t("nav_home")}
          </Link>
          <Link to="/shanhaijing" className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>
            {t("nav_shanhaijing")}
          </Link>
          <Link to="/daojia" className="text-muted-foreground hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>
            {t("nav_daojia")}
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-label={t("lang_switch_label")}
            className="inline-flex items-center justify-center h-8 min-w-[2.5rem] px-2 rounded-md border border-border bg-card/60 text-xs font-semibold tracking-wider text-foreground/80 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
          >
            {t("lang_switch")}
          </button>
        </nav>
      </div>
    </header>
  );
}

const socialLinks = [
  { name: "YouTube", href: "https://www.youtube.com/", label: "YT" },
  { name: "Instagram", href: "https://www.instagram.com/", label: "IG" },
  { name: "Facebook", href: "https://www.facebook.com/", label: "FB" },
  { name: "LINE", href: "https://line.me/", label: "LINE" },
];

export function SiteFooter() {
  const { lang } = useLang();
  const t = useT();
  return (
    <footer className="border-t border-border/70 mt-12">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()}{" "}
          {lang === "zh" ? "謝天地的修道丹心" : "Xie Tian Di"} · {t("footer_line")}
        </div>
        <div className="flex items-center gap-3">
          {socialLinks.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-border bg-card/60 px-3 text-xs font-medium tracking-wider text-foreground/80 hover:text-primary-foreground hover:bg-primary hover:border-primary transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function Divider() {
  return (
    <div className="divider-ornament">
      <span className="h-px flex-1 bg-border" />
      <span aria-hidden>❦</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export { LangProvider };
