import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findEpisode, allEpisodes, type Episode, type Chapter } from "@/content/daojia";
import { useLang, useT, pick } from "@/lib/i18n";
import { LangProvider } from "./index";

export const Route = createFileRoute("/daojia/$slug")({
  loader: ({ params }) => {
    const found = findEpisode(params.slug);
    if (!found) throw notFound();
    return found;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "篇章未找到" }] };
    const { episode, chapter } = loaderData;
    const title = `${episode.title.zh} · ${chapter.name.zh} · 道家心法`;
    const desc = `${episode.subtitle.zh}。${episode.sections[0]?.body.zh[0] ?? ""}`.slice(0, 155);
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
    <LangProvider>
      <NotFoundView />
    </LangProvider>
  ),
  errorComponent: ({ error, reset }) => (
    <LangProvider>
      <ErrorView error={error} reset={reset} />
    </LangProvider>
  ),
  component: EpisodePage,
});

function NotFoundView() {
  const t = useT();
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">{t("not_found_title")}</h1>
      <p className="mt-4 text-muted-foreground">{t("not_found_desc")}</p>
      <Link to="/daojia" className="mt-6 inline-block text-bronze underline underline-offset-4">
        {t("back_to")}
      </Link>
    </main>
  );
}

function ErrorView({ error, reset }: { error: Error; reset: () => void }) {
  const t = useT();
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">{t("load_failed")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">
        {t("retry")}
      </button>
    </main>
  );
}

function EpisodePage() {
  const { episode, chapter } = Route.useLoaderData() as { episode: Episode; chapter: Chapter };
  const { lang } = useLang();
  const t = useT();

  const idx = allEpisodes.findIndex((e) => e.slug === episode.slug);
  const prev = idx > 0 ? allEpisodes[idx - 1] : null;
  const next = idx < allEpisodes.length - 1 ? allEpisodes[idx + 1] : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <nav className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-foreground">{t("nav_home")}</Link>
        <span>／</span>
        <Link to="/daojia" className="hover:text-foreground">{t("nav_daojia")}</Link>
        <span>／</span>
        <span className="text-foreground/80">{pick(chapter.name, lang)}</span>
      </nav>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="seal text-xs h-12">{chapter.directionChar}</div>
          <div>
            <div className="text-xs tracking-widest text-bronze">
              {episode.ep} · {pick(chapter.name, lang)} · {episode.chapterPinyin}
            </div>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">{pick(episode.title, lang)}</h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{pick(episode.subtitle, lang)}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {pick(episode.tags, lang).map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border">
              {tag}
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
              <span className="text-bronze text-sm tracking-widest">{String(i + 1).padStart(2, "0")}</span>
              {pick(s.heading, lang)}
            </h2>
            <div className="space-y-4">
              {pick(s.body, lang).map((p, j) => (
                <p key={j} className="text-foreground/90 leading-loose text-[17px]" style={{ textIndent: "2em" }}>
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {episode.note && (
        <aside className="mt-14 rounded-lg border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
          <div className="text-bronze font-semibold mb-2">{t("note_label")}</div>
          {pick(episode.note, lang)}
        </aside>
      )}

      <nav className="mt-16 pt-8 border-t border-border grid gap-4 md:grid-cols-2">
        {prev ? (
          <Link to="/daojia/$slug" params={{ slug: prev.slug }} className="scroll-card p-4 group">
            <div className="text-xs text-bronze tracking-widest">← {t("prev_ep")} · {prev.ep}</div>
            <div className="mt-1 font-semibold group-hover:text-bronze transition-colors">{pick(prev.title, lang)}</div>
          </Link>
        ) : <div />}
        {next ? (
          <Link to="/daojia/$slug" params={{ slug: next.slug }} className="scroll-card p-4 text-right group">
            <div className="text-xs text-bronze tracking-widest">{t("next_ep")} · {next.ep} →</div>
            <div className="mt-1 font-semibold group-hover:text-bronze transition-colors">{pick(next.title, lang)}</div>
          </Link>
        ) : <div />}
      </nav>
    </main>
  );
}
