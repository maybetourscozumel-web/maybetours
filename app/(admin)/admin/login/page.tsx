"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid email or password");
        setSubmitting(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <Image
        src="/brand/logo-white-wordmark.png"
        alt="May-Be Tours Cozumel"
        width={280}
        height={75}
        className="h-auto w-56"
        priority
      />
      <div className="border-border-soft bg-surface w-full max-w-sm rounded-2xl border p-8 shadow-xl">
        <div className="flex flex-col items-center">
          <Image
            src="/brand/favicon.png"
            alt="May-Be Tours Cozumel"
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover"
          />
          <h1 className="mt-4 text-xl font-extrabold text-white">Booking Manager</h1>
          <p className="text-sm text-white/50">Sign in to manage reservations</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold text-white">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border-strong focus:border-brand-ocean rounded-lg border bg-white/5 px-3 py-2 text-base text-white outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-white">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border-strong focus:border-brand-ocean rounded-lg border bg-white/5 px-3 py-2 text-base text-white outline-none"
            />
          </label>

          {error && <p className="text-brand-red text-sm font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-brand-red px-6 py-3 text-base font-bold text-white shadow-md transition hover:bg-brand-red/90 disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
