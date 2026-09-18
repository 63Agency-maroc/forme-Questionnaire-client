export type ServiceOption =
  | "Lead generation"
  | "Content"
  | "Ads"
  | "Funnel"
  | "CRM & Automation"
  | "Website"
  | "Autre";

export type CommunicationRating =
  | "Très satisfait"
  | "Satisfait"
  | "Moyen"
  | "Insatisfait";

export type ValueRating = "Oui" | "Partiellement" | "Non";

export type ExpectationRating = "Supérieure" | "Conforme" | "Inférieure";

export type TestimonialConsent =
  | "Oui avec mon nom et entreprise"
  | "Oui sans mon nom"
  | "Non";

export type ReturnIntent = "Oui" | "Peut-être" | "Non";

export type Language = "ar" | "fr" | "en";

export interface QuestionnaireAnswers {
  language: Language | "";
  fullName: string;
  company: string;
  service: ServiceOption | "";
  serviceOther: string;
  satisfaction: number | null;
  likedMost: string;
  toImprove: string;
  communication: CommunicationRating | "";
  realValue: ValueRating | "";
  mainResult: string;
  expectations: ExpectationRating | "";
  oneChange: string;
  nps: number | null;
  npsWhy: string;
  testimonial: TestimonialConsent | "";
  caseStudy: "Oui" | "Non" | "";
  referrals: string;
  returnIntent: ReturnIntent | "";
  nextNeed: ServiceOption | "";
  nextNeedOther: string;
}

export interface StoredResponse extends QuestionnaireAnswers {
  id: string;
  submittedAt: string;
}

export const emptyAnswers: QuestionnaireAnswers = {
  language: "",
  fullName: "",
  company: "",
  service: "",
  serviceOther: "",
  satisfaction: null,
  likedMost: "",
  toImprove: "",
  communication: "",
  realValue: "",
  mainResult: "",
  expectations: "",
  oneChange: "",
  nps: null,
  npsWhy: "",
  testimonial: "",
  caseStudy: "",
  referrals: "",
  returnIntent: "",
  nextNeed: "",
  nextNeedOther: "",
};
