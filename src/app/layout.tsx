import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import { LawFirmSchema } from "@/components/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    "Experienced solicitors in London offering Family Law, Immigration, Employment Law, Criminal Defense and more. Offices in the City (EC2Y) and Leytonstone (E11).",
  keywords: [
    "solicitors london",
    "family law",
    "immigration lawyer",
    "employment solicitor",
    "criminal defense",
    "housing disrepair",
    "landlord tenant",
    "children law",
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
      "Experienced solicitors in London offering Family Law, Immigration, Employment Law, Criminal Defense and more.",
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
    <html lang="en-GB" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-sans bg-bg text-ink antialiased">
        <LawFirmSchema />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="min-h-screen pt-[72px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
