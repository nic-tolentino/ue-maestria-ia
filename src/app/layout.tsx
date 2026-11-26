import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Calendario · Máster en IA · Universidad Europea (M11 & M12)",
  description:
    "Calendario de clases online, enlaces de Microsoft Teams, grabaciones, asignaturas y seguimiento de notas para el Máster Universitario en Inteligencia Artificial de la Universidad Europea (M11 & M12).",
  openGraph: {
    title: "Calendario · Máster en IA · UE Valencia (M11 & M12)",
    description:
      "Clases en directo, enlaces de Teams, grabaciones, portal Canvas y seguimiento de evaluación (2026–27).",
    type: "website",
    locale: "es_ES",
    alternateLocale: ["en_US"],
    siteName: "Calendario · Máster en IA (UE)",
  },
  twitter: {
    card: "summary",
    title: "Calendario · Máster en IA · UE Valencia (M11 & M12)",
    description:
      "Clases en directo, enlaces de Teams, grabaciones, portal Canvas y seguimiento de evaluación (2026–27).",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
