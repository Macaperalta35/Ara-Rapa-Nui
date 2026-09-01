import { requireCustomerPage } from "@/lib/auth/customer-guard";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-locale";
import { formatClp } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  fulfilled: "Completado",
  cancelled: "Cancelado",
  failed: "Fallido",
};

export default async function MyOrdersPage() {
  const user = await requireCustomerPage();
  const { dict } = await getDictionary();

  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total_clp, created_at, order_items(name_snapshot, quantity)")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-volcanic">{dict.account.orders}</h1>

      {(orders ?? []).length === 0 ? (
        <p className="mt-6 text-volcanic/60">{dict.account.noOrdersYet}</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {(orders ?? []).map((order) => (
            <li key={order.id} className="rounded-2xl border border-sand-dark bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-volcanic/60">
                  {new Date(order.created_at).toLocaleDateString("es-CL")}
                </span>
                <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-volcanic/70">
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>
              <ul className="mt-3 flex flex-col gap-1 text-sm text-volcanic/80">
                {(order.order_items ?? []).map((item, i) => (
                  <li key={i}>
                    {item.quantity}× {item.name_snapshot}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-display text-lg font-semibold text-terracotta">
                {formatClp(order.total_clp)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
