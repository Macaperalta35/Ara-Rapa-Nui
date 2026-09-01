"use client";

import { useActionState } from "react";
import { useTranslations } from "@/lib/i18n/LanguageProvider";
import { submitSpecialRequest } from "@/lib/actions/special-requests";

export default function SpecialRequestPage() {
  const t = useTranslations();
  const [state, formAction, pending] = useActionState(submitSpecialRequest, undefined);

  if (state?.success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-volcanic">{t.specialRequest.title}</h1>
        <p className="mt-4 text-volcanic/70">{t.specialRequest.success}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-volcanic">{t.specialRequest.title}</h1>
      <p className="mt-2 text-sm text-volcanic/60">{t.specialRequest.subtitle}</p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          {t.common.name}
          <input name="name" required className="rounded-lg border border-sand-dark px-3 py-2 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          {t.common.email}
          <input
            name="email"
            type="email"
            required
            className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          {t.common.phone}
          <input name="phone" type="tel" className="rounded-lg border border-sand-dark px-3 py-2 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          {t.specialRequest.description}
          <textarea
            name="description"
            required
            rows={4}
            className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          {t.specialRequest.preferredDate}
          <input
            name="preferredDate"
            type="date"
            className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
          />
        </label>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-terracotta-light active:scale-[0.98] disabled:opacity-60"
        >
          {pending ? t.checkout.processing : t.common.submit}
        </button>
      </form>
    </div>
  );
}
