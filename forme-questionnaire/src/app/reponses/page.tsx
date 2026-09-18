import { Logo } from "@/components/Logo";
import { ResponsesList } from "@/components/ResponsesList";

export default function ReponsesPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div className="grain" />
      <header className="relative z-10 mx-auto mt-6 w-[min(92%,960px)]">
        <div
          className="flex items-center justify-between rounded-full border border-white/12 bg-black/70 px-5 py-3 backdrop-blur-md"
          dir="ltr"
        >
          <Logo />
          <p className="text-xs tracking-[0.14em] text-white/50 uppercase">
            Réponses internes
          </p>
        </div>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <h1 className="mb-6 text-2xl font-semibold text-white">
          أجوبة الزبناء
        </h1>
        <ResponsesList />
      </main>
    </div>
  );
}
