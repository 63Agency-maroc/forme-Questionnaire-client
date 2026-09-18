import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getCopy, type Language } from "@/lib/i18n";

export function MerciView({ lang }: { lang: Language }) {
  const t = getCopy(lang);

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div className="grain" />
      <div className="glow" />

      <header className="relative z-10 mx-auto mt-6 w-[min(92%,720px)]">
        <div
          className="flex items-center justify-between rounded-full border border-white/12 bg-black/70 px-5 py-3 backdrop-blur-md"
          dir="ltr"
        >
          <Logo />
        </div>
      </header>

      <main
        className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 py-16 text-center"
        dir={t.dir}
      >
        <p
          className="mb-4 text-sm tracking-[0.18em] text-white/45 uppercase"
          dir="ltr"
        >
          {t.merciKicker}
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          {t.merciTitle}
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/55">
          {t.merciText}
        </p>
        <p className="mt-3 text-sm text-white/35">{t.merciSub}</p>
        <Link
          href="/"
          className="mt-10 rounded-full bg-white px-8 py-3 text-sm font-medium tracking-[0.12em] text-black uppercase"
        >
          {t.merciBack}
        </Link>
      </main>
    </div>
  );
}
