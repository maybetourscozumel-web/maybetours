import Link from "next/link";
import Image from "next/image";
import { Compass, ArrowRight } from "lucide-react";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <Link href="/" className="mb-10">
        <Image
          src="/brand/logo-white-wordmark.png"
          alt="May-Be Tours Cozumel"
          width={280}
          height={75}
          className="h-auto w-44"
        />
      </Link>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
        <Compass className="text-brand-ocean h-10 w-10" />
      </div>
      <h1 className="font-display mt-6 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Looks like you&apos;ve drifted off course
      </h1>
      <p className="mt-3 max-w-xl text-white/60">
        We couldn&apos;t find that page — it may have moved, or the current isn&apos;t pointing
        this way. Let&apos;s get you back on the boat.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/tours"
          className="inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-brand-red/90"
        >
          Browse Tours
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-7 py-3.5 text-base font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
