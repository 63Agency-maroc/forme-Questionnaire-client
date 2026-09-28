"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  COMMUNICATION_OPTIONS,
  EXPECTATION_OPTIONS,
  RETURN_OPTIONS,
  SERVICES,
  TESTIMONIAL_OPTIONS,
  VALUE_OPTIONS,
  YES_NO,
  validateStep,
} from "@/lib/questions";
import { getCopy, labeledOptions, type Language } from "@/lib/i18n";
import { emptyAnswers, type QuestionnaireAnswers } from "@/lib/types";
import {
  ChoiceGroup,
  Field,
  ScoreScale,
  TextArea,
  TextInput,
} from "./Fields";

export function QuestionnaireForm({
  lang,
  answers,
  setAnswers,
  step,
  setStep,
}: {
  lang: Language;
  answers: QuestionnaireAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<QuestionnaireAnswers>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const router = useRouter();
  const t = getCopy(lang);
  const [errors, setErrors] = useState<
    Partial<Record<keyof QuestionnaireAnswers, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const progress = useMemo(
    () => ((step - 1) / (t.steps.length - 1)) * 100,
    [step, t.steps.length],
  );

  function update<K extends keyof QuestionnaireAnswers>(
    key: K,
    value: QuestionnaireAnswers[K],
  ) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function goNext() {
    const stepErrors = validateStep(step, answers, t);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, t.steps.length));
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    const stepErrors = validateStep(step, answers, t);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, language: lang }),
      });

      if (!response.ok) {
        throw new Error("submit-failed");
      }

      localStorage.removeItem("63-agency-questionnaire");
      router.push(`/merci?lang=${lang}`);
    } catch {
      setSubmitError(t.submitError);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between text-sm text-white/50">
          <span>{t.steps[step - 1]}</span>
          <span dir="ltr">
            {step} / {t.steps.length}
          </span>
        </div>
        <div className="h-[2px] overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-1.5">
          {t.steps.map((item, index) => (
            <div
              key={item}
              className={`h-1.5 flex-1 rounded-full ${
                index + 1 <= step ? "bg-white" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[#0b0b0b]/80 p-5 shadow-[0_0_80px_rgba(255,255,255,0.03)] backdrop-blur-sm sm:p-8">
        <div className="space-y-8">
          {step === 1 && (
            <>
              <Field label={t.fullName} error={errors.fullName}>
                <TextInput
                  dir={t.dir}
                  value={answers.fullName}
                  onChange={(v) => update("fullName", v)}
                  placeholder={t.fullNamePlaceholder}
                />
              </Field>
              <Field label={t.company} error={errors.company}>
                <TextInput
                  dir={t.dir}
                  value={answers.company}
                  onChange={(v) => update("company", v)}
                  placeholder={t.companyPlaceholder}
                />
              </Field>
              <Field
                label={t.service}
                error={errors.service || errors.serviceOther}
              >
                <ChoiceGroup
                  multiple
                  hint={t.multiSelectHint}
                  dir={t.dir}
                  options={labeledOptions(SERVICES, t.services)}
                  value={answers.service}
                  onChange={(v) =>
                    update(
                      "service",
                      (Array.isArray(v) ? v : [v]) as QuestionnaireAnswers["service"],
                    )
                  }
                />
                {answers.service.includes("Autre") && (
                  <div className="mt-3">
                    <TextInput
                      dir={t.dir}
                      value={answers.serviceOther}
                      onChange={(v) => update("serviceOther", v)}
                      placeholder={t.serviceOtherPlaceholder}
                    />
                  </div>
                )}
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label={t.satisfaction} error={errors.satisfaction}>
                <ScoreScale
                  min={1}
                  max={10}
                  value={answers.satisfaction}
                  onChange={(v) => update("satisfaction", v)}
                  lowLabel={t.satisfactionLow}
                  highLabel={t.satisfactionHigh}
                />
              </Field>
              <Field label={t.likedMost} error={errors.likedMost}>
                <TextArea
                  dir={t.dir}
                  value={answers.likedMost}
                  onChange={(v) => update("likedMost", v)}
                  placeholder={t.likedMostPlaceholder}
                />
              </Field>
              <Field label={t.toImprove} error={errors.toImprove}>
                <TextArea
                  dir={t.dir}
                  value={answers.toImprove}
                  onChange={(v) => update("toImprove", v)}
                  placeholder={t.toImprovePlaceholder}
                />
              </Field>
              <Field label={t.communication} error={errors.communication}>
                <ChoiceGroup
                  dir={t.dir}
                  options={labeledOptions(
                    COMMUNICATION_OPTIONS,
                    t.communicationOptions,
                  )}
                  value={answers.communication}
                  onChange={(v) =>
                    update(
                      "communication",
                      v as QuestionnaireAnswers["communication"],
                    )
                  }
                  columns={2}
                />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field label={t.realValue} error={errors.realValue}>
                <ChoiceGroup
                  dir={t.dir}
                  options={labeledOptions(VALUE_OPTIONS, t.valueOptions)}
                  value={answers.realValue}
                  onChange={(v) =>
                    update("realValue", v as QuestionnaireAnswers["realValue"])
                  }
                  columns={3}
                />
              </Field>
              <Field label={t.mainResult} error={errors.mainResult}>
                <TextArea
                  dir={t.dir}
                  value={answers.mainResult}
                  onChange={(v) => update("mainResult", v)}
                  placeholder={t.mainResultPlaceholder}
                  rows={5}
                />
              </Field>
              <Field label={t.expectations} error={errors.expectations}>
                <ChoiceGroup
                  dir={t.dir}
                  options={labeledOptions(
                    EXPECTATION_OPTIONS,
                    t.expectationOptions,
                  )}
                  value={answers.expectations}
                  onChange={(v) =>
                    update(
                      "expectations",
                      v as QuestionnaireAnswers["expectations"],
                    )
                  }
                  columns={3}
                />
              </Field>
              <Field label={t.oneChange} error={errors.oneChange}>
                <TextArea
                  dir={t.dir}
                  value={answers.oneChange}
                  onChange={(v) => update("oneChange", v)}
                  placeholder={t.oneChangePlaceholder}
                />
              </Field>
            </>
          )}

          {step === 4 && (
            <>
              <Field label={t.nps} error={errors.nps}>
                <ScoreScale
                  min={0}
                  max={10}
                  value={answers.nps}
                  onChange={(v) => update("nps", v)}
                  lowLabel={t.npsLow}
                  highLabel={t.npsHigh}
                />
              </Field>
              <Field label={t.npsWhy} error={errors.npsWhy}>
                <TextArea
                  dir={t.dir}
                  value={answers.npsWhy}
                  onChange={(v) => update("npsWhy", v)}
                  placeholder={t.npsWhyPlaceholder}
                />
              </Field>
              <Field label={t.testimonial} error={errors.testimonial}>
                <ChoiceGroup
                  dir={t.dir}
                  options={labeledOptions(
                    TESTIMONIAL_OPTIONS,
                    t.testimonialOptions,
                  )}
                  value={answers.testimonial}
                  onChange={(v) =>
                    update(
                      "testimonial",
                      v as QuestionnaireAnswers["testimonial"],
                    )
                  }
                  columns={1}
                />
              </Field>
              <Field label={t.caseStudy} error={errors.caseStudy}>
                <ChoiceGroup
                  dir={t.dir}
                  options={labeledOptions(YES_NO, t.yesNo)}
                  value={answers.caseStudy}
                  onChange={(v) =>
                    update("caseStudy", v as QuestionnaireAnswers["caseStudy"])
                  }
                  columns={2}
                />
              </Field>
            </>
          )}

          {step === 5 && (
            <>
              <Field
                label={t.referrals}
                optional
                optionalLabel={t.optional}
                error={errors.referrals}
              >
                <TextArea
                  dir={t.dir}
                  value={answers.referrals}
                  onChange={(v) => update("referrals", v)}
                  placeholder={t.referralsPlaceholder}
                />
              </Field>
              <Field label={t.returnIntent} error={errors.returnIntent}>
                <ChoiceGroup
                  dir={t.dir}
                  options={labeledOptions(RETURN_OPTIONS, t.returnOptions)}
                  value={answers.returnIntent}
                  onChange={(v) =>
                    update(
                      "returnIntent",
                      v as QuestionnaireAnswers["returnIntent"],
                    )
                  }
                  columns={3}
                />
              </Field>
              <Field
                label={t.nextNeed}
                error={errors.nextNeed || errors.nextNeedOther}
              >
                <ChoiceGroup
                  multiple
                  hint={t.multiSelectHint}
                  dir={t.dir}
                  options={labeledOptions(SERVICES, t.services)}
                  value={answers.nextNeed}
                  onChange={(v) =>
                    update(
                      "nextNeed",
                      (Array.isArray(v) ? v : [v]) as QuestionnaireAnswers["nextNeed"],
                    )
                  }
                />
                {answers.nextNeed.includes("Autre") && (
                  <div className="mt-3">
                    <TextInput
                      dir={t.dir}
                      value={answers.nextNeedOther}
                      onChange={(v) => update("nextNeedOther", v)}
                      placeholder={t.nextNeedOtherPlaceholder}
                    />
                  </div>
                )}
              </Field>
            </>
          )}
        </div>

        {submitError ? (
          <p className="mt-6 text-sm text-red-300" role="alert">
            {submitError}
          </p>
        ) : null}

        <div
          className="mt-10 flex items-center justify-between gap-3"
          dir="ltr"
        >
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1 || submitting}
            className="rounded-full border border-white/15 px-6 py-3 text-sm text-white transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {t.back}
          </button>
          {step < t.steps.length ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-full bg-white px-8 py-3 text-sm font-medium tracking-[0.12em] text-black uppercase transition hover:bg-white/90"
            >
              {t.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-full bg-white px-8 py-3 text-sm font-medium tracking-[0.12em] text-black uppercase transition hover:bg-white/90 disabled:opacity-60"
            >
              {submitting ? t.submitting : t.submit}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
