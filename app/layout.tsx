import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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

const BASE_URL = "https://trackads.iamanager.fr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "TrackAds — Intelligence publicitaire pour infopreneurs",
    template: "%s | TrackAds",
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
    "TrackAds",
  ],
  authors: [{ name: "TrackAds", url: BASE_URL }],
  creator: "TrackAds",
  publisher: "TrackAds",
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
    siteName: "TrackAds",
    title: "TrackAds — Intelligence publicitaire pour infopreneurs",
    description:
      "Espionnez les meilleures publicités Meta & TikTok, analysez vos concurrents et générez vos scripts VSL avec l'IA.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "TrackAds — Intelligence publicitaire",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrackAds — Intelligence publicitaire pour infopreneurs",
    description:
      "Espionnez les meilleures publicités Meta & TikTok, analysez vos concurrents et générez vos scripts VSL avec l'IA.",
    images: ["/api/og"],
    creator: "@trackads",
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
        {/* Microsoft Clarity — heatmaps & session recordings (activé quand NEXT_PUBLIC_CLARITY_ID est défini) */}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
