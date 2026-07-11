import { createFileRoute, Link } from "@tanstack/react-router";
import { chapters, collectionMeta, allEpisodes } from "@/content/shanhaijing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "謝天地的修道丹心 · 國學典籍講演筆記" },
      {
        name: "description",
        content:
          "謝天地的修道丹心：以講演筆記形式重構《山海經》等國學典籍，從地理、動物、植物、醫藥到神話，逐篇解構華夏先民的世界觀。",
      },
      { property: "og:title", content: "謝天地的修道丹心 · 國學典籍講演筆記" },
      {
        property: "og:description",
        content: "謝天地的修道丹心：以講演筆記形式重構《山海經》等國學典籍，從地理、動物、植物、醫藥到神話，逐篇解構華夏先民的世界觀。",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pb-24">
        {/* Hero */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="absolute right-4 top-16 hidden md:block">
            <div className="seal text-lg">國學典藏</div>
          </div>
          <p className="text-sm tracking-[0.4em] text-bronze mb-6">
            XIÈ · TIĀN · DÌ
          </p>
          <h1 className="brand-title text-6xl md:text-8xl font-normal text-foreground leading-tight">
            謝天地的修道丹心
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            以講演筆記為體，以古籍為骨。從《山海經》開始，逐篇重構上古文明的地理、生物、醫藥與神話。
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/shanhaijing"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              進入《山海經》系列
              <span aria-hidden>→</span>
            </Link>
            <div className="text-sm text-muted-foreground">
              目前收錄 <span className="text-foreground font-medium">{allEpisodes.length}</span> 集講演 · 共 {chapters.length} 篇
            </div>
          </div>
        </section>

        <Divider />

        {/* Current collection */}
        <section className="py-16">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <p className="text-sm tracking-widest text-bronze mb-2">當期典藏 · 01</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                {collectionMeta.title}
              </h2>
              <p className="mt-2 text-muted-foreground">{collectionMeta.subtitle}</p>
            </div>
          </div>

          <p className="max-w-3xl text-foreground/85 leading-loose mb-12">
            {collectionMeta.description}
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {chapters.map((c) => (
              <Link
                key={c.key}
                to="/shanhaijing"
                className="scroll-card p-6 group transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs tracking-widest text-bronze">
                      {c.direction}方 · CHAPTER
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold">{c.name}</h3>
                  </div>
                  <div className="seal text-xs h-14">{c.direction}</div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                  {c.intro}
                </p>
                <div className="mt-5 pt-4 border-t border-border/70 text-xs text-bronze flex items-center gap-2">
                  {c.episodes.length} 集講演
                  <span aria-hidden className="ml-auto transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <Divider />

        {/* Coming soon */}
        <section className="py-16">
          <p className="text-sm tracking-widest text-bronze mb-3">待啟卷宗</p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">後續典藏</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "海外經", note: "四方海外的異域與神話疆界" },
              { name: "海內經", note: "封域之內的邦國、山川與物產" },
              { name: "大荒經", note: "洪荒盡頭的神系譜與創世神話" },
            ].map((x) => (
              <div
                key={x.name}
                className="rounded-lg border border-dashed border-border p-5 bg-card/40"
              >
                <div className="text-lg font-semibold text-foreground/80">
                  {x.name}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{x.note}</div>
                <div className="mt-3 text-xs text-bronze">籌備中</div>
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
  return (
    <header className="border-b border-border/70 backdrop-blur bg-background/70 sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="seal text-xs h-9">丹</span>
          <span className="brand-title text-xl">謝天地的修道丹心</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
            activeProps={{ className: "text-foreground" }}
            activeOptions={{ exact: true }}
          >
            首頁
          </Link>
          <Link
            to="/shanhaijing"
            className="text-muted-foreground hover:text-foreground transition-colors"
            activeProps={{ className: "text-foreground" }}
          >
            山海經
          </Link>
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
  return (
    <footer className="border-t border-border/70 mt-12">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} 謝天地的修道丹心 · 以講演之筆重繪古卷
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
