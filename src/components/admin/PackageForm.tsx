"use client";

import { upsertPackage } from "@/lib/actions/admin-catalog";
import type { Package } from "@/lib/types/catalog";
import { Field, TextArea } from "./FormFields";

export function PackageForm({ pkg }: { pkg?: Package }) {
  return (
    <form action={upsertPackage} className="flex flex-col gap-4">
      {pkg && <input type="hidden" name="id" value={pkg.id} />}

      <Field label="Slug (URL)" name="slug" defaultValue={pkg?.slug} required />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre (ES)" name="name_es" defaultValue={pkg?.name_es} required />
        <Field label="Nombre (EN)" name="name_en" defaultValue={pkg?.name_en} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextArea label="Descripción (ES)" name="description_es" defaultValue={pkg?.description_es ?? ""} />
        <TextArea label="Descripción (EN)" name="description_en" defaultValue={pkg?.description_en ?? ""} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Precio (CLP)" name="price_clp" type="number" defaultValue={pkg?.price_clp} required />
        <Field
          label="Duración (días)"
          name="duration_days"
          type="number"
          defaultValue={pkg?.duration_days ?? 1}
          required
        />
        <Field
          label="Máx. participantes"
          name="max_participants"
          type="number"
          defaultValue={pkg?.max_participants ?? undefined}
        />
      </div>
      <Field label="URL imagen de portada" name="cover_image_url" defaultValue={pkg?.cover_image_url ?? ""} />
      <label className="flex items-center gap-2 text-sm font-medium text-volcanic">
        <input type="checkbox" name="is_active" defaultChecked={pkg?.is_active ?? true} />
        Activo (visible en el catálogo)
      </label>

      <button
        type="submit"
        className="mt-2 self-start rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-light"
      >
        Guardar
      </button>
    </form>
  );
}
