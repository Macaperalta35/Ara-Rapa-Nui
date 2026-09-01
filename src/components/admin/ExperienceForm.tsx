"use client";

import { upsertExperience } from "@/lib/actions/admin-catalog";
import { uploadAdminImage } from "@/lib/actions/upload-image";
import type { Experience } from "@/lib/types/catalog";
import { Field, TextArea } from "./FormFields";
import { ImageUploadField } from "@/components/ui/ImageUploadField";

export function ExperienceForm({ experience }: { experience?: Experience }) {
  return (
    <form action={upsertExperience} className="flex flex-col gap-4">
      {experience && <input type="hidden" name="id" value={experience.id} />}

      <Field label="Slug (URL)" name="slug" defaultValue={experience?.slug} required />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre (ES)" name="name_es" defaultValue={experience?.name_es} required />
        <Field label="Nombre (EN)" name="name_en" defaultValue={experience?.name_en} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextArea
          label="Descripción (ES)"
          name="description_es"
          defaultValue={experience?.description_es ?? ""}
        />
        <TextArea
          label="Descripción (EN)"
          name="description_en"
          defaultValue={experience?.description_en ?? ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Precio (CLP)"
          name="price_clp"
          type="number"
          defaultValue={experience?.price_clp}
          required
        />
        <Field
          label="Duración (horas)"
          name="duration_hours"
          type="number"
          defaultValue={experience?.duration_hours ?? undefined}
        />
      </div>
      <ImageUploadField
        label="Foto de portada"
        name="cover_image_url"
        defaultValue={experience?.cover_image_url ?? ""}
        action={uploadAdminImage}
      />
      <label className="flex items-center gap-2 text-sm font-medium text-volcanic">
        <input type="checkbox" name="requires_date" defaultChecked={experience?.requires_date ?? true} />
        Pedir fecha al agregar al carrito
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-volcanic">
        <input type="checkbox" name="is_active" defaultChecked={experience?.is_active ?? true} />
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
