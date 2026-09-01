import { createClient } from "@/lib/supabase/server";
import { formatClp } from "@/lib/format";

const SALES_GOAL_CLP = 30_000_000;

const CATEGORY_LABEL: Record<string, string> = {
  package: "Paquetes",
  experience: "Experiencias",
  product: "Productos",
  vehicle_rental: "Arriendo de vehículos",
};

export default async function AdminSalesPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: businesses }] = await Promise.all([
    supabase
      .from("order_items")
      .select("item_type, unit_price_clp, quantity, orders!inner(status)")
      .in("orders.status", ["paid", "fulfilled"]),
    supabase.from("businesses").select("listing_fee_clp").eq("payment_status", "paid"),
  ]);

  const byCategory: Record<string, number> = {
    package: 0,
    experience: 0,
    product: 0,
    vehicle_rental: 0,
  };

  for (const item of items ?? []) {
    byCategory[item.item_type] = (byCategory[item.item_type] ?? 0) + item.unit_price_clp * item.quantity;
  }

  const businessRevenue = (businesses ?? []).reduce((sum, b) => sum + b.listing_fee_clp, 0);
  const toursRevenue = byCategory.package + byCategory.experience;
  const salesRevenue = toursRevenue + byCategory.product + byCategory.vehicle_rental;
  const totalRevenue = salesRevenue + businessRevenue;
  const progressPct = Math.min(100, Math.round((salesRevenue / SALES_GOAL_CLP) * 100));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Ventas</h1>
      <p className="mt-1 text-sm text-volcanic/60">
        Solo pedidos pagados o completados — no incluye pedidos pendientes ni fallidos.
      </p>

      <div className="mt-6 rounded-2xl border border-sand-dark bg-white p-6">
        <p className="text-sm text-volcanic/60">
          Meta: arriendo de vehículos + productos + tours = {formatClp(SALES_GOAL_CLP)}
        </p>
        <p className="mt-1 font-display text-3xl font-semibold text-terracotta">
          {formatClp(salesRevenue)}
        </p>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-sand-dark">
          <div
            className="h-full rounded-full bg-terracotta transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-volcanic/50">{progressPct}% de la meta</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SalesCard label="Tours (paquetes + experiencias)" amount={toursRevenue} />
        <SalesCard label={CATEGORY_LABEL.product} amount={byCategory.product} />
        <SalesCard label={CATEGORY_LABEL.vehicle_rental} amount={byCategory.vehicle_rental} />
        <SalesCard label="Publicación de empresas" amount={businessRevenue} accent="ocean" />
      </div>

      <p className="mt-6 text-sm text-volcanic/60">
        Ingreso total (incluyendo empresas): <span className="font-medium text-volcanic">{formatClp(totalRevenue)}</span>
      </p>
    </div>
  );
}

function SalesCard({
  label,
  amount,
  accent = "terracotta",
}: {
  label: string;
  amount: number;
  accent?: "terracotta" | "ocean";
}) {
  return (
    <div className="rounded-2xl border border-sand-dark bg-white p-5">
      <p className="text-sm text-volcanic/60">{label}</p>
      <p className={`mt-1 font-display text-2xl font-semibold ${accent === "ocean" ? "text-ocean" : "text-terracotta"}`}>
        {formatClp(amount)}
      </p>
    </div>
  );
}
