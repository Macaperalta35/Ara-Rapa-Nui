import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateBusinessStatusAction, deleteBusinessAction } from "@/lib/actions/admin-businesses";
import { BUSINESS_CATEGORIES, type BusinessStatus } from "@/lib/types/business";
import { formatClp } from "@/lib/format";

const STATUSES: BusinessStatus[] = ["pending", "approved", "rejected"];

export default async function AdminBusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: biz } = await supabase.from("businesses").select("*").eq("id", id).maybeSingle();

  if (!biz) notFound();

  const categoryLabel =
    BUSINESS_CATEGORIES.find((c) => c.value === biz.category)?.label ?? biz.category;

  async function save(formData: FormData) {
    "use server";
    const status = formData.get("status") as BusinessStatus;
    const adminNotes = String(formData.get("admin_notes") ?? "");
    await updateBusinessStatusAction(id, status, adminNotes);
  }

  async function remove() {
    "use server";
    await deleteBusinessAction(id);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">{biz.name}</h1>
      <p className="mt-1 text-sm text-volcanic/60">
        {categoryLabel} · contacto: {biz.contact_email}
      </p>

      {biz.payment_status === "paid" ? (
        <p className="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
          Publicación pagada — {formatClp(biz.listing_fee_clp)}
        </p>
      ) : (
        <p className="mt-3 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
          Sin pagar todavía — evita aprobar hasta confirmar el pago
        </p>
      )}

      <div className="mt-6 grid gap-4 rounded-2xl border border-sand-dark bg-white p-6 text-sm">
        <p className="whitespace-pre-line text-volcanic/80">{biz.description}</p>
        <dl className="grid grid-cols-2 gap-3 text-volcanic/70">
          {biz.location && (
            <div>
              <dt className="text-xs uppercase text-volcanic/40">Ubicación</dt>
              <dd>{biz.location}</dd>
            </div>
          )}
          {biz.hours && (
            <div>
              <dt className="text-xs uppercase text-volcanic/40">Horario</dt>
              <dd>{biz.hours}</dd>
            </div>
          )}
          {biz.phone && (
            <div>
              <dt className="text-xs uppercase text-volcanic/40">Teléfono</dt>
              <dd>{biz.phone}</dd>
            </div>
          )}
          {biz.whatsapp && (
            <div>
              <dt className="text-xs uppercase text-volcanic/40">WhatsApp</dt>
              <dd>{biz.whatsapp}</dd>
            </div>
          )}
          {biz.website_url && (
            <div>
              <dt className="text-xs uppercase text-volcanic/40">Sitio web</dt>
              <dd>{biz.website_url}</dd>
            </div>
          )}
          {biz.instagram_url && (
            <div>
              <dt className="text-xs uppercase text-volcanic/40">Instagram</dt>
              <dd>{biz.instagram_url}</dd>
            </div>
          )}
          {biz.facebook_url && (
            <div>
              <dt className="text-xs uppercase text-volcanic/40">Facebook</dt>
              <dd>{biz.facebook_url}</dd>
            </div>
          )}
        </dl>
      </div>

      <form action={save} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          Notas internas
          <textarea
            name="admin_notes"
            defaultValue={biz.admin_notes ?? ""}
            rows={3}
            className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
          />
        </label>
        <div className="flex items-center gap-3">
          <select
            name="status"
            defaultValue={biz.status}
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

      <form action={remove} className="mt-4">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Eliminar publicación
        </button>
      </form>
    </div>
  );
}
