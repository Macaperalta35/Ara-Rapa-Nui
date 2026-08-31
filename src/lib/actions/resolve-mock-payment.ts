"use server";

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
  await updateOrderStatus(orderId, approved ? "paid" : "failed");
}
