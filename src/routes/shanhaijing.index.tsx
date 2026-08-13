import { createFileRoute, Link } from "@tanstack/react-router";
import { chapters, collectionMeta } from "@/content/shanhaijing";
import { useLang, useT, pick } from "@/lib/i18n";
import { BrushTitle } from "@/components/brush-title";
import {
  articleReadingLabel,
  extendedShanhaijingChapters,
  getPublishedShanhaijingArticles,
  getShanhaijingChapterGroup,
  type PublishedArticle,
} from "@/lib/published-articles";

export const Route = createFileRoute("/shanhaijing/")({
  loader: async () => ({ publishedArticles: await getPublishedShanhaijingArticles() }),
  head: () => ({
    meta: [
      { title: "山海經講演筆記 · 國學知識庫" },
      {
        name: "description",
        content: "《山海經》講演系列：從南山經至大荒經，收錄精選導讀與完整講演。",
      },
      { property: "og:title", content: "山海經講演筆記 · Shan Hai Jing Lectures" },
      { property: "og:description", content: collectionMeta.description.zh },
    ],
  }),
  component: ShanhaijingIndex,
});

function PublishedLectureCard({ article }: { article: PublishedArticle }) {
  return (
    <Link
      to="/shanhaijing/$slug"
      params={{ slug: article.slug }}
      className="scroll-card p-6 group transition-transform hover:-translate-y-1 border-bronze/40 bg-card/70"
    >
      <div className="flex items-center justify-between text-xs text-bronze tracking-widest mb-3">
        <span className="rounded-sm border border-bronze/50 px-2 py-1 text-[10px] font-semibold">
          新卷 · 完整講演
        </span>
        <span>{article.episode}</span>
      </div>
      <h3 className="text-xl font-semibold leading-snug">{article.title_zh}</h3>
      {article.subtitle_zh && (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{article.subtitle_zh}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-5 pt-3 border-t border-border/70 text-xs text-bronze flex items-center">
        <span>{articleReadingLabel(article)}</span>
        <span aria-hidden className="ml-auto transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}

function ShanhaijingIndex() {
  const { lang } = useLang();
  const t = useT();
  const { publishedArticles } = Route.useLoaderData();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-14">
        <p className="text-sm tracking-[0.4em] text-bronze mb-4">
          {collectionMeta.pinyin.toUpperCase()} · {pick(collectionMeta.index, lang).toUpperCase()}
        </p>
        <BrushTitle
          name="shanhaijing"
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
        {chapters.map((chapter) => {
          const publishedForChapter = publishedArticles.filter(
            (article) => getShanhaijingChapterGroup(article.chapter_key) === chapter.key,
          );

          return (
            <section key={chapter.key} id={chapter.key}>
              <div className="flex items-center gap-4 mb-6">
                <span className="seal-square h-14 w-14 shrink-0 text-2xl">
                  {chapter.directionChar}
                </span>
                <div>
                  <div className="text-xs tracking-widest text-bronze">
                    {pick(chapter.direction, lang)}
                  </div>
                  <h2 className="text-3xl font-semibold">{pick(chapter.name, lang)}</h2>
                </div>
              </div>
              <p className="text-foreground/80 leading-loose max-w-3xl mb-8 pl-1">
                {pick(chapter.intro, lang)}
              </p>

              <div className="grid gap-5 md:grid-cols-2">
                {chapter.episodes.map((episode) => (
                  <Link
                    key={episode.slug}
                    to="/shanhaijing/$slug"
                    params={{ slug: episode.slug }}
                    className="scroll-card p-6 group transition-transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between text-xs text-bronze tracking-widest mb-3">
                      <span>{episode.ep}</span>
                      <span>{pick(chapter.name, lang)}</span>
                    </div>
                    <h3 className="text-xl font-semibold leading-snug">
                      {pick(episode.title, lang)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {pick(episode.subtitle, lang)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {pick(episode.tags, lang).map((tag) => (
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
                      <span
                        aria-hidden
                        className="ml-auto transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                ))}
                {publishedForChapter.map((article) => (
                  <PublishedLectureCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          );
        })}

        {extendedShanhaijingChapters.map((chapter) => {
          const publishedForChapter = publishedArticles.filter(
            (article) => getShanhaijingChapterGroup(article.chapter_key) === chapter.key,
          );
          if (publishedForChapter.length === 0) return null;

          return (
            <section key={chapter.key} id={chapter.key}>
              <div className="flex items-center gap-4 mb-6">
                <span className="seal-square h-14 w-14 shrink-0 text-2xl">
                  {chapter.directionChar}
                </span>
                <div>
                  <div className="text-xs tracking-widest text-bronze">{chapter.direction}</div>
                  <h2 className="text-3xl font-semibold">{chapter.name}</h2>
                </div>
              </div>
              <p className="text-foreground/80 leading-loose max-w-3xl mb-8 pl-1">
                {chapter.intro}
              </p>
              <div className="grid gap-5 md:grid-cols-2">
                {publishedForChapter.map((article) => (
                  <PublishedLectureCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
