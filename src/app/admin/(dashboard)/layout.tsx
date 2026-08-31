import { requireAdminPage } from "@/lib/auth/admin-guard";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-6xl gap-8 px-4 py-8 sm:px-6">
      <AdminNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
