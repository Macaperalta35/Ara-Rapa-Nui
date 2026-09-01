import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BUSINESS_CATEGORIES } from "@/lib/types/business";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

export default async function AdminBusinessesPage() {
  const supabase = await createClient();
  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name, category, status, payment_status, listing_fee_clp, created_at")
    .order("created_at", { ascending: false });

  const categoryLabel = (value: string) =>
    BUSINESS_CATEGORIES.find((c) => c.value === value)?.label ?? value;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Empresas</h1>
      <p className="mt-1 text-sm text-volcanic/60">
        Publicaciones enviadas por negocios locales, pendientes de revisión.
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {(businesses ?? []).map((biz) => (
          <li key={biz.id}>
            <Link
              href={`/admin/empresas/${biz.id}`}
              className="flex items-center justify-between rounded-2xl border border-sand-dark bg-white p-4 hover:shadow-md"
            >
              <div>
                <p className="font-medium text-volcanic">{biz.name}</p>
                <p className="text-sm text-volcanic/60">{categoryLabel(biz.category)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    biz.payment_status === "paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {biz.payment_status === "paid" ? "Pagada" : "Sin pagar"}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[biz.status] ?? ""}`}>
                  {STATUS_LABEL[biz.status] ?? biz.status}
                </span>
              </div>
            </Link>
          </li>
        ))}
        {(businesses ?? []).length === 0 && <p className="text-volcanic/50">Sin publicaciones todavía.</p>}
      </ul>
    </div>
  );
}
