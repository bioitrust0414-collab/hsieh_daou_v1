import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { getAudioTracks, type ElementKey } from "@/lib/audio-tracks";

export function FiveTonePlayer() {
  const { lang } = useLang();
  const tracks = useMemo(() => getAudioTracks(), []);
  const [active, setActive] = useState<ElementKey | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const current = tracks.find((t) => t.key === active) ?? null;

  function toggle(key: ElementKey) {
    const track = tracks.find((t) => t.key === key);
    if (!track) return;

    if (active === key && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setActive(null);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    const el = audioRef.current;
    if (el.src !== track.url) el.src = track.url;
    el.currentTime = 0;
    void el.play().catch(() => setActive(null));
    setActive(key);
  }

  return (
    <section className="py-16">
      <p className="text-sm tracking-widest text-bronze mb-3">
        {lang === "zh" ? "五行音韻 · WUXING TONES" : "WUXING TONES"}
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold mb-3">
        {lang === "zh" ? "五音調息" : "Five-Tone Breathwork"}
      </h2>
      <p className="max-w-3xl text-foreground/80 leading-loose mb-8">
        {lang === "zh"
          ? "宮商角徵羽對應脾肺肝心腎。點選任一方印即循環播放該行音韻，作為靜坐、吐納與內丹行功的背景聲場。"
          : "The five classical tones map to the five organs. Tap a seal to loop its tone as a background field for sitting, breathwork and inner-alchemy practice."}
      </p>

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
        </p>
      ) : null}
    </section>
  );
}
