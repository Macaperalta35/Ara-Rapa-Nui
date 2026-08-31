import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABEL: Record<string, string> = {
  new: "Nueva",
  contacted: "Contactada",
  closed: "Cerrada",
};

export default async function AdminRequestsPage() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("special_requests")
    .select("id, customer_name, description, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Solicitudes especiales</h1>
      <div className="mt-6 flex flex-col gap-3">
        {(requests ?? []).map((req) => (
          <Link
            key={req.id}
            href={`/admin/solicitudes/${req.id}`}
            className="rounded-2xl border border-sand-dark bg-white p-4 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-volcanic">{req.customer_name}</p>
              <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-volcanic/70">
                {STATUS_LABEL[req.status] ?? req.status}
              </span>
            </div>
            <p className="mt-1 line-clamp-1 text-sm text-volcanic/60">{req.description}</p>
          </Link>
        ))}
        {(requests ?? []).length === 0 && (
          <p className="text-volcanic/50">Sin solicitudes todavía.</p>
        )}
      </div>
    </div>
  );
}
