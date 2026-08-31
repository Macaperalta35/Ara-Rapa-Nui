export type OrderForPayment = {
  id: string;
  customer_name: string;
  customer_email: string;
  total_clp: number;
};

export type OrderItemForPayment = {
  name_snapshot: string;
  unit_price_clp: number;
  quantity: number;
};

export function isMercadoPagoConfigured(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}
