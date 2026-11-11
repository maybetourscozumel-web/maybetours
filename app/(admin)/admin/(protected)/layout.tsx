import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Sidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="bg-surface-deep flex h-screen overflow-hidden">
      <Sidebar adminName={session.name} />
      <main className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-8 sm:px-10">
        {children}
      </main>
    </div>
  );
}
