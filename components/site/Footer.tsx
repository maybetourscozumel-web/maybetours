import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="bg-surface-deep mt-20 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
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
