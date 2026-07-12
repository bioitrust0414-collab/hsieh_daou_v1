import * as shanhaijing from "./shanhaijing";
import * as daojia from "./daojia";

export const collections = [
  { meta: shanhaijing.collectionMeta, chapters: shanhaijing.chapters, allEpisodes: shanhaijing.allEpisodes },
  { meta: daojia.collectionMeta, chapters: daojia.chapters, allEpisodes: daojia.allEpisodes },
];
