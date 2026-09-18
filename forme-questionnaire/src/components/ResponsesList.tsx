"use client";

import { useEffect, useState } from "react";
import type { StoredResponse } from "@/lib/types";

const LABELS: { key: keyof StoredResponse; label: string }[] = [
  { key: "language", label: "Langue" },
  { key: "fullName", label: "الاسم" },
  { key: "company", label: "الشركة" },
  { key: "service", label: "الخدمة" },
  { key: "serviceOther", label: "خدمة أخرى" },
  { key: "satisfaction", label: "الرضا 1-10" },
  { key: "likedMost", label: "أكثر حاجة عجباتو" },
  { key: "toImprove", label: "شنو نحسنو" },
  { key: "communication", label: "التواصل" },
  { key: "realValue", label: "قيمة حقيقية" },
  { key: "mainResult", label: "أهم نتيجة" },
  { key: "expectations", label: "التوقعات" },
  { key: "oneChange", label: "حاجة واحدة يبدلها" },
  { key: "nps", label: "NPS 0-10" },
  { key: "npsWhy", label: "علاش هاد التقييم" },
  { key: "testimonial", label: "témoignage" },
  { key: "caseStudy", label: "case study" },
  { key: "referrals", label: "referrals" },
  { key: "returnIntent", label: "يرجع يخدم معانا" },
  { key: "nextNeed", label: "حاجة دابا" },
  { key: "nextNeedOther", label: "حاجة أخرى" },
];

export function ResponsesList() {
  const [responses, setResponses] = useState<StoredResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/responses")
      .then((res) => res.json())
      .then((data: { responses?: StoredResponse[] }) => {
        setResponses(data.responses ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-white/50">كيتحمّل...</p>;
  }

  if (responses.length === 0) {
    return (
      <p className="text-white/50">
        ما كاين حتى جواب دابا. أول <bdi>questionnaire</bdi> غادي يظهر هنا.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {responses.map((response) => (
        <article
          key={response.id}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/8 pb-3">
            <p className="font-medium text-white">
              {response.fullName} — {response.company}
            </p>
            <p className="text-xs text-white/40" dir="ltr">
              {new Date(response.submittedAt).toLocaleString("fr-FR")}
            </p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            {LABELS.map(({ key, label }) => {
              const value = response[key];
              if (value === "" || value == null) return null;
              if (key === "id" || key === "submittedAt" || key === "fullName" || key === "company") {
                return null;
              }
              return (
                <div key={key} className="rounded-2xl bg-black/40 p-3">
                  <dt className="mb-1 text-xs text-white/40">{label}</dt>
                  <dd className="text-sm leading-relaxed text-white whitespace-pre-wrap">
                    {String(value)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </article>
      ))}
    </div>
  );
}
