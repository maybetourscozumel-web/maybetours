"use client";

import { useEffect, useState, useCallback } from "react";
import { Download } from "lucide-react";
import { formatDate, formatMXN, cn } from "@/lib/utils";

type Booking = {
  id: string;
  date: string;
  partySize: number;
  customerName: string;
  email: string;
  phone: string;
  totalPriceMXN: number;
  status: string;
  paymentStatus: string;
  source: string;
  notes: string | null;
  tour: { name: string; slug: string };
};

const STATUS_OPTIONS = ["PENDING_PAYMENT", "CONFIRMED", "COMPLETED", "NO_SHOW", "CANCELLED"];

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-brand-ocean/15 text-brand-ocean",
  PENDING_PAYMENT: "bg-brand-yellow/20 text-brand-yellow",
  COMPLETED: "bg-white/10 text-white/60",
  CANCELLED: "bg-white/5 text-white/30 line-through",
  NO_SHOW: "bg-brand-red/15 text-brand-red",
};

export default function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const res = await fetch(`/api/admin/bookings?${params.toString()}`);
    const data = await res.json();
    setBookings(data.bookings ?? []);
    setLoading(false);
  }, [q, status]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function updateStatus(id: string, newStatus: string) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  function exportCsv() {
    const headers = [
      "Date",
      "Tour",
      "Customer",
      "Email",
      "Phone",
      "Party Size",
      "Total MXN",
      "Source",
      "Status",
    ];
    const escape = (value: string | number) => {
      const str = String(value);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };
    const rows = bookings.map((b) =>
      [
        formatDate(b.date),
        b.tour.name,
        b.customerName,
        b.email,
        b.phone,
        b.partySize,
        b.totalPriceMXN,
        b.source,
        b.status,
      ]
        .map(escape)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search name, email or phone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border-border-strong min-w-[200px] flex-1 rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border-border-strong rounded-lg border bg-white/5 px-3 py-2 text-sm text-white"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={exportCsv}
          disabled={bookings.length === 0}
          className="border-border-strong flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      <div className="border-border-soft bg-surface overflow-x-auto rounded-xl border shadow-sm">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-border-soft border-b bg-white/[0.03] text-xs font-semibold uppercase tracking-wide text-white/50">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Tour</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Party</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-white/40">
                  Loading…
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-white/40">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-medium text-white">{formatDate(b.date)}</td>
                  <td className="px-4 py-3 text-white">{b.tour.name}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{b.customerName}</p>
                    <p className="text-xs text-white/40">{b.email}</p>
                  </td>
                  <td className="px-4 py-3 text-white">{b.partySize}</td>
                  <td className="px-4 py-3 text-white">{formatMXN(b.totalPriceMXN)}</td>
                  <td className="px-4 py-3 text-xs text-white/50">{b.source}</td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className={cn(
                        "rounded-full border-0 px-2.5 py-1 text-xs font-bold outline-none",
                        STATUS_STYLES[b.status] ?? "bg-white/10 text-white"
                      )}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
