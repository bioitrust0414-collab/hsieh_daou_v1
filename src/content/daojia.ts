import { L, LA, type L as Loc, type LArr } from "@/lib/i18n";

export type Section = { heading: Loc; body: LArr };
export type Episode = {
  slug: string;
  ep: string;
  chapter: Loc;
  chapterPinyin: string;
  title: Loc;
  subtitle: Loc;
  tags: LArr;
  sections: Section[];
  note?: Loc;
};
export type Chapter = {
  key: string;
  name: Loc;
  direction: Loc;
  directionChar: string;
  intro: Loc;
  episodes: Episode[];
};

export const collectionMeta = {
  key: "daojia",
  href: "/daojia",
  index: L("典藏 · 02", "Volume · 02"),
  title: L("道家心法", "Daoist Practice"),
  pinyin: "Dào Jiā Xīn Fǎ",
  subtitle: L("節氣、聖山與內丹的修行檔案", "Solar terms, sacred mountains, and internal alchemy"),
  description: L(
    "從端午「地臘日」的逆天改命，到太上老君降臨鶴鳴山的天人交接，本典藏聚焦道教節氣、聖山與內丹修行的文化密碼。",
    "From reversing fate on the Duanwu 'Earth Rite Day' to Laozi's descent onto Mount Heming, this volume unpacks the cultural codes of Daoist solar terms, sacred mountains, and internal alchemy."
  ),
};

