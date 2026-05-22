import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://scalelab.iamanager.fr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ScaleLab — Intelligence publicitaire pour infopreneurs",
    template: "%s | ScaleLab",
  },
  description:
    "Espionnez les meilleures publicités Meta & TikTok, analysez vos concurrents, suivez les tunnels de vente et générez vos scripts VSL avec l'IA.",
  keywords: [
    "spy ads",
    "espionner publicités",
    "meta ads spy",
    "tiktok ads spy",
    "VSL generator",
    "script VSL IA",
    "intelligence publicitaire",
    "infopreneur",
    "tunnel de vente",
    "ScaleLab",
  ],
  authors: [{ name: "ScaleLab", url: BASE_URL }],
  creator: "ScaleLab",
  publisher: "ScaleLab",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: BASE_URL,
    siteName: "ScaleLab",
    title: "ScaleLab — Intelligence publicitaire pour infopreneurs",
    description:
      "Espionnez les meilleures publicités Meta & TikTok, analysez vos concurrents et générez vos scripts VSL avec l'IA.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "ScaleLab — Intelligence publicitaire",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ScaleLab — Intelligence publicitaire pour infopreneurs",
    description:
      "Espionnez les meilleures publicités Meta & TikTok, analysez vos concurrents et générez vos scripts VSL avec l'IA.",
    images: ["/api/og"],
    creator: "@scalelab",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
