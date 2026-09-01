import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatClp } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  fulfilled: "Completado",
  cancelled: "Cancelado",
  failed: "Fallido",
};

const CATEGORY_LABEL: Record<string, string> = {
  package: "Paquetes",
  experience: "Experiencias",
  product: "Productos",
  vehicle_rental: "Vehículos",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string }>;
}) {
  const { status, category } = await searchParams;
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, customer_name, total_clp, status, created_at, order_items(item_type)")
    .order("created_at", { ascending: false });

  const filtered = (orders ?? []).filter((order) => {
    if (status && order.status !== status) return false;
    if (category && !order.order_items?.some((i) => i.item_type === category)) return false;
    return true;
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Pedidos</h1>

      <form className="mt-4 flex flex-wrap gap-3" method="get">
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
        >
          <option value="">Todas las categorías</option>
          {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-volcanic px-4 py-2 text-sm font-medium text-white hover:bg-volcanic-light"
        >
          Filtrar
        </button>
        {(status || category) && (
          <Link
            href="/admin/pedidos"
            className="flex items-center text-sm text-volcanic/60 hover:underline"
          >
            Limpiar filtros
          </Link>
        )}
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-sand-dark bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sand-dark text-left text-volcanic/60">
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-sand-dark/60 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/pedidos/${order.id}`} className="font-medium text-ocean hover:underline">
                    {order.customer_name}
                  </Link>
                </td>
                <td className="px-4 py-3">{formatClp(order.total_clp)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-volcanic/60">
                  {new Date(order.created_at).toLocaleDateString("es-CL")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/pedidos/${order.id}/recibo`}
                    className="text-sm text-ocean hover:underline"
                  >
                    Recibo
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-volcanic/50">
                  Sin pedidos que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    paid: "bg-emerald-100 text-emerald-800",
    fulfilled: "bg-ocean/15 text-ocean",
    cancelled: "bg-gray-100 text-gray-600",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${colors[status] ?? ""}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
