"use client";

import { LANGUAGE_OPTIONS, type Language } from "@/lib/i18n";

export function LanguageScreen({
  onSelect,
}: {
  onSelect: (lang: Language) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-xl text-center" dir="ltr">
      <p className="mb-3 text-sm tracking-[0.18em] text-white/45 uppercase">
        63 Agency
      </p>
      <h1 className="text-3xl font-semibold text-white sm:text-4xl">
        Choose your language
      </h1>
      <p className="mt-3 text-sm text-white/50">
        Choisissez votre langue · اختار اللغة
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {LANGUAGE_OPTIONS.map((option) => (
          <button
            key={option.code}
            type="button"
            onClick={() => onSelect(option.code)}
            dir={option.code === "ar" ? "rtl" : "ltr"}
            className="rounded-[24px] border border-white/12 bg-white/[0.03] px-5 py-7 transition hover:border-white/40 hover:bg-white hover:text-black"
          >
            <span className="block text-xl font-semibold">{option.native}</span>
            <span className="mt-2 block text-sm opacity-55">
              {option.subtitle}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
