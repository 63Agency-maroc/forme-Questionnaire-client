import { MerciView } from "@/components/questionnaire/MerciView";
import { isLanguage } from "@/lib/i18n";

export default async function MerciPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang = isLanguage(params.lang) ? params.lang : "fr";
  return <MerciView lang={lang} />;
}
