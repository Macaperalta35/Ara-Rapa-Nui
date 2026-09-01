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

  if (current && current.status !== "paid" && current.status !== "fulfilled" && status === "paid") {
    await awardReferralCreditIfDue(orderId);
  }
}

/**
 * If this order belongs to a customer who was referred by someone, and
 * that referral hasn't paid out yet, credits the referrer and marks it
 * given — runs once per referred customer, on their first paid order.
 */
async function awardReferralCreditIfDue(orderId: string): Promise<void> {
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("customer_id")
    .eq("id", orderId)
    .maybeSingle();
  if (!order?.customer_id) return;

  const { data: customer } = await supabase
    .from("customers")
    .select("id, referred_by_code, referral_reward_given")
    .eq("id", order.customer_id)
    .maybeSingle();
  if (!customer || !customer.referred_by_code || customer.referral_reward_given) return;

  const { data: referrer } = await supabase
    .from("customers")
    .select("id")
    .eq("referral_code", customer.referred_by_code)
    .maybeSingle();
  if (!referrer) return;

  const { data: settings } = await supabase
    .from("site_settings")
    .select("referral_reward_clp")
    .eq("id", 1)
    .maybeSingle();
  const rewardClp = settings?.referral_reward_clp ?? 5000;

  // Mark given first, then award — if the award step fails we log it
  // rather than retry-loop on every future order for this customer.
  const { error: markError } = await supabase
    .from("customers")
    .update({ referral_reward_given: true })
    .eq("id", customer.id)
    .eq("referral_reward_given", false); // guards against a concurrent double-award
  if (markError || !rewardClp) return;

  const { error: creditError } = await supabase.rpc("add_credit", {
    p_customer_id: referrer.id,
    p_amount: rewardClp,
  });
  if (creditError) {
    console.error(`awardReferralCreditIfDue: failed to credit ${referrer.id}:`, creditError.message);
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
