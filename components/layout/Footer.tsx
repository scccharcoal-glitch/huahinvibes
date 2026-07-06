import Link from "next/link";
import { MapPin, Globe, Share2, Mail } from "lucide-react";
import { getHomepageConfig } from "@/lib/site-config";

export default async function Footer() {
  const { sponsorLinks } = await getHomepageConfig();

  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-extrabold text-white mb-3">Hua Hin Vibes</h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Your premium guide to Hua Hin — Thailand&apos;s most beloved coastal destination.
              Discover the best restaurants, hotels, and experiences.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-primary" />
              Hua Hin, Prachuap Khiri Khan, Thailand
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/restaurants" className="hover:text-primary transition-colors">Restaurants</Link></li>
              <li><Link href="/hotels" className="hover:text-primary transition-colors">Hotels</Link></li>
              <li><Link href="/attractions" className="hover:text-primary transition-colors">Attractions</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/advertise" className="hover:text-primary transition-colors font-semibold text-primary/80">Advertise with Us</Link></li>
            </ul>
          </div>
          {sponsorLinks.length > 0 && (
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Sponsor Links</h4>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-400">
                {sponsorLinks.map((link, index) => (
                  <span key={`${link.url}-${index}`} className="inline-flex items-center gap-3">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                    {index < sponsorLinks.length - 1 && <span className="text-gray-600">|</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Hua Hin Vibes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
