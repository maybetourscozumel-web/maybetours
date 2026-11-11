"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";

type Blackout = {
  id: string;
  date: string;
  reason: string | null;
  tour: { name: string } | null;
};

export default function AdminSettingsPage() {
  const [blackouts, setBlackouts] = useState<Blackout[]>([]);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/blackouts");
    const data = await res.json();
    setBlackouts(data.blackouts ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    await fetch("/api/admin/blackouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, reason: reason || undefined }),
    });
    setDate("");
    setReason("");
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/blackouts/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white">Settings</h1>
      <p className="mt-1 text-sm text-white/50">
        Block out whole-company dates (holidays, weather days). Per-tour blocks can be added
        later from here too.
      </p>

      <form
        onSubmit={handleAdd}
        className="border-border-soft bg-surface mt-6 flex flex-wrap items-end gap-3 rounded-xl border p-4 shadow-sm"
      >
        <label className="flex flex-col gap-1 text-xs font-semibold text-white">
          Date
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-border-strong rounded-lg border bg-white/5 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="flex min-w-[160px] flex-1 flex-col gap-1 text-xs font-semibold text-white">
          Reason (optional)
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Tropical storm"
            className="border-border-strong rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-brand-red px-5 py-2 text-sm font-bold text-white"
        >
          Block Date
        </button>
      </form>

      <div className="border-border-soft bg-surface mt-4 rounded-xl border shadow-sm">
        {loading ? (
          <p className="px-5 py-8 text-center text-sm text-white/40">Loading…</p>
        ) : blackouts.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-white/40">No blocked dates.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {blackouts.map((b) => (
              <li key={b.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <p className="font-semibold text-white">{formatDate(b.date)}</p>
                  <p className="text-xs text-white/40">
                    {b.tour ? b.tour.name : "All tours"}
                    {b.reason ? ` · ${b.reason}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="hover:text-brand-red rounded-full p-2 text-white/40 hover:bg-white/5"
                  aria-label="Remove blocked date"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
