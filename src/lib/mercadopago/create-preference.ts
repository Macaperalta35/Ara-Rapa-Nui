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

  return createRealPreference({
    externalReference: order.id,
    items: items.map((item) => ({
      title: item.name_snapshot,
      quantity: item.quantity,
      unitPriceClp: item.unit_price_clp,
    })),
    payerName: order.customer_name,
    payerEmail: order.customer_email,
    backUrls: {
      success: `${siteUrl()}/checkout/confirmacion/${order.id}?status=success`,
      pending: `${siteUrl()}/checkout/confirmacion/${order.id}?status=pending`,
      failure: `${siteUrl()}/checkout/confirmacion/${order.id}?status=failure`,
    },
  });
}

/**
 * Returns a checkout URL for a business's listing fee. Same real/mock
 * fallback behavior as createPaymentPreference, with a distinct
 * externalReference prefix ("business:") so the webhook can tell the two
 * kinds of payment apart.
 */
export async function createBusinessPaymentPreference(business: {
  id: string;
  name: string;
  contact_email: string;
  listing_fee_clp: number;
}): Promise<{ initPoint: string; preferenceId: string | null }> {
  if (!isMercadoPagoConfigured()) {
    console.warn("MercadoPago not configured — using mock payment flow");
    return { initPoint: `${siteUrl()}/empresas/publicar/pago/${business.id}`, preferenceId: null };
  }

  return createRealPreference({
    externalReference: `business:${business.id}`,
    items: [
      {
        title: `Publicación de empresa — ${business.name}`,
        quantity: 1,
        unitPriceClp: business.listing_fee_clp,
      },
    ],
    payerName: business.name,
    payerEmail: business.contact_email,
    backUrls: {
      success: `${siteUrl()}/empresas/publicar/confirmacion/${business.id}?status=success`,
      pending: `${siteUrl()}/empresas/publicar/confirmacion/${business.id}?status=pending`,
      failure: `${siteUrl()}/empresas/publicar/confirmacion/${business.id}?status=failure`,
    },
  });
}
