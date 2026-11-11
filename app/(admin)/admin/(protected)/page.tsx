import { prisma } from "@/lib/prisma";
import { toDateOnly } from "@/lib/availability";
import { formatMXN, cn } from "@/lib/utils";
import Link from "next/link";
import { CalendarCheck, Users, CalendarRange, Wallet, UserPlus, ArrowRight } from "lucide-react";

const STATUS_DOT: Record<string, string> = {
  CONFIRMED: "bg-brand-ocean",
  PENDING_PAYMENT: "bg-brand-yellow",
  COMPLETED: "bg-white/30",
  CANCELLED: "bg-white/15",
  NO_SHOW: "bg-brand-red",
};

export default async function AdminOverviewPage() {
  const today = toDateOnly(new Date());
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [todayBookings, upcomingBookings, monthRevenue, totalCustomers] = await Promise.all([
    prisma.booking.findMany({
      where: { date: today, status: { in: ["CONFIRMED", "COMPLETED"] } },
      include: { tour: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.booking.count({
      where: {
        date: { gte: today, lte: weekFromNow },
        status: { in: ["CONFIRMED", "PENDING_PAYMENT"] },
      },
    }),
    prisma.booking.aggregate({
      where: {
        status: { in: ["CONFIRMED", "COMPLETED"] },
        createdAt: { gte: new Date(today.getFullYear(), today.getMonth(), 1) },
      },
      _sum: { totalPriceMXN: true },
    }),
    prisma.customer.count(),
  ]);

  const todayPeople = todayBookings.reduce((sum, b) => sum + b.partySize, 0);

  const stats = [
    { label: "Today's bookings", value: todayBookings.length, icon: CalendarCheck },
    { label: "Guests today", value: todayPeople, icon: Users },
    { label: "Next 7 days", value: upcomingBookings, icon: CalendarRange },
    {
      label: "Revenue this month",
      value: formatMXN(monthRevenue._sum.totalPriceMXN || 0),
      icon: Wallet,
    },
    { label: "Total customers", value: totalCustomers, icon: UserPlus },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-white">Overview</h1>
      <p className="mt-1 text-sm text-white/50">
        {new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(new Date())}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-border-soft bg-surface flex flex-col gap-3 rounded-2xl border p-4 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <stat.icon className="text-brand-ocean h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">{stat.value}</p>
              <p className="text-xs font-semibold text-white/50">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-border-soft bg-surface mt-8 rounded-2xl border shadow-sm">
        <div className="border-border-soft flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-bold text-white">Today&apos;s Schedule</h2>
          <Link
            href="/admin/calendar"
            className="text-brand-ocean flex items-center gap-1 text-sm font-semibold hover:text-white"
          >
            View calendar <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {todayBookings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
            <CalendarCheck className="h-8 w-8 text-white/15" />
            <p className="text-sm text-white/50">No bookings today.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {todayBookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "h-2.5 w-2.5 shrink-0 rounded-full",
                      STATUS_DOT[b.status] ?? "bg-white/30"
                    )}
                  />
                  <div>
                    <p className="font-semibold text-white">{b.tour.name}</p>
                    <p className="text-white/50">
                      {b.customerName} · {b.partySize} people
                    </p>
                  </div>
                </div>
                <span className="bg-brand-yellow/15 text-brand-yellow rounded-full px-3 py-1 text-xs font-bold">
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
