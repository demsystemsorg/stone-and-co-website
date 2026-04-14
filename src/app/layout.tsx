import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import { LawFirmSchema } from "@/components/seo";
import { GoldRuleAnimator } from "@/components/ui/gold-rule-animator";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SectionRiseObserver } from "@/components/ui/section-rise-observer";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stonelegal.co.uk"),
  title: {
    default: "Stone & Co. Solicitors | London Legal Services",
    template: "%s | Stone & Co. Solicitors",
  },
  description:
    "London solicitors specialising in Tenancy Deposit Claims, Immigration, and Rent Repayment Orders. SRA regulated (No. 640836). Offices in the City (EC2Y) and Leytonstone (E11).",
  keywords: [
    "solicitors london",
    "tenancy deposit claim",
    "deposit protection claim",
    "immigration solicitor london",
    "rent repayment order",
    "RRA 2025",
    "tenancy deposit solicitor",
    "east london solicitors",
    "leytonstone solicitors",
    "city solicitors",
  ],
  authors: [{ name: "Stone & Co. Solicitors" }],
  creator: "Stone & Co. Solicitors",
  publisher: "Stone & Co. Solicitors",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://stonelegal.co.uk",
    siteName: "Stone & Co. Solicitors",
    title: "Stone & Co. Solicitors | London Legal Services",
    description:
      "London solicitors specialising in Tenancy Deposit Claims, Immigration, and Rent Repayment Orders. SRA regulated.",
    images: [
      {
        url: "/images/og/default.jpg",
        width: 1200,
        height: 630,
        alt: "Stone & Co. Solicitors - Legal Excellence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stone & Co. Solicitors | London Legal Services",
    description:
      "Experienced solicitors in London offering comprehensive legal services.",
    images: ["/images/og/default.jpg"],
  },
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${cormorantGaramond.variable} ${dmSans.variable}`}>
      <body className="font-sans bg-bg text-ink antialiased">
        <LawFirmSchema />
        <GoldRuleAnimator />
        <ScrollProgress />
        <SectionRiseObserver />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="min-h-screen pt-[56px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
