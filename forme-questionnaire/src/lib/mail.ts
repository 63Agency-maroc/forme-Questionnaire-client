import nodemailer from "nodemailer";
import type { StoredResponse } from "@/lib/types";

function line(label: string, value: string | number | null | undefined) {
  const text =
    value === null || value === undefined || value === ""
      ? "-"
      : String(value);
  return `${label}\n${text}\n`;
}

export function buildFeedbackEmailText(response: StoredResponse): string {
  return [
    "Nouveau feedback client — 63 Agency",
    "====================================",
    "",
    line("Date", new Date(response.submittedAt).toLocaleString("fr-FR")),
    line("Langue", response.language || "-"),
    line("Nom", response.fullName),
    line("Entreprise", response.company),
    line(
      "Service réalisé",
      response.service === "Autre"
        ? `Autre: ${response.serviceOther || "-"}`
        : response.service,
    ),
    line("Satisfaction (1-10)", response.satisfaction),
    line("Ce qui a le plus plu", response.likedMost),
    line("À améliorer", response.toImprove),
    line("Communication / suivi", response.communication),
    line("Valeur réelle perçue", response.realValue),
    line("Résultat principal", response.mainResult),
    line("Par rapport aux attentes", response.expectations),
    line("Une chose à changer", response.oneChange),
    line("NPS / recommandation (0-10)", response.nps),
    line("Pourquoi cette note", response.npsWhy),
    line("Autorisation témoignage", response.testimonial),
    line("Accord case study", response.caseStudy),
    line("Referrals", response.referrals || "-"),
    line("Envie de collaborer à nouveau", response.returnIntent),
    line(
      "Besoin actuel",
      response.nextNeed === "Autre"
        ? `Autre: ${response.nextNeedOther || "-"}`
        : response.nextNeed,
    ),
    "====================================",
    `ID: ${response.id}`,
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
    subject: `Nouveau feedback — ${response.fullName} (${response.company})`,
    text,
  });
}
