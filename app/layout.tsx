import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getHomepageConfig } from "@/lib/site-config";
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
    default: "Hua Hin Vibes — Hua Hin Travel Guide, Restaurants, Hotels & Real Estate",
    template: "%s | Hua Hin Vibes",
  },
  description:
    "Explore Hua Hin with local guides to restaurants, hotels, attractions, Thailand news, travel tips, and real estate across Thailand's favorite coastal destination.",
  keywords: ["hua hin", "travel guide", "restaurant", "hotel", "thailand", "beach", "real estate"],
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { customHeadHtml, customBodyHtml } = await getHomepageConfig();

  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <head
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: customHeadHtml }}
      />
      <body className="min-h-full flex flex-col">
        {children}
        {customBodyHtml && (
          <div
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: customBodyHtml }}
          />
        )}
      </body>
    </html>
  );
}
