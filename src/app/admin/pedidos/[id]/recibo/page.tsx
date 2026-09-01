import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth/admin-guard";
import { createClient } from "@/lib/supabase/server";
import { formatClp } from "@/lib/format";
import { PrintButton } from "@/components/admin/PrintButton";

export default async function OrderReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage();
  const { id } = await params;

  const supabase = await createClient();
  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", id),
  ]);

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-xl px-6 py-12 print:py-0">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-volcanic">Ara Rapa Nui</h1>
          <p className="text-sm text-volcanic/60">Recibo de compra</p>
        </div>
        <PrintButton />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs uppercase text-volcanic/40">Número de pedido</p>
          <p className="font-mono">{order.id}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-volcanic/40">Fecha</p>
          <p>{new Date(order.created_at).toLocaleString("es-CL")}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-volcanic/40">Cliente</p>
          <p>{order.customer_name}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-volcanic/40">Contacto</p>
          <p>
            {order.customer_email} · {order.customer_phone}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-volcanic/40">Estado</p>
          <p className="capitalize">{order.status}</p>
        </div>
        {order.mp_payment_id && (
          <div>
            <p className="text-xs uppercase text-volcanic/40">ID de pago Mercado Pago</p>
            <p className="font-mono">{order.mp_payment_id}</p>
          </div>
        )}
      </div>

      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="border-b border-sand-dark text-left text-volcanic/60">
            <th className="py-2">Ítem</th>
            <th className="py-2 text-right">Cant.</th>
            <th className="py-2 text-right">Precio unit.</th>
            <th className="py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {(items ?? []).map((item) => (
            <tr key={item.id} className="border-b border-sand-dark/60">
              <td className="py-2">
                {item.name_snapshot}
                {item.selected_date && item.selected_end_date
                  ? ` (${item.selected_date} → ${item.selected_end_date})`
                  : item.selected_date
                    ? ` (${item.selected_date})`
                    : ""}
              </td>
              <td className="py-2 text-right">{item.quantity}</td>
              <td className="py-2 text-right">{formatClp(item.unit_price_clp)}</td>
              <td className="py-2 text-right">{formatClp(item.unit_price_clp * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end border-t border-sand-dark pt-4">
        <div className="text-right">
          <p className="text-sm text-volcanic/60">Total</p>
          <p className="font-display text-2xl font-semibold text-terracotta">
            {formatClp(order.total_clp)}
          </p>
        </div>
      </div>
    </div>
  );
}
