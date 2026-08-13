import { supabase } from "@/lib/supabase";

export type PublishedArticleSection = {
  heading: string;
  body: string[];
};

export type PublishedArticle = {
  id: string;
  source_article_id: string | null;
  slug: string;
  collection: string;
  chapter_key: string | null;
  episode: string;
  title_zh: string;
  subtitle_zh: string | null;
  summary_zh: string | null;
  sections: PublishedArticleSection[];
  tags: string[];
  content_type: string;
  visibility: "public" | "members";
  published_at: string | null;
  updated_at: string;
};

type ArticleRow = Omit<PublishedArticle, "sections" | "visibility"> & {
  sections: unknown;
  visibility: string;
};

const PUBLISHED_ARTICLE_FIELDS = [
  "id",
  "source_article_id",
  "slug",
  "collection",
  "chapter_key",
  "episode",
  "title_zh",
  "subtitle_zh",
  "summary_zh",
  "sections",
  "tags",
  "content_type",
  "visibility",
  "published_at",
  "updated_at",
].join(",");

function parseSections(value: unknown): PublishedArticleSection[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((section) => {
    if (!section || typeof section !== "object") return [];
    const record = section as Record<string, unknown>;
    const heading = typeof record.heading === "string" ? record.heading.trim() : "";
    const body = Array.isArray(record.body)
      ? record.body.filter(
          (paragraph): paragraph is string =>
            typeof paragraph === "string" && paragraph.trim().length > 0,
        )
      : [];

    return heading || body.length > 0 ? [{ heading: heading || "講演內容", body }] : [];
  });
}

function normaliseArticle(row: ArticleRow): PublishedArticle {
  return {
    ...row,
    tags: Array.isArray(row.tags) ? row.tags : [],
    visibility: row.visibility === "members" ? "members" : "public",
    sections: parseSections(row.sections),
  };
}

/**
 * 只讀取已公開、公開權限的文章。即使前端帶入其他 slug，資料庫 RLS 與
 * publication_status 條件也會阻擋 review、approved、members 或 archived 內容。
 */
export async function getPublishedShanhaijingArticles(): Promise<PublishedArticle[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("articles")
    .select(PUBLISHED_ARTICLE_FIELDS)
    .eq("collection", "shanhaijing")
    .eq("is_published", true)
    .eq("publication_status", "published")
    .eq("visibility", "public")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[supabase] failed to load published Shan Hai Jing articles:", error.message);
    return [];
  }

  return (data as ArticleRow[]).map(normaliseArticle);
}

export async function getPublishedShanhaijingArticle(
  slug: string,
): Promise<PublishedArticle | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("articles")
    .select(PUBLISHED_ARTICLE_FIELDS)
    .eq("collection", "shanhaijing")
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("publication_status", "published")
    .eq("visibility", "public")
    .maybeSingle();

  if (error) {
    console.error("[supabase] failed to load published Shan Hai Jing article:", error.message);
    return null;
  }

  return data ? normaliseArticle(data as ArticleRow) : null;
}

export function articleReadingLabel(article: PublishedArticle): string {
  const sectionCount = article.sections.length;
  return sectionCount > 0 ? `完整講演 · ${sectionCount} 節` : "完整講演";
}
