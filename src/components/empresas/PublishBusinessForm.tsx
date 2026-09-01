"use client";

import { useState } from "react";
import { submitBusiness } from "@/lib/actions/businesses";
import { uploadPublicImage } from "@/lib/actions/upload-image";
import { BUSINESS_CATEGORIES } from "@/lib/types/business";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { formatClp } from "@/lib/format";

export function PublishBusinessForm({ feeClp }: { feeClp: number }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await submitBusiness(formData);

      if ("error" in result) {
        setError(result.error);
        setPending(false);
        return;
      }

      window.location.href = result.paymentUrl;
    } catch {
      setError("Algo salió mal al enviar tu publicación. Intenta nuevamente.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
        Nombre de la empresa
        <input name="name" required className="rounded-lg border border-sand-dark px-3 py-2 text-sm" />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
        Rubro
        <select
          name="category"
          defaultValue={BUSINESS_CATEGORIES[0].value}
          className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
        >
          {BUSINESS_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
        Descripción
        <textarea
          name="description"
          required
          rows={4}
          className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
        Ubicación / sector
        <input
          name="location"
          placeholder="Ej. Hanga Roa centro"
          className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
        Horario de atención
        <input
          name="hours"
          placeholder="Ej. Lun-Sáb 9:00-19:00"
          className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          Teléfono
          <input name="phone" type="tel" className="rounded-lg border border-sand-dark px-3 py-2 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          WhatsApp
          <input name="whatsapp" type="tel" className="rounded-lg border border-sand-dark px-3 py-2 text-sm" />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
        Sitio web
        <input name="website_url" type="url" className="rounded-lg border border-sand-dark px-3 py-2 text-sm" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          Instagram
          <input
            name="instagram_url"
            type="url"
            className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          Facebook
          <input
            name="facebook_url"
            type="url"
            className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
          />
        </label>
      </div>

      <ImageUploadField label="Foto o logo" name="cover_image_url" action={uploadPublicImage} />

      <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
        Tu correo de contacto (no se muestra públicamente)
        <input
          name="contact_email"
          type="email"
          required
          className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-terracotta-light active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Enviando…" : `Pagar publicación (${formatClp(feeClp)})`}
      </button>
    </form>
  );
}
