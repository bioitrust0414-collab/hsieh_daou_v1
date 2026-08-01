import { useLang } from "@/lib/i18n";
import { useLiffContext } from "@/components/liff-provider";

const LINE_OA_FRIEND_URL = "https://line.me/R/ti/p/@297yfqpc";

export function LineBanner() {
  const { lang } = useLang();
  const { loginAndOpen } = useLiffContext();

  return (
    <section className="mx-auto max-w-6xl px-6 pb-10">
      <div className="scroll-card grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 p-5 sm:flex sm:justify-between">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-bold text-background"
          style={{ backgroundColor: "#06C755" }}
        >
          LINE
        </div>

        <p className="min-w-0 text-sm leading-relaxed text-foreground/85 sm:flex-1 sm:px-4">
          {lang === "zh"
            ? "加入 LINE 好友，第一時間獲知最新講演資訊"
            : "Add us on LINE for the latest lecture updates"}
        </p>
        <button
          type="button"
          onClick={() => loginAndOpen(LINE_OA_FRIEND_URL)}
          className="col-span-2 inline-flex shrink-0 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:col-span-1"
        >
          {lang === "zh" ? "立即加入" : "Join now"}
        </button>
      </div>
    </section>
  );
}
