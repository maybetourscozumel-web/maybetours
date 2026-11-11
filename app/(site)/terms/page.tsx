import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you book a tour with May-Be Tours Cozumel.",
};

const LAST_UPDATED = "November 11, 2026";

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-white/50">Last updated: {LAST_UPDATED}</p>

      <div className="mt-10 space-y-10">
        <div>
          <p className="text-white/70">
            These terms apply whenever you book a tour through maybetours.com or directly with
            May-Be Tours Cozumel. By booking, you agree to them. Please also read our{" "}
            <Link href="/cancellation-policy" className="text-brand-ocean font-semibold">
              Cancellation &amp; Refund Policy
            </Link>
            , which is part of these terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Bookings &amp; payment</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-white/70">
            <li>Prices are listed in Mexican pesos (MXN) and include what&apos;s stated on each tour&apos;s page.</li>
            <li>Online payment is processed securely by Stripe. Where online payment isn&apos;t available, a reservation is confirmed and payment is collected in person before departure.</li>
            <li>A booking is confirmed once you receive a confirmation email with your booking reference.</li>
            <li>Availability is limited and confirmed at the time of booking — we recommend booking in advance, especially in high season.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Assumption of risk</h2>
          <p className="mt-3 text-white/70">
            Our tours involve water activities — snorkeling, diving, watersports and boat
            travel — that carry inherent risks, including but not limited to drowning, marine
            life encounters, sunburn, seasickness and injury from equipment or boat movement. By
            booking and participating, you acknowledge these risks and confirm that you (and
            anyone in your party) are physically fit to take part.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-white/70">
            <li>Life jackets are provided and must be worn as instructed by crew.</li>
            <li>Follow all safety instructions given by your guide or captain at all times.</li>
            <li>Let our team know in advance about any medical condition, mobility limitation, or inability to swim so we can advise on the best tour for you.</li>
            <li>Pregnant guests and guests with certain medical conditions should consult a doctor before booking watersports activities.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Changes we may need to make</h2>
          <p className="mt-3 text-white/70">
            Sea and weather conditions in Cozumel can change quickly. If conditions aren&apos;t
            safe, we may reschedule, modify, or in rare cases cancel a tour for your safety — see
            our{" "}
            <Link href="/cancellation-policy" className="text-brand-ocean font-semibold">
              Cancellation &amp; Refund Policy
            </Link>{" "}
            for what happens to your payment in that case.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Your responsibilities</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-white/70">
            <li>Arrive at the meeting point on time — late arrival may mean missing the tour with no refund.</li>
            <li>Provide accurate contact information so we can reach you about your booking.</li>
            <li>Behave respectfully towards crew, guides and other guests, and towards the marine environment and reef.</li>
            <li>Our crew may refuse boarding to anyone who appears intoxicated or poses a safety risk to themselves or others.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Liability</h2>
          <p className="mt-3 text-white/70">
            To the extent permitted by law, May-Be Tours Cozumel is not liable for personal
            injury, loss, or damage to belongings arising from participation in a tour, except
            where caused by our negligence. Nothing in these terms limits any liability that
            cannot be excluded under Mexican law.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Governing law</h2>
          <p className="mt-3 text-white/70">
            These terms are governed by the laws of Mexico and the state of Quintana Roo, where
            our tours operate.
          </p>
        </div>

        <div className="rounded-2xl border border-border-soft bg-surface p-6">
          <h2 className="text-xl font-bold text-white">Questions?</h2>
          <p className="mt-3 text-white/70">
            Reach us at{" "}
            <a href="mailto:info@maybetours.com" className="text-brand-ocean font-semibold">
              info@maybetours.com
            </a>{" "}
            or on{" "}
            <a href="https://wa.me/529871052528" className="text-brand-ocean font-semibold">
              WhatsApp
            </a>{" "}
            before you book if anything here is unclear.
          </p>
        </div>
      </div>
    </section>
  );
}
