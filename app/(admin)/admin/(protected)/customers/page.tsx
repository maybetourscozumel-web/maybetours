"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { formatMXN, formatDate } from "@/lib/utils";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bookingCount: number;
  totalSpentMXN: number;
  lastBooking: { date: string; tourName: string } | null;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((data) => {
        setCustomers(data.customers ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = customers.filter((c) => {
    const needle = q.toLowerCase();
    return (
      c.name.toLowerCase().includes(needle) ||
      c.email.toLowerCase().includes(needle) ||
      (c.phone ?? "").includes(needle)
    );
  });

  function exportCsv() {
    const headers = ["Name", "Email", "Phone", "Bookings", "Total Spent MXN", "Last Booking"];
    const escape = (value: string | number) => {
      const str = String(value);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };
    const rows = filtered.map((c) =>
      [
        c.name,
        c.email,
        c.phone ?? "",
        c.bookingCount,
        c.totalSpentMXN,
        c.lastBooking ? `${formatDate(c.lastBooking.date)} · ${c.lastBooking.tourName}` : "",
      ]
        .map(escape)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white">Customers</h1>
      <p className="mt-1 text-sm text-white/50">
        Everyone who has booked with May-Be Tours, with their booking history.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search customers…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border-border-strong w-full max-w-sm rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30"
        />
        <button
          type="button"
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="border-border-strong flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      <div className="border-border-soft bg-surface mt-4 overflow-x-auto rounded-xl border shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-border-soft border-b bg-white/[0.03] text-xs font-semibold uppercase tracking-wide text-white/50">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Bookings</th>
              <th className="px-4 py-3">Total Spent</th>
              <th className="px-4 py-3">Last Booking</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-white/40">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-white/40">
                  No customers yet.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                  <td className="px-4 py-3 text-white/60">
                    <p>{c.email}</p>
                    {c.phone && <p className="text-xs text-white/40">{c.phone}</p>}
                  </td>
                  <td className="px-4 py-3 text-white">{c.bookingCount}</td>
                  <td className="px-4 py-3 font-semibold text-white">{formatMXN(c.totalSpentMXN)}</td>
                  <td className="px-4 py-3 text-white/50">
                    {c.lastBooking
                      ? `${formatDate(c.lastBooking.date)} · ${c.lastBooking.tourName}`
                      : "—"}
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
