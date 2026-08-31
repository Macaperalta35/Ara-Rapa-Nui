import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled" | "failed";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  mpPaymentId?: string,
) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ status, ...(mpPaymentId ? { mp_payment_id: mpPaymentId } : {}) })
    .eq("id", orderId);

  if (error) throw new Error(error.message);
}
