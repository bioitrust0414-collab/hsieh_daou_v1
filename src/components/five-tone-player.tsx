import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { getAudioTracks, type ElementKey } from "@/lib/audio-tracks";

export function FiveTonePlayer() {
  const { lang } = useLang();
  const tracks = useMemo(() => getAudioTracks(), []);
  const [active, setActive] = useState<ElementKey | null>(null);
  const [sequencing, setSequencing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  function ensureAudio(): HTMLAudioElement {
    if (!audioRef.current) {
      const el = new Audio();
      audioRef.current = el;
      el.addEventListener("ended", () => {
        // sequencing: advance to next element in 木火土金水 order
        if (!sequencingRef.current) return;
        const order: ElementKey[] = ["wood", "fire", "earth", "metal", "water"];
        const cur = order.indexOf(activeRef.current ?? "water");
        const nextKey = order[(cur + 1) % order.length];
        playKey(nextKey, true);
      });
    }
    return audioRef.current;
  }

  // refs to read latest state inside event handlers
  const sequencingRef = useRef(false);
  const activeRef = useRef<ElementKey | null>(null);
  useEffect(() => { sequencingRef.current = sequencing; }, [sequencing]);
  useEffect(() => { activeRef.current = active; }, [active]);

  function playKey(key: ElementKey, fromSequence = false) {
    const track = tracks.find((t) => t.key === key);
    if (!track) return;
    const el = ensureAudio();
    el.loop = false; // sequence mode advances on ended
    if (el.src !== track.url) el.src = track.url;
    el.currentTime = 0;
    void el.play().catch(() => setActive(null));
    setActive(key);
    if (fromSequence) setSequencing(true);
  }

  function toggle(key: ElementKey) {
    // stop sequence when manually toggling
    if (sequencing) {
      setSequencing(false);
    }
    const track = tracks.find((t) => t.key === key);
    if (!track) return;

    if (active === key && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setActive(null);
      return;
    }

    playKey(key);
  }

  function startSequence() {
    setSequencing(true);
    // always begin from 木 (wood)
    playKey("wood", true);
  }

  function stopSequence() {
    setSequencing(false);
    audioRef.current?.pause();
    setActive(null);
  }

  const current = tracks.find((t) => t.key === active) ?? null;

  return (
    <section className="py-16">
      <p className="text-sm tracking-widest text-bronze mb-3">
        {lang === "zh" ? "五行音韻 · WUXING TONES" : "WUXING TONES"}
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold mb-3">
        {lang === "zh" ? "五音調息" : "Five-Tone Breathwork"}
      </h2>
      <p className="max-w-3xl text-foreground/80 leading-loose mb-6">
        {lang === "zh"
          ? "宮商角徵羽對應脾肺肝心腎。點選「依序播放」即按木火土金水循環連播，亦可點選單一方印僅循環該行音韻。"
          : "The five classical tones map to the five organs. Tap “Auto Sequence” to loop through Wood→Fire→Earth→Metal→Water in order, or tap a single seal to loop just that tone."}
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        {sequencing ? (
          <button
            type="button"
            onClick={stopSequence}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <span aria-hidden>❚❚</span>
            {lang === "zh" ? "停止依序播放" : "Stop sequence"}
          </button>
        ) : (
          <button
            type="button"
            onClick={startSequence}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <span aria-hidden>▶</span>
            {lang === "zh" ? "依序播放 · 木火土金水" : "Auto sequence · Wood→Water"}
          </button>
        )}
        {sequencing && (
          <span className="text-xs text-bronze tracking-widest animate-pulse">
            {lang === "zh" ? "依序連播中" : "Sequencing…"}
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tracks.map((track) => {
          const isActive = active === track.key;
          return (
            <button
              key={track.key}
              type="button"
              onClick={() => toggle(track.key)}
              aria-pressed={isActive}
              className={`scroll-card group p-5 text-left transition-transform hover:-translate-y-1 ${
                isActive ? "ring-1 ring-bronze" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="seal-square h-11 w-11 shrink-0 text-xl">{track.glyph}</span>
                <div className="min-w-0">
                  <div className="text-lg font-semibold leading-tight">
                    {lang === "zh" ? track.name.zh : track.name.en}
                  </div>
                  <div className="text-xs tracking-widest text-bronze">
                    {lang === "zh" ? track.tone.zh : track.tone.en}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {lang === "zh" ? track.note.zh : track.note.en}
              </p>
              <div className="mt-4 pt-3 border-t border-border/70 text-xs text-bronze flex items-center">
                {isActive
                  ? lang === "zh"
                    ? "播放中 · 點擊停止"
                    : "Playing · tap to stop"
                  : lang === "zh"
                    ? "聆聽此音"
                    : "Listen"}
                <span
                  aria-hidden
                  className={`ml-auto transition-transform ${
                    isActive ? "animate-pulse" : "group-hover:translate-x-1"
                  }`}
                >
                  {isActive ? "❚❚" : "▶"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {current ? (
        <p className="mt-4 text-xs text-muted-foreground">
          {lang === "zh" ? "音源：" : "Source: "}
          {current.source === "supabase" ? "Supabase Storage" : "CDN 備援"}
          {sequencing ? (lang === "zh" ? " · 依序連播模式" : " · sequence mode") : ""}
        </p>
      ) : null}
    </section>
  );
}
