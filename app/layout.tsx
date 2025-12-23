import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header"; 
import Footer from "./components/Footer";
import NextTopLoader from 'nextjs-toploader';
import GoogleAnalytics from "./components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

// --- GÜNCEL ALAN ADI ---
const SITE_DOMAIN = "https://www.ezm-danismanlik.com"; 

export const metadata: Metadata = {
  metadataBase: new URL(SITE_DOMAIN),
  title: {
    default: "EZM Danışmanlık | Hukuk, Bilişim ve Gayrimenkul",
    template: "%s | EZM Danışmanlık",
  },
  description: "Konya merkezli hukuk, adli bilişim ve gayrimenkul danışmanlığı hizmetleri. Profesyonel çözümler için yanınızdayız.",
  keywords: ["konya danışmanlık", "adli bilişim", "gayrimenkul", "hukuk bürosu", "konya arsa", "bilişim hukuku", "vaka analiz"],
  authors: [{ name: "EZM Danışmanlık", url: SITE_DOMAIN }],
  creator: "EZM Danışmanlık",
  alternates: {
    canonical: "./", 
  },
  // --- DİKKAT: Buraya tekrar icons veya verification ekleme, aşağıda tek bir tane var ---
  
  verification: {
    google: "OTmcvd6h4FXipsnosZfNBLgI_NqhldI-mM8q4KjTvco",
  },
  openGraph: {
    title: "EZM Danışmanlık",
    description: "Profesyonel Çözüm Ortağınız",
    url: SITE_DOMAIN,
    siteName: "EZM Danışmanlık",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EZM Danışmanlık Kurumsal",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ezmdanismanlik",
    creator: "@ezmdanismanlik",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

  return (
    <html lang="tr">
      <body className={inter.className}>
        <NextTopLoader 
          color="#0d9488"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #0d9488,0 0 5px #0d9488"
        />
        
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}