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
  key: "shanhaijing",
  href: "/shanhaijing",
  index: L("典藏 · 01", "Volume · 01"),
  title: L("山海經", "Shan Hai Jing"),
  pinyin: "Shān Hǎi Jīng",
  subtitle: L("上古社會生活的百科全書", "An encyclopedia of ancient Chinese life"),
  description: L(
    "《山海經》橫跨地理、動物、植物、醫學、巫術與神話，是理解華夏先民世界觀的關鍵典籍。此系列以講演筆記的形式，逐篇解構其中的文化密碼。",
    "The Shan Hai Jing spans geography, zoology, botany, medicine, shamanism, and myth — a key text for understanding the worldview of early Chinese civilization. This series unpacks its cultural codes in lecture-note form."
  ),
};

export const chapters: Chapter[] = [
  {
    key: "nan",
    name: L("南山經", "Southern Mountains"),
    direction: L("南", "South"),
    directionChar: "南",
    intro: L(
      "南方多雨多山，濕熱的環境催生豐富的生物觀測，也孕育出以怪獸預言與草木食療為核心的文化心理。",
      "The rainy, mountainous south nurtured rich biological observation and a cultural imagination centered on prophetic beasts and herbal medicine."
    ),
    episodes: [
      {
        slug: "ep01-guaishou-yuyan",
        ep: "EP 01",
        chapter: L("南山經", "Southern Mountains"),
        chapterPinyin: "Nán Shān Jīng",
        title: L("怪獸預言家", "Beasts as Prophets"),
        subtitle: L("南方生物與社會徵兆的文化關聯", "Southern creatures as omens of social change"),
        tags: LA(["神話", "文化心理", "天人感應"], ["Myth", "Cultural Psychology", "Cosmic Resonance"]),
        sections: [
          {
            heading: L("預言家角色", "The Role of the Prophet"),
            body: LA(
              ["《南山經》記載中，許多怪獸的出現與環境變化息息相關。有的預示大水(水災)，有的則預示大旱或戰爭。這反映了楚地或巴蜀先民對自然規律的原始觀察與恐懼。"],
              ["In the Southern Mountains chapter, many strange beasts appear alongside environmental shifts — some foreshadow floods, others drought or war. This reflects the early observations and anxieties of the Chu and Ba-Shu peoples toward the rhythms of nature."]
            ),
          },
          {
            heading: L("文化心理分析", "Cultural Psychology"),
            body: LA(
              ["古人為何將「長相怪異」與「災難」掛鉤？這種怪獸預言，實際上是早期人類試圖在混亂的自然界中，尋找秩序與預警機制的一種體現。"],
              ["Why did ancient people link 'strange appearance' with 'catastrophe'? These monster prophecies were an early attempt to find order and an early-warning system within a chaotic natural world."]
            ),
          },
          {
            heading: L("地理環境的投射", "Projection of the Landscape"),
            body: LA(
              ["南方多雨、多山、多森林。這種濕熱且多變的環境，催生了豐富的生物多樣性觀測，進而演化成神祕的預言文化。"],
              ["The south's humid, forested terrain produced rich biodiversity — which in turn evolved into a mystical culture of prophecy."]
            ),
          },
        ],
      },
      {
        slug: "ep02-shangu-shiliao",
        ep: "EP 02",
        chapter: L("南山經", "Southern Mountains"),
        chapterPinyin: "Nán Shān Jīng",
        title: L("上古食療學", "Archaic Food Therapy"),
        subtitle: L("南方山系的醫學效用與生存智慧", "Medicinal uses and survival wisdom of the southern ranges"),
        tags: LA(["醫學", "植物", "藥食同源"], ["Medicine", "Botany", "Food-as-Medicine"]),
        sections: [
          {
            heading: L("「藥食同源」的起源", "Origin of 'Food-as-Medicine'"),
            body: LA(
              ["《山海經》包含大量醫學內容。《南山經》中許多動植物的描述末尾都會加上「服之⋯⋯」(吃了它可以⋯⋯)或「佩之⋯⋯」(佩戴它可以⋯⋯)，是藥食同源思想的早期形態。"],
              ["Descriptions of plants and animals often end with 'eating it will...' or 'wearing it will...' — an early formulation of the Chinese idea that food and medicine share the same source."]
            ),
          },
          {
            heading: L("具體醫學功能", "Specific Medicinal Functions"),
            body: LA(
              [
                "抗飢與抗疲勞：南方山系中有哪些植物被記載能讓人「不飢」或「增強體力」？這在遠古艱苦的遷徙與狩獵生活中至關重要。",
                "心理與精神治療：古人如何利用自然物來緩解恐懼、憂慮或治療癲狂？此處展現了早期巫醫合一的醫學雛形。",
              ],
              [
                "Anti-hunger and anti-fatigue: which southern plants were recorded to 'stave off hunger' or 'increase stamina'? Vital knowledge for migration and hunting.",
                "Mental and spiritual healing: how did ancients use nature to soothe fear, worry, or madness? An embryonic form of the shaman-doctor tradition.",
              ]
            ),
          },
          {
            heading: L("環境適應的實踐", "Adapting to the Environment"),
            body: LA(
              ["這不只是醫療，更是一種生存策略。透過識別南方的草木，先民建立了一套與自然和諧共生的食療傳統，也成為後世中醫藥學的遙遠源頭。"],
              ["More than medicine, this was a survival strategy — a food-therapy tradition that would become a distant root of Chinese medicine."]
            ),
          },
        ],
      },
    ],
  },
  {
    key: "xi",
    name: L("西山經", "Western Mountains"),
    direction: L("西", "West"),
    directionChar: "西",
    intro: L(
      "以崑崙山為核心的西方山系，交織著地理險峻與神話權力，是先民想像中「眾神辦公室」與礦藏原始地圖的所在。",
      "Centered on Mount Kunlun, the western ranges weave together rugged geography and mythic authority — the imagined seat of the gods and an early map of mineral wealth."
    ),
    episodes: [
      {
        slug: "ep03-kunlun-quanli",
        ep: "EP 03",
        chapter: L("西山經", "Western Mountains"),
        chapterPinyin: "Xī Shān Jīng",
        title: L("崑崙山的權力圖譜", "The Power Map of Kunlun"),
        subtitle: L("從地理角度看西王母與眾神居所的神聖化", "How geography sanctified the Queen Mother of the West and her divine court"),
        tags: LA(["地理", "神話", "西王母"], ["Geography", "Myth", "Queen Mother of the West"]),
        sections: [
          {
            heading: L("地理座標的神聖化", "Sanctifying Geographic Coordinates"),
            body: LA(
              ["西方山系以崑崙山為核心，在古人的認知中不僅是地理上的高點，更是「眾神之居」。將高大山脈視為天梯或神靈辦公室的傾向，是透過險峻的山川與奇特的動植物被逐步建構出來的。"],
              ["Kunlun anchors the western ranges — not merely a geographic peak, but the 'dwelling of the gods.' The tendency to treat towering mountains as ladders to heaven was built up through rugged terrain and strange flora and fauna."]
            ),
          },
          {
            heading: L("西王母形象與領地權威", "The Queen Mother and Territorial Authority"),
            body: LA(
              ["西王母作為西方山系的代表神祇，其居所的描述體現了早期文明對西方邊境的想像與敬畏。這可視為一種「神話地理學」，將未知的西方疆域賦予秩序感與權力結構。"],
              ["The Queen Mother of the West embodies early civilization's awe of the western frontier — a 'mythological geography' that imposed order and power structure on the unknown."]
            ),
          },
          {
            heading: L("眾神居所的行政隱喻", "The Divine Court as Administration"),
            body: LA(
              ["透過分析西方各山之神的分布，可以看見先民如何利用地理空間，模擬一套上古的社會管理模式。"],
              ["The distribution of mountain gods mirrors an archaic model of social administration mapped onto geographic space."]
            ),
          },
        ],
      },
      {
        slug: "ep04-yuangu-kuangjin",
        ep: "EP 04",
        chapter: L("西山經", "Western Mountains"),
        chapterPinyin: "Xī Shān Jīng",
        title: L("遠古礦金學", "Archaic Metallurgy"),
        subtitle: L("西方山脈中金、玉、青碧等礦產的原始分佈規律", "The primal distribution of gold, jade, and turquoise in the western ranges"),
        tags: LA(["科技史", "礦產", "資源地圖"], ["History of Technology", "Minerals", "Resource Map"]),
        sections: [
          {
            heading: L("原始資源地圖", "A Primal Resource Map"),
            body: LA(
              ["《西山經》對礦產的記錄極為詳盡，尤其著重於「金、玉、青碧」等礦物的空間分布描述。這反映了當時楚國或巴蜀人對於資源開發的高度重視。"],
              ["The Western Mountains records minerals in extraordinary detail — especially the spatial distribution of gold, jade, and turquoise — reflecting the value early Chu and Ba-Shu peoples placed on resource development."]
            ),
          },
          {
            heading: L("礦產與文明發展", "Minerals and Civilization"),
            body: LA(
              ["從科技史的角度看，這些礦產記錄不僅是神話，更反映先民對物質屬性的初步分類。哪些山產「黃金」、哪些山產「美玉」，這些資訊在古代社會的貿易與祭祀(如製作玉器祭神)中具有高度實用價值。"],
              ["More than myth, these records reflect an early classification of material properties. Knowing which mountains yielded gold or fine jade had real value for trade and ritual — e.g. crafting jade objects for sacrifice."]
            ),
          },
          {
            heading: L("環境與物產的共生觀", "Environment and Yield in Symbiosis"),
            body: LA(
              ["《西山經》如何將特定地理環境(如水流方向、山體植被)與礦藏連結？這展現了早期先民對自然界共生規律的樸素觀察。"],
              ["How did the text link specific terrain — water flow, vegetation — to mineral deposits? An early, plain-spoken observation of nature's symbiotic patterns."]
            ),
          },
        ],
      },
    ],
  },
  {
    key: "bei",
    name: L("北山經", "Northern Mountains"),
    direction: L("北", "North"),
    directionChar: "北",
    intro: L(
      "北方寒冷而荒涼，卻孕育了先民對生命韌性的想像，也建構出對大河源頭與世界邊界最早的地理骨架。",
      "The cold, barren north gave rise to imaginings of life's resilience and the earliest geographic skeleton of great rivers and world boundaries."
    ),
    episodes: [
      {
        slug: "ep05-huangyuan-renxing",
        ep: "EP 05",
        chapter: L("北山經", "Northern Mountains"),
        chapterPinyin: "Běi Shān Jīng",
        title: L("荒原中的生命韌性", "Resilience on the Wastelands"),
        subtitle: L("北方寒冷地帶奇特生物的生存適應", "How strange creatures adapted to the frozen north"),
        tags: LA(["動物", "生態", "志怪"], ["Zoology", "Ecology", "Strange Tales"]),
        sections: [
          {
            heading: L("極端環境的觀察者", "Observers of Extreme Environments"),
            body: LA(
              ["作為一部志怪古籍，《山海經》記錄了許多生存在北方山系的奇特生物。這些生物的型態描述，如何反映對「寒冷」或「荒涼」環境的適應，是本集的核心。"],
              ["As a book of strange tales, the Shan Hai Jing records many peculiar creatures of the northern ranges. How their forms reflect adaptation to cold and desolation is the heart of this episode."]
            ),
          },
          {
            heading: L("生命力的象徵與隱喻", "Symbolism of Vitality"),
            body: LA(
              ["透過這些生物的記載，可以理解古人如何看待生命在惡劣條件下的延續。這不僅是「志怪」描述，更反映了上古先民對北方疆域的一種生命力投射，將其視為充滿挑戰卻也生機勃勃的土地。"],
              ["Through these records we glimpse how ancients viewed life's persistence in harsh conditions — projecting vitality onto the challenging but living land of the north."]
            ),
          },
          {
            heading: L("生存智慧的紀錄", "Records of Survival Wisdom"),
            body: LA(
              ["在北方的荒原中，哪些動植物被記載具有療效或特殊的生存價值(如禦寒、辟邪)？這是理解上古社會生活的重要切入點。"],
              ["Which northern plants and animals were recorded as medicinal or protective — warding off cold, warding off evil? An essential window into ancient daily life."]
            ),
          },
        ],
      },
      {
        slug: "ep06-dahe-suyuan",
        ep: "EP 06",
        chapter: L("北山經", "Northern Mountains"),
        chapterPinyin: "Běi Shān Jīng",
        title: L("大河之源的地理溯源", "Tracing the Great River's Source"),
        subtitle: L("古人對北方水系發源地的原始認知", "Ancient understandings of where the north's waters begin"),
        tags: LA(["地理", "水利", "宇宙觀"], ["Geography", "Hydrology", "Cosmology"]),
        sections: [
          {
            heading: L("北方地理的骨架", "The Northern Geographic Skeleton"),
            body: LA(
              ["《北山經》詳盡記錄了各座山脈的相對位置與水流去向。古人透過「山」與「水」的連結，勾勒出一幅原始的北方地圖。"],
              ["The Northern Mountains meticulously records each range's location and river directions — an early map drawn by linking peak to stream."]
            ),
          },
          {
            heading: L("水利與科技萌芽", "Hydrology as Nascent Technology"),
            body: LA(
              ["《山海經》對河川源頭的追溯——某水出於某山，向東或向北流——展現了早期先民對自然地理規律的初步總結。對「發源地」的執著，反映了華夏文明早期對水資源管理與環境觀測的重視。"],
              ["Tracing rivers to their mountain sources — flowing east, flowing north — shows an early summary of geographic law. The obsession with 'origin' reflects early Chinese civilization's concern for water management."]
            ),
          },
          {
            heading: L("原始的宇宙地理觀", "A Primal Cosmological Geography"),
            body: LA(
              ["北方水系的源頭往往與神聖的山脈相連。分析這些河流如何匯入北方的大海或沼澤，可以揭示當時人們對北方邊界乃至整個世界架構的原始認知。"],
              ["Northern rivers spring from sacred peaks. How they flow into northern seas and marshes reveals the ancients' picture of the world's frame."]
            ),
          },
        ],
      },
    ],
  },
  {
    key: "dong",
    name: L("東山經", "Eastern Mountains"),
    direction: L("東", "East"),
    directionChar: "東",
    intro: L(
      "東方臨海，鳥類與海濱生物構成獨特的生態誌，而祭祀山神的儀軌則揭示先民與土地訂立契約的方式。",
      "Facing the sea, the eastern ranges yield a unique record of birds and coastal life — and rituals to mountain gods that reveal how ancients contracted with the land."
    ),
    episodes: [
      {
        slug: "ep07-haibin-niaolei",
        ep: "EP 07",
        chapter: L("東山經", "Eastern Mountains"),
        chapterPinyin: "Dōng Shān Jīng",
        title: L("海濱山系的鳥類誌", "An Ornithology of the Coast"),
        subtitle: L("東方山脈中羽族奇禽的型態與象徵", "The forms and symbolism of strange birds in the eastern ranges"),
        tags: LA(["動物", "神話", "海濱生態"], ["Zoology", "Myth", "Coastal Ecology"]),
        sections: [
          {
            heading: L("東方生態的觀察記錄", "Records of an Eastern Ecology"),
            body: LA(
              ["《東山經》地理位置靠近海洋，記載的鳥類往往展現了與水域、海濱相關的型態，成為理解東部沿海生態的最早文獻之一。"],
              ["Situated near the sea, the Eastern Mountains records birds with aquatic and coastal traits — among the earliest documents on eastern coastal ecology."]
            ),
          },
          {
            heading: L("羽族的功能與象徵", "Functions and Symbolism of Birds"),
            body: LA(
              ["書中的生物常具備特定的醫學效用或象徵意義。羽族在古人眼中不僅是生物，更是具備實用價值的資源——被賦予「預兆」或「醫療」的屬性，反映出先民對東部邊境環境的初步分類與理解。"],
              ["Birds here carry medicinal or symbolic meaning — resources with both omen and healing value, reflecting an early classification of the eastern frontier."]
            ),
          },
          {
            heading: L("神話與現實的交織", "Where Myth Meets Reality"),
            body: LA(
              ["多首、多足或奇異鳴叫的鳥類型態描述，體現了戰國至漢初時期楚國或巴蜀人對遙遠東方的瑰麗想像。"],
              ["Multi-headed, many-footed, strangely-crying birds embody how Warring States to early Han Chu and Ba-Shu peoples imagined the distant east."]
            ),
          },
        ],
      },
      {
        slug: "ep08-diling-jili",
        ep: "EP 08",
        chapter: L("東山經", "Eastern Mountains"),
        chapterPinyin: "Dōng Shān Jīng",
        title: L("地靈與祭禮", "Land Spirits and Rites"),
        subtitle: L("東方神靈的祭祀儀式與原始宗教信仰", "Rites to eastern deities and primal religion"),
        tags: LA(["巫術", "祭祀", "人類學"], ["Shamanism", "Ritual", "Anthropology"]),
        sections: [
          {
            heading: L("巫醫合一的祭祀傳統", "Shaman-Doctor Ritual Tradition"),
            body: LA(
              ["在古代語境中，「巫、醫往往不分」。例如「靈山六巫」等巫師負責採藥與溝通神靈。東方各山之神的形象與祭祀儀式，正是這一傳統的具體展現。"],
              ["In antiquity, shaman and doctor were often one — the 'six shamans of Ling Mountain' gathered herbs and communed with spirits. The eastern mountain gods and their rituals embody this tradition."]
            ),
          },
          {
            heading: L("祭儀中的物質文明", "Ritual as Material Culture"),
            body: LA(
              ["祭祀神靈時所使用的「服之」或「佩之」的物品，以及祭祀時所用的玉器、穀物等，反映了當時的物質生產水平與科技史脈絡。"],
              ["The items consumed or worn in ritual, along with jade and grain offerings, reflect the material and technological capacity of the age."]
            ),
          },
          {
            heading: L("地靈對社會秩序的意義", "Land Spirits and Social Order"),
            body: LA(
              ["《山海經》將地理空間區分為不同山系，每一系末尾通常記錄該系神靈的特徵與祭禮。先民試圖透過祭儀與自然界建立契約，以祈求土地平安、預防疾病(如「癘疾」)或災難。"],
              ["Each range's section closes with its deities and rites — a contract with nature to secure the land, ward off plague, and prevent disaster."]
            ),
          },
        ],
      },
    ],
  },
  {
    key: "zhong",
    name: L("中山經", "Central Mountains"),
    direction: L("中", "Center"),
    directionChar: "中",
    intro: L(
      "位居華夏之中，巫儀與醫藥交織，薰草治癘疾等記載勾勒出一幅核心區域的藥物地理地圖。",
      "At the center of the Chinese world, shamanic ritual and medicine intertwine — records like 'xun grass cures plague' sketch a pharmaceutical map of the heartland."
    ),
    episodes: [
      {
        slug: "ep09-tianxia-wuyi",
        ep: "EP 09",
        chapter: L("中山經", "Central Mountains"),
        chapterPinyin: "Zhōng Shān Jīng",
        title: L("天下之中的巫儀景觀", "The Ritual Landscape of the Center"),
        subtitle: L("中原地帶山神形象與巫術祭祀的演變", "The evolution of central-plain mountain gods and shamanic rites"),
        tags: LA(["巫術", "醫學", "祭祀"], ["Shamanism", "Medicine", "Ritual"]),
        sections: [
          {
            heading: L("巫醫合一的社會結構", "Shaman-Doctor Social Structure"),
            body: LA(
              ["古代社會中巫師與醫師的身份是重疊的。「靈山六巫」掌握著藥材採集與救人的能力。在《中山經》所涵蓋的中原核心區域，這種巫儀文化體現在對山神的祭祀中。"],
              ["Shaman and doctor overlapped in antiquity. The 'six shamans of Ling Mountain' both gathered herbs and healed. This ritual culture appears throughout the Central Mountains' treatment of mountain deities."]
            ),
          },
          {
            heading: L("「佩之」與「服之」的祭祀功能", "'Worn' and 'Ingested' as Ritual Function"),
            body: LA(
              ["書中生物效用常區分為「內服」或「外佩」，反映了早期巫術祭祀中對物品的神聖化處理，並轉化為對山神的儀式性致敬。"],
              ["Creatures were classified by whether they were 'ingested' or 'worn' — an early sacralization of objects, later turned into ritual homage to mountain gods."]
            ),
          },
          {
            heading: L("疾病作為神諭的象徵", "Disease as Divine Message"),
            body: LA(
              ["書中記錄了「惑」(精神迷亂)或「癘疾」(瘟疫)等病名，反映古人對疾病的恐懼。先民試圖透過祭祀儀式來緩解這些被視為「神罰」或自然失序的病症。"],
              ["Records of 'delusion' (mental disorder) and 'plague' show ancient fears — ills seen as divine punishment or cosmic disorder, to be soothed by ritual."]
            ),
          },
        ],
      },
      {
        slug: "ep10-hexin-shengtai",
        ep: "EP 10",
        chapter: L("中山經", "Central Mountains"),
        chapterPinyin: "Zhōng Shān Jīng",
        title: L("核心區域的生態多樣性", "Biodiversity of the Heartland"),
        subtitle: L("重構古代華夏中心地帶的自然物產圖景", "Reconstructing the natural bounty of ancient China's core"),
        tags: LA(["植物", "醫學", "生態"], ["Botany", "Medicine", "Ecology"]),
        sections: [
          {
            heading: L("指標性植物實例：薰草", "A Signature Plant: Xun Grass"),
            body: LA(
              ["《中山經》記載的薰草，形狀如茅草、開紅花，吃了可治療「癘疾」(瘟疫或皮膚病)。這是核心區域植物資源與人類健康直接關聯的絕佳實例。"],
              ["Xun grass — reed-shaped, red-flowered — was recorded as a cure for plague or skin disease. A prime example of the heartland's flora tied directly to human health."]
            ),
          },
          {
            heading: L("醫學分類的萌芽", "Nascent Medical Classification"),
            body: LA(
              ["《山海經》已具備初步的分類意識，如對症下藥及內外用藥的區分。由此可重構一幅中原地帶的「藥物地理地圖」，展示當時華夏中心地帶豐富的生態多樣性。"],
              ["The text shows early classification — matching remedy to symptom, distinguishing internal from external use — enough to reconstruct a pharmaceutical geography of the central plains."]
            ),
          },
          {
            heading: L("上古社會生活百科全書", "An Encyclopedia of Ancient Life"),
            body: LA(
              ["《中山經》的物產記載不只是單純的目錄，更反映了當時楚國或巴蜀人眼中的科技史與環境資源。透過這些紀錄，可以理解先民如何利用中原核心地帶的資源，來應對「疸」(黃疸)或「痔」等日常病症。"],
              ["More than a catalog, these entries reflect the technological and environmental world seen by Chu and Ba-Shu peoples — how they turned central-plain resources against ailments from jaundice to hemorrhoids."]
            ),
          },
        ],
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
