import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

export default async function AdminPage() {
  await requireAdminAccess();

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-facebook-text">Dashboard admin</h1>
        <p className="text-facebook-muted mt-2">Valide ou refuse les comptes avant leur accès au site.</p>
      </div>

      <AdminDashboardClient />
    </div>
  );
}
