"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/hooks/useFavorites";

const NAV_LINKS = [
  { href: "/tours", label: "Tours" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

const WHATSAPP_NUMBER = "529871052528";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { saved, hydrated } = useFavorites();
  const savedCount = hydrated ? saved.length : 0;

  return (
    <header className="border-border-soft bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/brand/favicon.png"
            alt="May-Be Tours Cozumel"
            width={56}
            height={56}
            className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
            priority
          />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-lg font-extrabold tracking-tight text-white">
              MAY-BE TOURS
            </span>
            <span className="text-brand-yellow text-xs font-medium">Snorkeling · Cozumel</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-brand-yellow text-sm font-semibold text-white/80 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-yellow text-sm font-semibold hover:text-white"
          >
            +52 987 105 2528
          </a>
          <Link
            href="/saved"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10"
            aria-label="Saved tours"
          >
            <Heart className={savedCount > 0 ? "h-5 w-5 fill-brand-red text-brand-red" : "h-5 w-5"} />
            {savedCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </Link>
          <Link
            href="/tours"
            className="rounded-full bg-brand-red px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-red/90"
          >
            Book a Tour
          </Link>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 block h-0.5 w-6 bg-white transition ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-0.5 w-6 bg-white transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 top-[14px] block h-0.5 w-6 bg-white transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-border-soft bg-background border-t px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-yellow text-base font-semibold"
            >
              WhatsApp +52 987 105 2528
            </a>
            <Link
              href="/saved"
              className="flex items-center gap-2 text-base font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              <Heart className={savedCount > 0 ? "h-5 w-5 fill-brand-red text-brand-red" : "h-5 w-5"} />
              Saved tours {savedCount > 0 && `(${savedCount})`}
            </Link>
            <Link
              href="/tours"
              className="rounded-full bg-brand-red px-5 py-3 text-center text-base font-bold text-white"
              onClick={() => setOpen(false)}
            >
              Book a Tour
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
