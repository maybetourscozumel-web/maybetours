import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { BUSINESS } from "@/lib/business";

// lucide-react dropped brand/social logos, so these two are small inline SVGs.
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
    </svg>
  );
}
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="bg-surface-deep mt-20 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Image
            src="/brand/logo-white.png"
            alt="May-Be Tours Cozumel"
            width={96}
            height={96}
            className="h-20 w-20"
          />
          <p className="mt-4 text-sm text-white/70">
            Snorkeling, diving &amp; watersports tours in Cozumel. Creating memories out of fun.
          </p>
          <a
            href={BUSINESS.socials.tripadvisor}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white"
          >
            <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
            {BUSINESS.rating.value}/5 on Tripadvisor ({BUSINESS.rating.count}+ reviews)
          </a>
          <div className="mt-4 flex items-center gap-3">
            <a
              href={BUSINESS.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="May-Be Tours on Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <FacebookIcon className="h-4.5 w-4.5" />
            </a>
            <a
              href={BUSINESS.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="May-Be Tours on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <InstagramIcon className="h-4.5 w-4.5" />
            </a>
            <a
              href={BUSINESS.socials.googleBusiness}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="May-Be Tours on Google"
              className="flex h-9 items-center justify-center rounded-full bg-white/10 px-3 text-xs font-bold text-white transition hover:bg-white/20"
            >
              Google
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-yellow">
            Plan Your Visit
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/tours" className="hover:text-white">
                All Tours
              </Link>
            </li>
            <li>
              <Link href="/cruise-excursions" className="hover:text-white">
                Cruise Ship Guests
              </Link>
            </li>
            <li>
              <Link href="/playa-del-carmen" className="hover:text-white">
                Day Trip from Playa del Carmen
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-yellow">
            Meeting Point
          </p>
          <p className="mt-3 text-sm text-white/80">
            Marina Cozumel ASIPONA
            <br />
            Carr. Costera Sur Km 6.5, Zona Hotelera Sur
            <br />
            77675 Cozumel, Quintana Roo, México
          </p>
          <p className="mt-3 text-sm text-white/80">Open daily, approx. 9:00 AM – 5:00 PM</p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-yellow">
            Contact Us
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <a href="https://wa.me/529871052528" className="hover:text-white">
                WhatsApp: +52 987 105 2528
              </a>
            </li>
            <li>
              <a href="tel:+529873043584" className="hover:text-white">
                Phone: +52 987 304 3584
              </a>
            </li>
            <li>
              <a href="mailto:info@maybetours.com" className="hover:text-white">
                info@maybetours.com
              </a>
            </li>
          </ul>
          <Link
            href="/tours"
            className="mt-5 inline-block rounded-full bg-brand-red px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-red/90"
          >
            Book a Tour
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        <p>© {new Date().getFullYear()} May-Be Tours Cozumel. All rights reserved.</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link href="/terms" className="hover:text-white">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/cancellation-policy" className="hover:text-white">
            Cancellation &amp; Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
