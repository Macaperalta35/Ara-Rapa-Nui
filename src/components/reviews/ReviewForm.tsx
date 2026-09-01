"use client";

import { useActionState, useState } from "react";
import { submitReview } from "@/lib/actions/reviews";
import type { ReviewTargetType } from "@/lib/types/review";

export function ReviewForm({
  targetType,
  targetId,
}: {
  targetType: ReviewTargetType;
  targetId: string;
}) {
  const [state, formAction, pending] = useActionState(submitReview, undefined);
  const [rating, setRating] = useState(5);

  if (state?.success) {
    return (
      <p className="rounded-xl bg-sand p-4 text-sm text-volcanic/70">
        ¡Gracias por tu reseña! La publicaremos luego de revisarla.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-xl border border-sand-dark bg-white p-4">
      <input type="hidden" name="target_type" value={targetType} />
      <input type="hidden" name="target_id" value={targetId} />

      <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
        Calificación
        <select
          name="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-24 rounded-lg border border-sand-dark px-3 py-2 text-sm font-normal"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "estrella" : "estrellas"}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          Tu nombre
          <input name="customer_name" required className="rounded-lg border border-sand-dark px-3 py-2 text-sm font-normal" />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          Tu correo
          <input
            name="customer_email"
            type="email"
            required
            className="rounded-lg border border-sand-dark px-3 py-2 text-sm font-normal"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
        Comentario (opcional)
        <textarea
          name="comment"
          rows={3}
          className="rounded-lg border border-sand-dark px-3 py-2 text-sm font-normal"
        />
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-terracotta-light active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Dejar reseña"}
      </button>
    </form>
  );
}
