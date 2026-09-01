import "server-only";

const MP_API = "https://api.mercadopago.com";

export type PreferenceParams = {
  externalReference: string;
  items: { title: string; quantity: number; unitPriceClp: number }[];
  payerName: string;
  payerEmail: string;
  backUrls: { success: string; pending: string; failure: string };
};

/** Creates a real Mercado Pago Checkout Pro preference. Requires MERCADOPAGO_ACCESS_TOKEN. */
export async function createRealPreference(
  params: PreferenceParams,
): Promise<{ initPoint: string; preferenceId: string }> {
  const res = await fetch(`${MP_API}/checkout/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      items: params.items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unitPriceClp,
        currency_id: "CLP",
      })),
      payer: { name: params.payerName, email: params.payerEmail },
      external_reference: params.externalReference,
      back_urls: params.backUrls,
      auto_return: "approved",
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/mercadopago/webhook`,
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
