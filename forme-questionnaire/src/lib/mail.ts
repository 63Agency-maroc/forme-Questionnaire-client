import nodemailer from "nodemailer";
import type { StoredResponse } from "@/lib/types";

const LANG_LABELS: Record<string, string> = {
  ar: "Arabe (Darija)",
  fr: "Français",
  en: "English",
};

function val(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value).trim();
}

function row(label: string, value: string | number | null | undefined): string {
  return `${label.padEnd(32)} : ${val(value)}`;
}

function block(title: string, rows: string[]): string {
  const divider = "-".repeat(56);
  return [`${title}`, divider, ...rows, ""].join("\n");
}

function serviceLabel(
  service: string,
  other: string,
): string {
  if (!service) return "—";
  if (service === "Autre") return other ? `Autre — ${other}` : "Autre";
  return service;
}

export function buildFeedbackEmailText(response: StoredResponse): string {
  const date = new Date(response.submittedAt).toLocaleString("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const language = LANG_LABELS[response.language] || val(response.language);

  return [
    "63 AGENCY — Feedback client",
    "=".repeat(56),
    "",
    "Bonjour,",
    "",
    "Un client vient de soumettre le questionnaire de satisfaction.",
    "Voici le détail de ses réponses :",
    "",
    block("1. IDENTITÉ", [
      row("Nom complet", response.fullName),
      row("Entreprise", response.company),
      row("Langue du formulaire", language),
      row("Date de soumission", date),
    ]),
    block("2. SERVICE", [
      row(
        "Prestation réalisée",
        serviceLabel(response.service, response.serviceOther),
      ),
    ]),
    block("3. EXPÉRIENCE", [
      row("Satisfaction globale (1-10)", response.satisfaction),
      row("Communication / suivi", response.communication),
      "",
      "Ce qui a le plus plu :",
      val(response.likedMost),
      "",
      "Points à améliorer :",
      val(response.toImprove),
    ]),
    block("4. RÉSULTATS", [
      row("Valeur réelle perçue", response.realValue),
      row("Résultat vs attentes", response.expectations),
      "",
      "Résultat / amélioration principale :",
      val(response.mainResult),
      "",
      "Une chose à changer dans l'expérience :",
      val(response.oneChange),
    ]),
    block("5. RECOMMANDATION", [
      row("NPS / recommandation (0-10)", response.nps),
      "",
      "Motif de la note :",
      val(response.npsWhy),
      "",
      row("Autorisation témoignage", response.testimonial),
      row("Accord case study", response.caseStudy),
    ]),
    block("6. SUITE & OPPORTUNITÉS", [
      row("Collaborer à nouveau", response.returnIntent),
      row(
        "Besoin actuel",
        serviceLabel(response.nextNeed, response.nextNeedOther),
      ),
      "",
      "Referrals (entreprises / contacts) :",
      val(response.referrals),
    ]),
    "=".repeat(56),
    `Référence : ${response.id}`,
    "",
    "—",
    "Message automatique · Questionnaire client 63 Agency",
  ].join("\n");
}

export async function sendFeedbackEmail(response: StoredResponse) {
  const host = process.env.BULK_SMTP_HOST;
  const port = Number(process.env.BULK_SMTP_PORT || "465");
  const secure = process.env.BULK_SMTP_SECURE !== "false";
  const user = process.env.BULK_SMTP_USER;
  const pass = process.env.BULK_SMTP_PASS;
  const fromName = process.env.BULK_FROM_NAME || "63 Agency";
  const to = process.env.BULK_TO_EMAIL || "contact@63agency.ma";

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP config incomplete. Check BULK_SMTP_HOST, BULK_SMTP_USER and BULK_SMTP_PASS in .env",
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const text = buildFeedbackEmailText(response);

  await transporter.sendMail({
    from: `"${fromName}" <${user}>`,
    to,
    subject: `[Feedback] ${response.fullName} — ${response.company} · NPS ${response.nps ?? "—"}/10`,
    text,
  });
}
