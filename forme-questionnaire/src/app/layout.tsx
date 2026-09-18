import type { Metadata } from "next";
import { Cairo, Instrument_Serif } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Questionnaire client | 63 Agency",
  description:
    "Votre avis nous aide à améliorer l'expérience 63 Agency et à construire de meilleures case studies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${cairo.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
