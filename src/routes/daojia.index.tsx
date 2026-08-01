import { createFileRoute, Link } from "@tanstack/react-router";
import { chapters, collectionMeta } from "@/content/daojia";
import { useLang, useT, pick } from "@/lib/i18n";
import { BrushTitle } from "@/components/brush-title";

export const Route = createFileRoute("/daojia/")({
  head: () => ({
    meta: [
      { title: "道家心法講演筆記 · 國學知識庫" },
      {
        name: "description",
        content: "道家心法系列：從端午地臘日的逆天改命到太上老君降臨鶴鳴山，聚焦節氣、聖山與內丹修行。",
      },
      { property: "og:title", content: "道家心法 · Daoist Practice" },
      { property: "og:description", content: collectionMeta.description.zh },
    ],
  }),
  component: DaojiaIndex,
});

function DaojiaIndex() {
  const { lang } = useLang();
  const t = useT();
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-14">
        <p className="text-sm tracking-[0.4em] text-bronze mb-4">
          {collectionMeta.pinyin.toUpperCase()} · {pick(collectionMeta.index, lang).toUpperCase()}
        </p>
        <BrushTitle
          name="daojia"
          label={pick(collectionMeta.title, lang)}
          className="text-foreground"
          height="clamp(3rem, 8vw, 5rem)"
        />
        <p className="mt-4 text-lg text-muted-foreground">{pick(collectionMeta.subtitle, lang)}</p>
        <p className="mt-6 max-w-3xl text-foreground/85 leading-loose">
          {pick(collectionMeta.description, lang)}
        </p>
      </div>

      <div className="space-y-16">
        {chapters.map((c) => (
          <section key={c.key} id={c.key}>
            <div className="flex items-center gap-4 mb-6">
              <span className="seal-square h-14 w-14 shrink-0 text-2xl">{c.directionChar}</span>
              <div>
                <div className="text-xs tracking-widest text-bronze">{pick(c.direction, lang)}</div>
                <h2 className="text-3xl font-semibold">{pick(c.name, lang)}</h2>
              </div>
            </div>
            <p className="text-foreground/80 leading-loose max-w-3xl mb-8 pl-1">
              {pick(c.intro, lang)}
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {c.episodes.map((ep) => (
                <Link
                  key={ep.slug}
                  to="/daojia/$slug"
                  params={{ slug: ep.slug }}
                  className="scroll-card p-6 group transition-transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between text-xs text-bronze tracking-widest mb-3">
                    <span>{ep.ep}</span>
                    <span>{pick(c.name, lang)}</span>
                  </div>
                  <h3 className="text-xl font-semibold leading-snug">{pick(ep.title, lang)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {pick(ep.subtitle, lang)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pick(ep.tags, lang).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 pt-3 border-t border-border/70 text-xs text-bronze flex items-center">
                    {t("read_open")}
                    <span aria-hidden className="ml-auto transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
