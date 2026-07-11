import { createFileRoute, Link } from "@tanstack/react-router";
import { chapters, collectionMeta } from "@/content/shanhaijing";

export const Route = createFileRoute("/shanhaijing/")({
  head: () => ({
    meta: [
      { title: "山海經講演筆記 · 國學知識庫" },
      {
        name: "description",
        content:
          "《山海經》講演系列：南山經、西山經、北山經、東山經、中山經共 10 集，逐篇解讀上古地理、動物、植物、醫藥、巫術與神話。",
      },
      { property: "og:title", content: "山海經講演筆記" },
      { property: "og:description", content: collectionMeta.description },
    ],
  }),
  component: ShanhaijingIndex,
});

function ShanhaijingIndex() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-14">
        <p className="text-sm tracking-[0.4em] text-bronze mb-4">
          SHĀN HǍI JĪNG · 典藏 01
        </p>
        <h1 className="text-5xl md:text-6xl font-semibold">{collectionMeta.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{collectionMeta.subtitle}</p>
        <p className="mt-6 max-w-3xl text-foreground/85 leading-loose">
          {collectionMeta.description}
        </p>
      </div>

      <div className="space-y-16">
        {chapters.map((c) => (
          <section key={c.key} id={c.key}>
            <div className="flex items-center gap-4 mb-6">
              <div className="seal text-sm h-16">{c.direction}</div>
              <div>
                <div className="text-xs tracking-widest text-bronze">
                  {c.direction}方山系
                </div>
                <h2 className="text-3xl font-semibold">{c.name}</h2>
              </div>
            </div>
            <p className="text-foreground/80 leading-loose max-w-3xl mb-8 pl-1">
              {c.intro}
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {c.episodes.map((ep) => (
                <Link
                  key={ep.slug}
                  to="/shanhaijing/$slug"
                  params={{ slug: ep.slug }}
                  className="scroll-card p-6 group transition-transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between text-xs text-bronze tracking-widest mb-3">
                    <span>{ep.ep}</span>
                    <span>{c.name}</span>
                  </div>
                  <h3 className="text-xl font-semibold leading-snug">
                    {ep.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {ep.subtitle}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {ep.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 pt-3 border-t border-border/70 text-xs text-bronze flex items-center">
                    展卷閱讀
                    <span
                      aria-hidden
                      className="ml-auto transition-transform group-hover:translate-x-1"
                    >
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
