import "server-only";
import type { OrderForPayment, OrderItemForPayment } from "./types";
import { isMercadoPagoConfigured } from "./types";
import { createRealPreference } from "./client";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/**
 * Returns a checkout URL for the given order. Uses real Mercado Pago when
 * MERCADOPAGO_ACCESS_TOKEN is set; otherwise falls back to the built-in
 * mock payment page so the whole flow stays testable without an account.
 */
export async function createPaymentPreference(
  order: OrderForPayment,
  items: OrderItemForPayment[],
): Promise<{ initPoint: string; preferenceId: string | null }> {
  if (!isMercadoPagoConfigured()) {
    console.warn("MercadoPago not configured — using mock payment flow");
    return { initPoint: `${siteUrl()}/checkout/mock-payment/${order.id}`, preferenceId: null };
  }

  return createRealPreference(order, items);
}