export const chapters: Chapter[] = [
  {
    key: "jieqi",
    name: L("節氣秘旨", "Solar-Term Secrets"),
    direction: L("時", "Time"),
    directionChar: "時",
    intro: L(
      "節氣不只是農時。道教將特定日子視為天地磁場最強的關口，端午五月初五的「地臘日」正是逆天改命的關鍵時刻。",
      "Solar terms are more than farming markers. In Daoism, certain days are gates when heaven-earth energy peaks — the fifth-of-the-fifth 'Earth Rite Day' being a key moment for reversing fate."
    ),
    episodes: [
      {
        slug: "ep01-dilari-nitian-gaiming",
        ep: "EP 01",
        chapter: L("節氣秘旨", "Solar-Term Secrets"),
        chapterPinyin: "Dì Là Rì",
        title: L("地臘日的逆天改命", "Reversing Fate on Earth Rite Day"),
        subtitle: L("五月初五端午節的道家隱藏身份與內丹修行", "The hidden Daoist identity of Duanwu and its internal alchemy"),
        tags: LA(["節氣", "內丹", "逆天改命", "水火既濟"], ["Solar Term", "Internal Alchemy", "Fate Reversal", "Water-Fire Balance"]),
        sections: [
          {
            heading: L("何謂「地臘日」", "What is 'Earth Rite Day'?"),
            body: LA(
              [
                "根據道教經典《道書》記載，五月初五是年度五個關鍵修行日(五臘)之一，稱為「地臘日」，具有特殊的時空維度。",
                "傳說這天五方五老(五帝)親自下凡，考察凡人的官祿功名與血氣榮衰，因此古人視這一天為可以「謝罪、求請移易官爵」的轉運日。",
              ],
              [
                "The Daoist canon marks the fifth day of the fifth lunar month as 'Earth Rite Day' — one of five key annual cultivation days, holding a special spacetime dimension.",
                "Legend says the Five Emperors descend to inspect mortals' rank, fortune, and vitality — making this a rare day for atoning, petitioning, and reversing fate.",
              ]
            ),
          },
          {
            heading: L("驅鬼與神秘磁場", "Warding Off Ghosts and the Mystical Field"),
            body: LA(
              [
                "古代修道者利用端午特殊的磁場修煉，除了祭祀先祖，還會懸掛「天師像」以驅除五月的惡氣、鬼魅與不祥。",
                "張天師在鶴鳴山或龍虎山煉丹時，往往能感召神媒護法；修煉者在端午靜坐，能更有效感應天地正氣。",
              ],
              [
                "Ancient cultivators harnessed Duanwu's magnetic field — beyond ancestral rites, they hung images of the Celestial Master to expel the fifth month's noxious air, ghosts, and misfortune.",
                "When Zhang Daoling refined elixirs on Mount Heming or Longhu, protectors would appear. Sitting in meditation on Duanwu, one absorbs heaven-earth's upright qi more efficiently.",
              ]
            ),
          },
          {
            heading: L("內丹心法：水火既濟", "Internal Alchemy: Water-Fire in Balance"),
            body: LA(
              [
                "五月天氣炎熱，陽氣達到頂峰，對應人體的「心火」。若心火過旺，會導致心神不寧、體力耗損。",
                "內丹修煉強調「降心火、升腎水」：透過靜坐，將意識收攝於下丹田(臍下)，讓上浮的火氣下沉，溫養精氣。",
                "這種「火入水鄉」的過程，能促使元神顯現，達到身心空明、與自然相應的境界。",
              ],
              [
                "The fifth month is the year's peak yang — mapping onto the body's 'heart-fire.' Excess heart-fire brings restlessness and drains vitality.",
                "Internal alchemy calls this 'lowering heart-fire, raising kidney-water': through seated meditation, focus is gathered in the lower dantian (below the navel), sinking floating fire to warm essence and qi.",
                "This 'fire entering the water country' lets the original spirit emerge — a state of clear body-mind resonant with nature.",
              ]
            ),
          },
          {
            heading: L("現代人的微修行", "A Modern Micro-Practice"),
            body: LA(
              [
                "清淨飲食：清淡飲食或齋戒，減少內臟負擔，為修行奠立乾淨的身體基礎。",
                "正身靜坐：保持頭脊正直，雙肩自然下沉，確保體內氣息運行順暢。",
                "腹式呼吸：吸氣時意想氣升頭頂，呼氣時氣降丹田。",
                "塞兌之法：靜坐時舌尖輕抵上顎，如嬰兒哺乳，接通陰陽二氣並化生津液。",
              ],
              [
                "Clean diet: eat lightly or fast to unburden the organs and lay a clean foundation.",
                "Upright seated posture: keep head and spine aligned, shoulders naturally lowered, so internal qi flows freely.",
                "Abdominal breathing: on the inhale, imagine qi rising to the crown; on the exhale, let it settle to the dantian.",
                "The 'sealed opening' method: rest the tongue-tip on the upper palate like a nursing infant — linking yin and yang and generating clear saliva.",
              ]
            ),
          },
        ],
        note: L(
          "本集據道教經典《道書》「三元五臘」條，並參張天師修煉事略綜合而成。",
          "Adapted from the 'Three Origins and Five Rites' section of the Daoist canon, with reference to accounts of Zhang Daoling's cultivation."
        ),
      },
    ],
  },
  {
    key: "shenshan",
    name: L("聖山神蹟", "Sacred Mountain Miracles"),
    direction: L("山", "Peak"),
    directionChar: "山",
    intro: L(
      "鶴鳴山與龍虎山不只是地理座標，而是道教「天人交接」的舞台。從外丹到內丹的演變，也在此地開展。",
      "Mounts Heming and Longhu are more than geographic points — they are stages of 'heaven-earth interface' in Daoism, where external alchemy gave way to internal."
    ),
    episodes: [
      {
        slug: "ep02-heming-taishang-jiangshi",
        ep: "EP 02",
        chapter: L("聖山神蹟", "Sacred Mountain Miracles"),
        chapterPinyin: "Hè Míng Shān",
        title: L("太上老君降臨鶴鳴山", "Laozi's Descent onto Mount Heming"),
        subtitle: L("五月十五：道教發源地的天人交接檔案", "The fifteenth of the fifth month — the founding of a religion"),
        tags: LA(["道教史", "煉丹", "外丹", "內丹", "正一派"], ["Daoist History", "Alchemy", "External Elixir", "Internal Elixir", "Zhengyi School"]),
        sections: [
          {
            heading: L("鶴鳴山的天人感應時刻", "The Moment of Heaven-Earth Resonance"),
            body: LA(
              [
                "東漢時期，太上老君於五月十五降臨四川鶴鳴山，被視為道教史上最重要的「天人交接」時刻。",
                "老君在此將《正一盟威秘籙》授予張道陵(張天師)，正式創立正一派，使鶴鳴山成為道教的發源地。",
              ],
              [
                "In the Eastern Han, on the fifteenth day of the fifth month, Laozi is said to have descended onto Mount Heming in Sichuan — the most significant 'heaven-earth interface' in Daoist history.",
                "There he transmitted the 'Zhengyi Covenant Secret Register' to Zhang Daoling, founding the Zhengyi School and making Heming the cradle of Daoism.",
              ]
            ),
          },
          {
            heading: L("丹成龍虎現", "Elixir Complete, Dragon and Tiger Appear"),
            body: LA(
              [
                "張天師在鶴鳴山與龍虎山煉丹修道，留下許多降妖伏魔的傳奇。",
                "傳說天師煉丹成時，感召「丹成而龍虎現」的異象——龍虎山因此得名。",
                "煉丹過程中，天帝甚至特遣財神趙公明前來守護丹爐，可見神界對煉丹大事的重視。",
              ],
              [
                "Zhang Daoling refined elixirs and cultivated the Way on Mounts Heming and Longhu, leaving many tales of subduing demons.",
                "It is said that when the elixir was complete, a dragon and tiger appeared — hence the name Mount Longhu (Dragon-Tiger).",
                "During refinement the Jade Emperor even sent the wealth god Zhao Gongming to guard the furnace — a measure of the divine world's regard for alchemy.",
              ]
            ),
          },
          {
            heading: L("從外丹到內丹", "From External to Internal Elixir"),
            body: LA(
              [
                "早期道士如張天師多煉製實體丹藥，稱為「外丹」，主要以金石為原料，希望長生不死、得道成神。",
                "隨著時代演進，修行者發現服用重金屬外丹具有風險，逐漸轉向以人體為爐鼎的「內丹」修煉。",
                "內丹將人體視為小宇宙，透過調理精、氣、神三寶，達到天人合一的生命提升。",
              ],
              [
                "Early Daoists like Zhang Daoling refined physical elixirs — 'external alchemy' — primarily from metals and minerals, in pursuit of immortality and godhood.",
                "Over centuries, the risks of ingesting heavy-metal elixirs pushed cultivators toward 'internal alchemy,' treating the body itself as furnace and cauldron.",
                "Internal alchemy sees the body as a microcosm; refining the 'three treasures' — jing (essence), qi, and shen (spirit) — brings unity with heaven.",
              ]
            ),
          },
          {
            heading: L("聖山的磁場與現代修行", "Sacred Fields and Modern Practice"),
            body: LA(
              [
                "鶴鳴山與龍虎山不僅是地理名山，更是具備特殊修行氣場的聖地。",
                "龍虎山至今絕壁上仍保留 2600 年前的「崖墓(懸棺)」之謎，增添濃厚的神秘色彩。",
                "現代修行者若能親臨或心念這些聖地靜坐，能更有效感應宇宙的「先天正氣」，體證「我命由我不由天」的修持境界。",
              ],
              [
                "Heming and Longhu are not just famous peaks — they hold a rare field of cultivation-energy.",
                "Longhu's cliffs still hold 2,600-year-old 'hanging coffin' cliff tombs — a mystery that deepens their aura.",
                "Meditating on-site or in mind's eye, a modern practitioner can better resonate with cosmic pre-heaven qi, embodying the maxim: 'my life is mine, not heaven's.'",
              ]
            ),
          },
        ],
        note: L(
          "本集據道教典籍與鶴鳴山、龍虎山傳承綜合整理。",
          "Synthesized from Daoist canonical sources and the lineage traditions of Mounts Heming and Longhu."
        ),
      },
    ],
  },
];

export const allEpisodes: Episode[] = chapters.flatMap((c) => c.episodes);

export function findEpisode(slug: string): { episode: Episode; chapter: Chapter } | null {
  for (const c of chapters) {
    const ep = c.episodes.find((e) => e.slug === slug);
    if (ep) return { episode: ep, chapter: c };
  }
  return null;
}
