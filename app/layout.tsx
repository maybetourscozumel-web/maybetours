import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "May-Be Tours Cozumel | Snorkeling & Watersports Tours",
    template: "%s | May-Be Tours Cozumel",
  },
  description:
    "Book snorkeling, diving and watersports tours in Cozumel with May-Be Tours. Palancar Reef, El Cielo, private catamaran charters, jet ski and more — reserve online in minutes.",
  icons: {
    icon: "/brand/favicon.png",
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
