import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled" | "failed";

const TERMINAL_FAILURE_STATUSES: OrderStatus[] = ["cancelled", "failed"];

/**
 * Updates an order's status. If this moves the order into a terminal
 * "didn't happen" state (cancelled/failed) for the first time, also gives
 * back any product stock reserved for it — a payment can fail or be
 * refunded well after checkout reserved that stock.
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  mpPaymentId?: string,
) {
  const supabase = createAdminClient();

  const { data: current } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .maybeSingle();

  const { error } = await supabase
    .from("orders")
    .update({ status, ...(mpPaymentId ? { mp_payment_id: mpPaymentId } : {}) })
    .eq("id", orderId);

  if (error) throw new Error(error.message);

  if (
    current &&
    !TERMINAL_FAILURE_STATUSES.includes(current.status as OrderStatus) &&
    TERMINAL_FAILURE_STATUSES.includes(status)
  ) {
    await restoreStockForOrder(orderId);
  }
}

/** Gives back stock reserved for a set of product order_items — used when a
 * checkout fails partway through, before an order status even exists yet. */
export async function restoreProductStock(
  items: { item_id: string; quantity: number }[],
): Promise<void> {
  const supabase = createAdminClient();
  for (const item of items) {
    const { error } = await supabase.rpc("increment_stock", {
      p_product_id: item.item_id,
      p_qty: item.quantity,
    });
    if (error) {
      console.error(`restoreProductStock: failed to restore ${item.item_id}:`, error.message);
    }
  }
}

/** Restores stock for every product line in an order (e.g. on cancellation). */
export async function restoreStockForOrder(orderId: string): Promise<void> {
  const supabase = createAdminClient();
  const { data: items, error } = await supabase
    .from("order_items")
    .select("item_id, quantity")
    .eq("order_id", orderId)
    .eq("item_type", "product");

  if (error) {
    console.error(`restoreStockForOrder: failed to load items for ${orderId}:`, error.message);
    return;
  }
  if (items && items.length > 0) {
    await restoreProductStock(items);
  }
}
