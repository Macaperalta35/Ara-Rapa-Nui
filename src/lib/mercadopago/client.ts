import "server-only";
import type { OrderForPayment, OrderItemForPayment } from "./types";

const MP_API = "https://api.mercadopago.com";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/** Creates a real Mercado Pago Checkout Pro preference. Requires MERCADOPAGO_ACCESS_TOKEN. */
export async function createRealPreference(
  order: OrderForPayment,
  items: OrderItemForPayment[],
): Promise<{ initPoint: string; preferenceId: string }> {
  const res = await fetch(`${MP_API}/checkout/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      items: items.map((item) => ({
        title: item.name_snapshot,
        quantity: item.quantity,
        unit_price: item.unit_price_clp,
        currency_id: "CLP",
      })),
      payer: { name: order.customer_name, email: order.customer_email },
      external_reference: order.id,
      back_urls: {
        success: `${siteUrl()}/checkout/confirmacion/${order.id}?status=success`,
        pending: `${siteUrl()}/checkout/confirmacion/${order.id}?status=pending`,
        failure: `${siteUrl()}/checkout/confirmacion/${order.id}?status=failure`,
      },
      auto_return: "approved",
      notification_url: `${siteUrl()}/api/mercadopago/webhook`,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mercado Pago preference creation failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  return { initPoint: data.init_point as string, preferenceId: data.id as string };
}

/** Fetches a payment from Mercado Pago by id — used by the webhook to verify status server-to-server. */
export async function fetchPayment(paymentId: string) {
  const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Mercado Pago payment ${paymentId}: ${res.status}`);
  }
  return res.json() as Promise<{
    status: string;
    external_reference: string | null;
    id: number;
  }>;
}
