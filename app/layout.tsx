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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <head>
        {/* Default Statcounter code for huahinvibes.com https://www.huahinvibes.com */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
var sc_project=13338058;
var sc_invisible=1;
var sc_security="4d0535cb";
`,
          }}
        />
        <script
          type="text/javascript"
          src="https://www.statcounter.com/counter/counter.js"
          async
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <noscript>
          <div className="statcounter">
            <a
              title="Web Analytics"
              href="https://statcounter.com/"
              target="_blank"
              rel="nofollow noopener noreferrer external"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="statcounter"
                src="https://c.statcounter.com/13338058/0/4d0535cb/1/"
                alt="Web Analytics"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </a>
          </div>
        </noscript>
        {/* End of Statcounter Code */}
      </body>
    </html>
  );
}
