import ReportsCharts from "@/components/admin/ReportsCharts";

export default function AdminReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white">Reports</h1>
      <p className="mt-1 text-sm text-white/50">Revenue and occupancy trends.</p>
      <div className="mt-6">
        <ReportsCharts />
      </div>
    </div>
  );
}
