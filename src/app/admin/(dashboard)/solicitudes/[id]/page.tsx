import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateRequestStatusAction } from "@/lib/actions/admin-orders";

const STATUSES = ["new", "contacted", "closed"] as const;

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: request } = await supabase
    .from("special_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!request) notFound();

  async function save(formData: FormData) {
    "use server";
    const status = formData.get("status") as (typeof STATUSES)[number];
    const adminNotes = String(formData.get("admin_notes") ?? "");
    await updateRequestStatusAction(id, status, adminNotes);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">
        Solicitud de {request.customer_name}
      </h1>
      <p className="mt-1 text-sm text-volcanic/60">
        {request.customer_email} {request.customer_phone ? `· ${request.customer_phone}` : ""}
      </p>
      {request.preferred_date && (
        <p className="mt-1 text-sm text-volcanic/60">Fecha preferida: {request.preferred_date}</p>
      )}

      <div className="mt-6 rounded-2xl border border-sand-dark bg-white p-6">
        <p className="whitespace-pre-line text-volcanic/80">{request.description}</p>
      </div>

      <form action={save} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          Notas internas
          <textarea
            name="admin_notes"
            defaultValue={request.admin_notes ?? ""}
            rows={3}
            className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
          />
        </label>
        <div className="flex items-center gap-3">
          <select
            name="status"
            defaultValue={request.status}
            className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-full bg-volcanic px-5 py-2 text-sm font-semibold text-white hover:bg-volcanic-light"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
