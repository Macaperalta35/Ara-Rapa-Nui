"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { updateOrderStatus } from "@/lib/orders/update-status";
import { isMercadoPagoConfigured } from "@/lib/mercadopago/types";

/**
 * Stands in for the Mercado Pago webhook during development, when no
 * MERCADOPAGO_ACCESS_TOKEN is configured. Exercises the exact same
 * updateOrderStatus() call the real webhook uses, so swapping in real
 * credentials later requires no code changes downstream.
 */
export async function resolveMockPayment(orderId: string, approved: boolean) {
  if (isMercadoPagoConfigured()) {
    throw new Error("Mercado Pago is configured — the mock payment flow is disabled.");
  }

  // Refuse to touch an order that's already settled (paid/fulfilled) or
  // already terminally closed — this is a public, unauthenticated route
  // (the customer already knows their own order id from the confirmation
  // URL), so it must be idempotent and never reopen a finished order.
  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .maybeSingle();

  if (!order || order.status !== "pending") {
    throw new Error("Este pedido ya fue procesado.");
  }

  await updateOrderStatus(orderId, approved ? "paid" : "failed");
}
