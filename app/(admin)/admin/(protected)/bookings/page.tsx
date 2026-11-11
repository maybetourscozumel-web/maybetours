import BookingsTable from "@/components/admin/BookingsTable";

export default function AdminBookingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white">Bookings</h1>
      <p className="mt-1 text-sm text-white/50">Search, filter and manage all reservations.</p>
      <div className="mt-6">
        <BookingsTable />
      </div>
    </div>
  );
}
