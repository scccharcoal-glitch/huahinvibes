import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.huahinvibes.com")
  .replace("https://huahinvibes.com", "https://www.huahinvibes.com")
  .replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Hua Hin Vibes — Your Premium Hua Hin Travel Guide",
    template: "%s | Hua Hin Vibes",
  },
  description:
    "Discover the best restaurants, hotels, and attractions in Hua Hin. Your ultimate luxury travel guide to Thailand's premier coastal destination.",
  keywords: ["hua hin", "travel", "restaurant", "hotel", "thailand", "beach"],
  openGraph: {
    siteName: "Hua Hin Vibes",
    type: "website",
    locale: "en_US",
    url: baseUrl,
  },
  alternates: { canonical: baseUrl },
  robots: { index: true, follow: true },
  verification: {
    google: "WIF0JFtga46A-vigvCRn6kyCfSU9Fl3cu0Bhgn8Mjns",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
