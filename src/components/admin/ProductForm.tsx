"use client";

import { upsertProduct } from "@/lib/actions/admin-catalog";
import { uploadAdminImage } from "@/lib/actions/upload-image";
import type { Product } from "@/lib/types/catalog";
import { Field, TextArea } from "./FormFields";
import { ImageUploadField } from "@/components/ui/ImageUploadField";

export function ProductForm({ product }: { product?: Product }) {
  return (
    <form action={upsertProduct} className="flex flex-col gap-4">
      {product && <input type="hidden" name="id" value={product.id} />}

      <Field label="Slug (URL)" name="slug" defaultValue={product?.slug} required />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre (ES)" name="name_es" defaultValue={product?.name_es} required />
        <Field label="Nombre (EN)" name="name_en" defaultValue={product?.name_en} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextArea
          label="Descripción (ES)"
          name="description_es"
          defaultValue={product?.description_es ?? ""}
        />
        <TextArea
          label="Descripción (EN)"
          name="description_en"
          defaultValue={product?.description_en ?? ""}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field
          label="Precio (CLP)"
          name="price_clp"
          type="number"
          defaultValue={product?.price_clp}
          required
        />
        <Field label="Stock" name="stock" type="number" defaultValue={product?.stock ?? 0} required />
        <Field label="SKU" name="sku" defaultValue={product?.sku ?? ""} />
      </div>
      <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
        Público
        <select
          name="audience"
          defaultValue={product?.audience ?? "tourist"}
          className="rounded-lg border border-sand-dark px-3 py-2 text-sm font-normal"
        >
          <option value="tourist">Turistas (catálogo general)</option>
          <option value="resident">Residentes de Rapa Nui</option>
        </select>
      </label>
      <ImageUploadField
        label="Foto de portada"
        name="cover_image_url"
        defaultValue={product?.cover_image_url ?? ""}
        action={uploadAdminImage}
      />
      <label className="flex items-center gap-2 text-sm font-medium text-volcanic">
        <input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} />
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
