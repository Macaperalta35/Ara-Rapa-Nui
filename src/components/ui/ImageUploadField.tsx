"use client";

import { useState } from "react";
import type { UploadResult } from "@/lib/actions/upload-image";

export function ImageUploadField({
  name,
  label,
  defaultValue,
  action,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  action: (formData: FormData) => Promise<UploadResult>;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(true);
    setError(null);

    const formData = new FormData();
    formData.set("file", file);
    const result = await action(formData);

    if ("error" in result) {
      setError(result.error);
    } else {
      setUrl(result.url);
    }
    setPending(false);
  }

  return (
    <div className="flex flex-col gap-2 text-sm font-medium text-volcanic">
      <span>{label}</span>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="h-28 w-28 rounded-lg border border-sand-dark object-cover"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={pending}
        className="text-sm font-normal text-volcanic/70"
      />
      {pending && <p className="text-xs font-normal text-volcanic/50">Subiendo…</p>}
      {error && <p className="text-xs font-normal text-red-600">{error}</p>}
      <input type="hidden" name={name} value={url} />
    </div>
  );
}
