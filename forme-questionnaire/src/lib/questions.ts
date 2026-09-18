import type { QuestionnaireAnswers } from "./types";
import type { Copy } from "./i18n";

export const SERVICES = [
  "Lead generation",
  "Content",
  "Ads",
  "Funnel",
  "CRM & Automation",
  "Website",
  "Autre",
] as const;

export const COMMUNICATION_OPTIONS = [
  "Très satisfait",
  "Satisfait",
  "Moyen",
  "Insatisfait",
] as const;

export const VALUE_OPTIONS = ["Oui", "Partiellement", "Non"] as const;

export const EXPECTATION_OPTIONS = [
  "Supérieure",
  "Conforme",
  "Inférieure",
] as const;

export const TESTIMONIAL_OPTIONS = [
  "Oui avec mon nom et entreprise",
  "Oui sans mon nom",
  "Non",
] as const;

export const YES_NO = ["Oui", "Non"] as const;

export const RETURN_OPTIONS = ["Oui", "Peut-être", "Non"] as const;

export function validateStep(
  step: number,
  answers: QuestionnaireAnswers,
  t: Copy,
): Partial<Record<keyof QuestionnaireAnswers, string>> {
  const errors: Partial<Record<keyof QuestionnaireAnswers, string>> = {};

  if (step === 1) {
    if (!answers.fullName.trim()) errors.fullName = t.required;
    if (!answers.company.trim()) errors.company = t.required;
    if (!answers.service) errors.service = t.chooseService;
    if (answers.service === "Autre" && !answers.serviceOther.trim()) {
      errors.serviceOther = t.writeService;
    }
  }

  if (step === 2) {
    if (answers.satisfaction == null) errors.satisfaction = t.chooseScore10;
    if (!answers.likedMost.trim()) errors.likedMost = t.required;
    if (!answers.toImprove.trim()) errors.toImprove = t.required;
    if (!answers.communication) errors.communication = t.chooseAnswer;
  }

  if (step === 3) {
    if (!answers.realValue) errors.realValue = t.chooseAnswer;
    if (!answers.mainResult.trim()) errors.mainResult = t.required;
    if (!answers.expectations) errors.expectations = t.chooseAnswer;
    if (!answers.oneChange.trim()) errors.oneChange = t.required;
  }

  if (step === 4) {
    if (answers.nps == null) errors.nps = t.chooseScoreNps;
    if (!answers.npsWhy.trim()) errors.npsWhy = t.required;
    if (!answers.testimonial) errors.testimonial = t.chooseAnswer;
    if (!answers.caseStudy) errors.caseStudy = t.chooseAnswer;
  }

  if (step === 5) {
    if (!answers.returnIntent) errors.returnIntent = t.chooseAnswer;
    if (!answers.nextNeed) errors.nextNeed = t.chooseService;
    if (answers.nextNeed === "Autre" && !answers.nextNeedOther.trim()) {
      errors.nextNeedOther = t.writeNeed;
    }
  }

  return errors;
}
