"use client";

import { useEffect, useState } from "react";

type Tour = {
  id: string;
  name: string;
  priceMXN: number;
  priceType: string;
  dailyCapacity: number;
  maxGroupSize: number;
  active: boolean;
};

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/tours")
      .then((r) => r.json())
      .then((data) => {
        setTours(data.tours ?? []);
        setLoading(false);
      });
  }, []);

  async function saveTour(id: string, patch: Partial<Tour>) {
    setSavingId(id);
    setTours((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    await fetch(`/api/admin/tours/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setSavingId(null);
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white">Tours</h1>
      <p className="mt-1 text-sm text-white/50">
        Adjust prices, capacity and visibility without touching code.
      </p>

      <div className="border-border-soft bg-surface mt-6 overflow-x-auto rounded-xl border shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-border-soft border-b bg-white/[0.03] text-xs font-semibold uppercase tracking-wide text-white/50">
            <tr>
              <th className="px-4 py-3">Tour</th>
              <th className="px-4 py-3">Price (MXN)</th>
              <th className="px-4 py-3">Daily Capacity</th>
              <th className="px-4 py-3">Max Party</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-white/40">
                  Loading…
                </td>
              </tr>
            ) : (
              tours.map((t) => (
                <tr key={t.id} className={savingId === t.id ? "opacity-60" : ""}>
                  <td className="px-4 py-3 font-medium text-white">
                    {t.name}
                    <span className="ml-2 text-xs text-white/40">
                      ({t.priceType === "PER_PERSON" ? "per person" : "per boat"})
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={t.priceMXN}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v !== t.priceMXN) saveTour(t.id, { priceMXN: v });
                      }}
                      className="border-border-strong w-24 rounded-lg border bg-white/5 px-2 py-1 text-white"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={t.dailyCapacity}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v !== t.dailyCapacity) saveTour(t.id, { dailyCapacity: v });
                      }}
                      className="border-border-strong w-20 rounded-lg border bg-white/5 px-2 py-1 text-white"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={t.maxGroupSize}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v !== t.maxGroupSize) saveTour(t.id, { maxGroupSize: v });
                      }}
                      className="border-border-strong w-20 rounded-lg border bg-white/5 px-2 py-1 text-white"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => saveTour(t.id, { active: !t.active })}
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        t.active
                          ? "bg-brand-ocean/15 text-brand-ocean"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {t.active ? "Active" : "Hidden"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && (
        <p className="mt-3 text-xs text-white/40">
          Changes save automatically when you click out of a field. Hidden tours are removed from
          the site entirely, including their booking page.
        </p>
      )}
    </div>
  );
}
