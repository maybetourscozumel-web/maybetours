"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatMXN } from "@/lib/utils";

type RevenuePoint = { date: string; revenue: number };
type OccupancyPoint = { tourName: string; booked: number; occupancyPct: number };

const OCEAN = "#0E90A6";
const YELLOW = "#FFC20E";
const GRID_STROKE = "rgba(255,255,255,0.1)";
const TICK_FILL = "rgba(255,255,255,0.55)";
const TICK_FILL_STRONG = "rgba(255,255,255,0.7)";

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border-border-strong bg-surface-hover rounded-lg border px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-white">{label}</p>
      <p className="text-white/70">{formatMXN(payload[0].value)}</p>
    </div>
  );
}

function OccupancyTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: OccupancyPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="border-border-strong bg-surface-hover rounded-lg border px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-white">{d.tourName}</p>
      <p className="text-white/70">
        {d.occupancyPct}% occupancy · {d.booked} guests
      </p>
    </div>
  );
}

export default function ReportsCharts() {
  const [days, setDays] = useState(30);
  const [revenueSeries, setRevenueSeries] = useState<RevenuePoint[]>([]);
  const [occupancy, setOccupancy] = useState<OccupancyPoint[]>([]);
  const [totals, setTotals] = useState({ totalRevenue: 0, totalBookings: 0, totalGuests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset loading when `days` changes
    setLoading(true);
    fetch(`/api/admin/reports?days=${days}`)
      .then((r) => r.json())
      .then((data) => {
        setRevenueSeries(data.revenueSeries ?? []);
        setOccupancy(data.occupancy ?? []);
        setTotals(data.totals ?? { totalRevenue: 0, totalBookings: 0, totalGuests: 0 });
        setLoading(false);
      });
  }, [days]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                days === d
                  ? "bg-brand-red text-white"
                  : "text-white/60 bg-white/5 hover:bg-white/10"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border-border-soft bg-surface rounded-xl border p-4 shadow-sm">
          <p className="text-xs font-semibold text-white/50">Revenue</p>
          <p className="mt-1 text-2xl font-extrabold text-white">
            {formatMXN(totals.totalRevenue)}
          </p>
        </div>
        <div className="border-border-soft bg-surface rounded-xl border p-4 shadow-sm">
          <p className="text-xs font-semibold text-white/50">Bookings</p>
          <p className="mt-1 text-2xl font-extrabold text-white">{totals.totalBookings}</p>
        </div>
        <div className="border-border-soft bg-surface rounded-xl border p-4 shadow-sm">
          <p className="text-xs font-semibold text-white/50">Guests</p>
          <p className="mt-1 text-2xl font-extrabold text-white">{totals.totalGuests}</p>
        </div>
      </div>

      <div className="border-border-soft bg-surface mt-6 rounded-xl border p-5 shadow-sm">
        <h2 className="font-bold text-white">Revenue over time</h2>
        <div className="mt-4 h-64">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-white/40">
              Loading…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: TICK_FILL }}
                  tickLine={false}
                  axisLine={{ stroke: GRID_STROKE }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: TICK_FILL }}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={OCEAN}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: OCEAN }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="border-border-soft bg-surface mt-6 rounded-xl border p-5 shadow-sm">
        <h2 className="font-bold text-white">Occupancy by tour</h2>
        <div className="mt-4 h-72">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-white/40">
              Loading…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={occupancy}
                layout="vertical"
                margin={{ left: 0, right: 24, top: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: TICK_FILL }}
                  tickLine={false}
                  axisLine={{ stroke: GRID_STROKE }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="tourName"
                  tick={{ fontSize: 11, fill: TICK_FILL_STRONG }}
                  tickLine={false}
                  axisLine={false}
                  width={160}
                />
                <Tooltip content={<OccupancyTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                <Bar dataKey="occupancyPct" fill={YELLOW} radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
