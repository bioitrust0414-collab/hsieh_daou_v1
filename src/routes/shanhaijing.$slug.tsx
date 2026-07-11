import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findEpisode, allEpisodes } from "@/content/shanhaijing";

export const Route = createFileRoute("/shanhaijing/$slug")({
  loader: ({ params }) => {
    const found = findEpisode(params.slug);
    if (!found) throw notFound();
    return found;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "篇章未找到" }] };
    const { episode, chapter } = loaderData;
    const title = `${episode.title} · ${chapter.name} · 山海經`;
    const desc = `${episode.subtitle}。${episode.sections[0]?.body[0] ?? ""}`.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">篇章未找到</h1>
      <p className="mt-4 text-muted-foreground">此卷尚未收錄，或連結有誤。</p>
      <Link
        to="/shanhaijing"
        className="mt-6 inline-block text-bronze underline underline-offset-4"
      >
        返回《山海經》目錄
      </Link>
    </main>
  ),
  errorComponent: ({ error, reset }) => (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">載入失敗</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <button
        onClick={reset}
        className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        重試
      </button>
    </main>
  ),
  component: EpisodePage,
});

function EpisodePage() {
  const { episode, chapter } = Route.useLoaderData();

  const idx = allEpisodes.findIndex((e) => e.slug === episode.slug);
  const prev = idx > 0 ? allEpisodes[idx - 1] : null;
  const next = idx < allEpisodes.length - 1 ? allEpisodes[idx + 1] : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <nav className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-foreground">
          首頁
        </Link>
        <span>／</span>
        <Link to="/shanhaijing" className="hover:text-foreground">
          山海經
        </Link>
        <span>／</span>
        <span className="text-foreground/80">{chapter.name}</span>
      </nav>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="seal text-xs h-12">{chapter.direction}</div>
          <div>
            <div className="text-xs tracking-widest text-bronze">
              {episode.ep} · {chapter.name} · {episode.chapterPinyin}
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
          {episode.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {episode.subtitle}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {episode.tags.map((t) => (
            <span
              key={t}
              className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border"
            >
              {t}
            </span>
          ))}
        </div>
      </header>

      <div className="divider-ornament mb-12">
        <span className="h-px flex-1 bg-border" />
        <span aria-hidden>❦</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <article className="space-y-10">
        {episode.sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-baseline gap-3">
              <span className="text-bronze text-sm tracking-widest">
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.heading}
            </h2>
            <div className="space-y-4">
              {s.body.map((p, j) => (
                <p
                  key={j}
                  className="text-foreground/90 leading-loose text-[17px]"
                  style={{ textIndent: "2em" }}
                >
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {episode.note && (
        <aside className="mt-14 rounded-lg border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
          <div className="text-bronze font-semibold mb-2">按語</div>
          {episode.note}
        </aside>
      )}

      <nav className="mt-16 pt-8 border-t border-border grid gap-4 md:grid-cols-2">
        {prev ? (
          <Link
            to="/shanhaijing/$slug"
            params={{ slug: prev.slug }}
            className="scroll-card p-4 group"
          >
            <div className="text-xs text-bronze tracking-widest">← 上一集 · {prev.ep}</div>
            <div className="mt-1 font-semibold group-hover:text-bronze transition-colors">
              {prev.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            to="/shanhaijing/$slug"
            params={{ slug: next.slug }}
            className="scroll-card p-4 text-right group"
          >
            <div className="text-xs text-bronze tracking-widest">下一集 · {next.ep} →</div>
            <div className="mt-1 font-semibold group-hover:text-bronze transition-colors">
              {next.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </main>
  );
}
