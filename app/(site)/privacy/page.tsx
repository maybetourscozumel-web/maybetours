import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How May-Be Tours Cozumel collects, uses and protects your personal information.",
};

const LAST_UPDATED = "November 11, 2026";

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-white/50">Last updated: {LAST_UPDATED}</p>

      <div className="mt-10 space-y-10">
        <div>
          <p className="text-white/70">
            May-Be Tours Cozumel (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates
            maybetours.com and the tour booking service available on it. This policy explains
            what information we collect when you browse the site or book a tour, how we use it,
            and how it&apos;s protected, in line with Mexico&apos;s Federal Law on the Protection
            of Personal Data Held by Private Parties (LFPDPPP).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Information we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-white/70">
            <li>
              <strong className="text-white">Booking details</strong> — name, email address,
              phone number, tour selected, date, party size, and any notes you add when you
              reserve a tour.
            </li>
            <li>
              <strong className="text-white">Payment information</strong> — when you pay online,
              your card details are collected and processed directly by Stripe, our payment
              processor. We never see or store your full card number.
            </li>
            <li>
              <strong className="text-white">Device preferences</strong> — tours you&apos;ve
              saved/favorited are stored in your browser&apos;s local storage, on your device
              only. We don&apos;t receive or store this list.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">How we use it</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-white/70">
            <li>To confirm, manage and remind you about your booking.</li>
            <li>To send booking confirmation and receipt emails.</li>
            <li>To contact you by phone, email or WhatsApp about your reservation.</li>
            <li>To keep internal records for availability, scheduling and revenue reporting.</li>
          </ul>
          <p className="mt-3 text-white/70">
            We don&apos;t sell your personal information, and we don&apos;t use it for
            advertising or marketing unless you separately opt in to hear from us.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Who we share it with</h2>
          <p className="mt-3 text-white/70">
            We share the minimum information needed with two service providers that help us run
            the booking system:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-white/70">
            <li>
              <strong className="text-white">Stripe</strong> — processes online card payments.
            </li>
            <li>
              <strong className="text-white">Resend</strong> — delivers booking confirmation and
              notification emails on our behalf.
            </li>
          </ul>
          <p className="mt-3 text-white/70">
            We don&apos;t share your information with anyone else, except where required by law.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">How long we keep it</h2>
          <p className="mt-3 text-white/70">
            We keep booking records for as long as needed for accounting, legal and tax
            obligations under Mexican law. You can ask us to delete personal information that
            isn&apos;t legally required to be kept — see &ldquo;Your rights&rdquo; below.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Your rights</h2>
          <p className="mt-3 text-white/70">
            Under the LFPDPPP, you have the right to access, correct, or request deletion of your
            personal data, and to object to or limit how we use it (derechos ARCO). To exercise
            any of these rights, contact us using the details below.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Children</h2>
          <p className="mt-3 text-white/70">
            Our tours are family-friendly, but bookings are made by an adult. We don&apos;t
            knowingly collect personal information directly from children.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Changes to this policy</h2>
          <p className="mt-3 text-white/70">
            We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at
            the top of this page reflects the most recent changes.
          </p>
        </div>

        <div className="rounded-2xl border border-border-soft bg-surface p-6">
          <h2 className="text-xl font-bold text-white">Contact us</h2>
          <p className="mt-3 text-white/70">
            Questions about this policy or your personal data? Reach us at{" "}
            <a href="mailto:info@maybetours.com" className="text-brand-ocean font-semibold">
              info@maybetours.com
            </a>{" "}
            or on{" "}
            <a href="https://wa.me/529871052528" className="text-brand-ocean font-semibold">
              WhatsApp
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
