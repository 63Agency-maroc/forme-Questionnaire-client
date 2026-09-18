"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { LanguageScreen } from "@/components/questionnaire/LanguageScreen";
import { QuestionnaireForm } from "@/components/questionnaire/Questionnaire";
import {
  LANGUAGE_OPTIONS,
  getCopy,
  isLanguage,
  type Language,
} from "@/lib/i18n";
import { emptyAnswers, type QuestionnaireAnswers } from "@/lib/types";

const STORAGE_KEY = "63-agency-questionnaire";

export function QuestionnaireApp() {
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState<Language | "">("");
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(emptyAnswers);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          lang?: unknown;
          step?: number;
          answers?: QuestionnaireAnswers;
        };
        if (isLanguage(parsed.lang)) setLang(parsed.lang);
        if (parsed.answers) setAnswers({ ...emptyAnswers, ...parsed.answers });
        if (parsed.step && parsed.step >= 1 && parsed.step <= 5) {
          setStep(parsed.step);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ lang, step, answers }),
    );
  }, [ready, lang, step, answers]);

  useEffect(() => {
    const nextLang = lang || "fr";
    const copy = getCopy(isLanguage(nextLang) ? nextLang : "fr");
    document.documentElement.lang = lang ? copy.htmlLang : "fr";
    document.documentElement.dir = lang ? copy.dir : "ltr";
  }, [lang]);

  function selectLanguage(next: Language) {
    setLang(next);
    setAnswers((prev) => ({ ...prev, language: next }));
  }

  if (!ready) {
    return (
      <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
        <div className="grain" />
        <div className="mx-auto mt-24 w-full max-w-2xl px-4">
          <div className="h-[320px] rounded-[28px] border border-white/10 bg-[#0b0b0b]/80" />
        </div>
      </div>
    );
  }

  const header = (
    <header className="relative z-10 mx-auto mt-6 w-[min(92%,720px)]">
      <div
        className="flex items-center justify-between rounded-full border border-white/12 bg-black/70 px-3 py-2.5 backdrop-blur-md sm:px-5"
        dir="ltr"
      >
        <Logo />
        {lang ? (
          <div className="flex items-center gap-1">
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => selectLanguage(option.code)}
                className={`rounded-full px-2.5 py-1 text-[11px] tracking-wide uppercase transition ${
                  lang === option.code
                    ? "bg-white text-black"
                    : "text-white/45 hover:text-white"
                }`}
                aria-label={option.native}
              >
                {option.code}
              </button>
            ))}
          </div>
        ) : (
          <p className="hidden text-xs tracking-[0.14em] text-white/50 uppercase sm:block">
            Client feedback
          </p>
        )}
      </div>
    </header>
  );

  if (!lang) {
    return (
      <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
        <div className="grain" />
        <div className="glow" />
        {header}
        <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-10 sm:py-14">
          <LanguageScreen onSelect={selectLanguage} />
        </main>
      </div>
    );
  }

  const t = getCopy(lang);

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div className="grain" />
      <div className="glow" />
      {header}
      <main
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:py-14"
        dir={t.dir}
      >
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm text-white/50">{t.introKicker}</p>
          <h1 className="mx-auto max-w-xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {t.introTitle}
            <span
              className="mt-2 block font-[family-name:var(--font-display)] text-2xl font-normal tracking-tight text-white/80 sm:text-3xl"
              dir="ltr"
            >
              63 Agency
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/45">
            {t.introText}
          </p>
        </div>
        <QuestionnaireForm
          lang={lang}
          answers={answers}
          setAnswers={setAnswers}
          step={step}
          setStep={setStep}
        />
      </main>
    </div>
  );
}
