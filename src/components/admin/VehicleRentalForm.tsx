"use client";

import { upsertVehicleRental } from "@/lib/actions/admin-catalog";
import { uploadAdminImage } from "@/lib/actions/upload-image";
import type { VehicleRental } from "@/lib/types/catalog";
import { Field, TextArea } from "./FormFields";
import { ImageUploadField } from "@/components/ui/ImageUploadField";

export function VehicleRentalForm({ vehicle }: { vehicle?: VehicleRental }) {
  return (
    <form action={upsertVehicleRental} className="flex flex-col gap-4">
      {vehicle && <input type="hidden" name="id" value={vehicle.id} />}

      <Field label="Slug (URL)" name="slug" defaultValue={vehicle?.slug} required />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre (ES)" name="name_es" defaultValue={vehicle?.name_es} required />
        <Field label="Nombre (EN)" name="name_en" defaultValue={vehicle?.name_en} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextArea
          label="Descripción (ES)"
          name="description_es"
          defaultValue={vehicle?.description_es ?? ""}
        />
        <TextArea
          label="Descripción (EN)"
          name="description_en"
          defaultValue={vehicle?.description_en ?? ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          Tipo de vehículo
          <select
            name="vehicle_type"
            defaultValue={vehicle?.vehicle_type ?? "car"}
            className="rounded-lg border border-sand-dark px-3 py-2 text-sm font-normal"
          >
            <option value="car">Auto</option>
            <option value="suv">SUV / 4x4</option>
            <option value="scooter">Scooter / Moto</option>
            <option value="bike">Bicicleta</option>
          </select>
        </label>
        <Field label="Marca / modelo" name="brand_model" defaultValue={vehicle?.brand_model ?? ""} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field
          label="Precio por día (CLP)"
          name="price_clp_per_day"
          type="number"
          defaultValue={vehicle?.price_clp_per_day}
          required
        />
        <Field
          label="Capacidad (pasajeros)"
          name="capacity"
          type="number"
          defaultValue={vehicle?.capacity ?? undefined}
        />
        <Field label="Transmisión" name="transmission" defaultValue={vehicle?.transmission ?? ""} />
      </div>
      <ImageUploadField
        label="Foto de portada"
        name="cover_image_url"
        defaultValue={vehicle?.cover_image_url ?? ""}
        action={uploadAdminImage}
      />
      <label className="flex items-center gap-2 text-sm font-medium text-volcanic">
        <input type="checkbox" name="is_active" defaultChecked={vehicle?.is_active ?? true} />
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
