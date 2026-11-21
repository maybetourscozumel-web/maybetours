import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { BUSINESS, siteUrl } from "@/lib/business";
import "./globals.css";

// Single geometric, modern sans used for everything — headings and body —
// for a cohesive, contemporary voice across the whole site.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DEFAULT_DESCRIPTION =
  "Book snorkeling, diving and watersports tours in Cozumel with May-Be Tours. Palancar Reef, El Cielo, private catamaran charters, jet ski and more. Perfect for cruise ship excursions and day trips from Playa del Carmen — reserve online in minutes.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "May-Be Tours Cozumel | Snorkeling, Diving & Cruise Excursions",
    template: "%s | May-Be Tours Cozumel",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Cozumel snorkeling tours",
    "Cozumel cruise excursions",
    "Cozumel shore excursions",
    "Palancar Reef snorkeling",
    "El Cielo Cozumel",
    "private catamaran Cozumel",
    "day trip Cozumel from Playa del Carmen",
    "Cozumel scuba diving",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: "/brand/favicon.png",
    apple: "/brand/favicon.png",
  },
  openGraph: {
    type: "website",
    siteName: BUSINESS.name,
    title: "May-Be Tours Cozumel | Snorkeling, Diving & Cruise Excursions",
    description: DEFAULT_DESCRIPTION,
    url: siteUrl(),
    locale: "en_US",
    images: [
      {
        url: "/brand/boat-hero.webp",
        width: 1200,
        height: 630,
        alt: "May-Be Tours boat in the waters of Cozumel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "May-Be Tours Cozumel | Snorkeling, Diving & Cruise Excursions",
    description: DEFAULT_DESCRIPTION,
    images: ["/brand/boat-hero.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b3c66",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="bg-background flex min-h-full flex-col text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
