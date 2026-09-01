import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatClp } from "@/lib/format";
import { updateOrderStatusAction } from "@/lib/actions/admin-orders";
import type { OrderStatus } from "@/lib/orders/update-status";

const STATUSES: OrderStatus[] = ["pending", "paid", "fulfilled", "cancelled", "failed"];

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", id),
  ]);

  if (!order) notFound();

  async function setStatus(formData: FormData) {
    "use server";
    const status = formData.get("status") as OrderStatus;
    await updateOrderStatusAction(id, status);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">
        Pedido de {order.customer_name}
      </h1>
      <p className="mt-1 text-sm text-volcanic/60">
        {order.customer_email} · {order.customer_phone}
      </p>

      <div className="mt-6 rounded-2xl border border-sand-dark bg-white p-6">
        <ul className="flex flex-col gap-3">
          {(items ?? []).map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}× {item.name_snapshot}
                {item.selected_date && item.selected_end_date
                  ? ` (${item.selected_date} → ${item.selected_end_date})`
                  : item.selected_date
                    ? ` (${item.selected_date})`
                    : ""}
              </span>
              <span className="font-medium">{formatClp(item.unit_price_clp * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-sand-dark pt-4 font-medium">
          <span>Total</span>
          <span className="font-display text-lg text-terracotta">{formatClp(order.total_clp)}</span>
        </div>
      </div>

      <form action={setStatus} className="mt-6 flex items-center gap-3">
        <select
          name="status"
          defaultValue={order.status}
          className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-volcanic px-5 py-2 text-sm font-semibold text-white hover:bg-volcanic-light"
        >
          Actualizar estado
        </button>
      </form>
    </div>
  );
}
