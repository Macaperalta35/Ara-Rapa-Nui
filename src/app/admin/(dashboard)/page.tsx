import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: pendingOrders }, { count: newRequests }] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("special_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Panel</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/pedidos"
          className="rounded-2xl border border-sand-dark bg-white p-6 hover:shadow-md"
        >
          <p className="text-sm text-volcanic/60">Pedidos pendientes</p>
          <p className="mt-1 font-display text-3xl font-semibold text-terracotta">
            {pendingOrders ?? 0}
          </p>
        </Link>
        <Link
          href="/admin/solicitudes"
          className="rounded-2xl border border-sand-dark bg-white p-6 hover:shadow-md"
        >
          <p className="text-sm text-volcanic/60">Solicitudes nuevas</p>
          <p className="mt-1 font-display text-3xl font-semibold text-terracotta">
            {newRequests ?? 0}
          </p>
        </Link>
      </div>
    </div>
  );
}
