"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPaymentPreference } from "@/lib/mercadopago/create-preference";
import type { CartItem } from "@/lib/types/cart";

const guestSchema = z.object({
  name: z.string().trim().min(2, "Nombre muy corto"),
  email: z.string().trim().email("Correo inválido"),
  phone: z.string().trim().min(6, "Teléfono inválido"),
});

export type CheckoutInput = {
  items: CartItem[];
  guest: { name: string; email: string; phone: string };
  locale: "es" | "en";
};

export type CheckoutResult = { orderId: string; paymentUrl: string } | { error: string };

/**
 * Creates the order server-side, re-validating price/stock against the
 * catalog (never trusting the client-submitted cart totals), then returns
 * a Mercado Pago (or mock) checkout URL to redirect the browser to.
 */
export async function submitCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  if (!input.items || input.items.length === 0) {
    return { error: "El carrito está vacío." };
  }

  const guest = guestSchema.safeParse(input.guest);
  if (!guest.success) {
    return { error: guest.error.issues[0]?.message ?? "Datos de contacto inválidos." };
  }

  const supabase = createAdminClient();

  type ValidatedItem = {
    item_type: "package" | "experience" | "product" | "vehicle_rental";
    item_id: string;
    name_snapshot: string;
    unit_price_clp: number;
    quantity: number;
    selected_date: string | null;
    selected_end_date: string | null;
  };

  const validatedItems: ValidatedItem[] = [];

  for (const item of input.items) {
    if (item.type === "package") {
      const { data: pkg } = await supabase
        .from("packages")
        .select("id, name_es, name_en, price_clp, is_active")
        .eq("id", item.packageId)
        .maybeSingle();
      if (!pkg || !pkg.is_active) {
        return { error: `El paquete "${item.nameEs}" ya no está disponible.` };
      }
      validatedItems.push({
        item_type: "package",
        item_id: pkg.id,
        name_snapshot: input.locale === "es" ? pkg.name_es : pkg.name_en,
        unit_price_clp: pkg.price_clp,
        quantity: item.quantity,
        selected_date: item.startDate ?? null,
        selected_end_date: null,
      });
    } else if (item.type === "experience") {
      const { data: exp } = await supabase
        .from("experiences")
        .select("id, name_es, name_en, price_clp, is_active")
        .eq("id", item.experienceId)
        .maybeSingle();
      if (!exp || !exp.is_active) {
        return { error: `La experiencia "${item.nameEs}" ya no está disponible.` };
      }
      validatedItems.push({
        item_type: "experience",
        item_id: exp.id,
        name_snapshot: input.locale === "es" ? exp.name_es : exp.name_en,
        unit_price_clp: exp.price_clp,
        quantity: item.quantity,
        selected_date: item.selectedDate ?? null,
        selected_end_date: null,
      });
    } else if (item.type === "vehicle_rental") {
      const { data: vehicle } = await supabase
        .from("vehicle_rentals")
        .select("id, name_es, name_en, price_clp_per_day, is_active")
        .eq("id", item.vehicleId)
        .maybeSingle();
      if (!vehicle || !vehicle.is_active) {
        return { error: `"${item.nameEs}" ya no está disponible para arriendo.` };
      }
      const days = Math.round(
        (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / 86_400_000,
      );
      if (!item.startDate || !item.endDate || days < 1) {
        return { error: `Las fechas de arriendo de "${item.nameEs}" no son válidas.` };
      }
      validatedItems.push({
        item_type: "vehicle_rental",
        item_id: vehicle.id,
        name_snapshot: input.locale === "es" ? vehicle.name_es : vehicle.name_en,
        unit_price_clp: vehicle.price_clp_per_day * days,
        quantity: item.quantity,
        selected_date: item.startDate,
        selected_end_date: item.endDate,
      });
    } else {
      const { data: product } = await supabase
        .from("products")
        .select("id, name_es, name_en, price_clp, is_active, stock")
        .eq("id", item.productId)
        .maybeSingle();
      if (!product || !product.is_active) {
        return { error: `El producto "${item.nameEs}" ya no está disponible.` };
      }
      if (product.stock < item.quantity) {
        return { error: `No hay suficiente stock de "${item.nameEs}".` };
      }
      validatedItems.push({
        item_type: "product",
        item_id: product.id,
        name_snapshot: input.locale === "es" ? product.name_es : product.name_en,
        unit_price_clp: product.price_clp,
        quantity: item.quantity,
        selected_date: null,
        selected_end_date: null,
      });
    }
  }

  const totalClp = validatedItems.reduce(
    (sum, item) => sum + item.unit_price_clp * item.quantity,
    0,
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: guest.data.name,
      customer_email: guest.data.email,
      customer_phone: guest.data.phone,
      total_clp: totalClp,
    })
    .select()
    .single();

  if (orderError || !order) {
    return { error: "No pudimos crear el pedido. Intenta nuevamente." };
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(validatedItems.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) {
    return { error: "No pudimos guardar los ítems del pedido." };
  }

  // Reserve stock for physical products (atomic, race-safe — see migration 0003).
  for (const item of validatedItems) {
    if (item.item_type !== "product") continue;
    const { data: ok } = await supabase.rpc("decrement_stock", {
      p_product_id: item.item_id,
      p_qty: item.quantity,
    });
    if (!ok) {
      return { error: `"${item.name_snapshot}" se agotó mientras completabas el pedido.` };
    }
  }

  const { initPoint, preferenceId } = await createPaymentPreference(
    { id: order.id, customer_name: guest.data.name, customer_email: guest.data.email, total_clp: totalClp },
    validatedItems,
  );

  if (preferenceId) {
    await supabase.from("orders").update({ mp_preference_id: preferenceId }).eq("id", order.id);
  }

  return { orderId: order.id, paymentUrl: initPoint };
}
