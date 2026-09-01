"use client";

import { useActionState } from "react";
import { createAdminUser } from "@/lib/actions/admin-users";

export function CreateAdminForm() {
  const [state, formAction, pending] = useActionState(createAdminUser, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-2xl border border-sand-dark bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-volcanic">Crear administrador</h2>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          Correo
          <input
            name="email"
            type="email"
            required
            className="rounded-lg border border-sand-dark px-3 py-2 text-sm font-normal"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          Contraseña temporal
          <input
            name="password"
            type="text"
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
            className="rounded-lg border border-sand-dark px-3 py-2 text-sm font-normal"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
        Rol
        <select name="role" defaultValue="admin" className="w-48 rounded-lg border border-sand-dark px-3 py-2 text-sm font-normal">
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-700">Cuenta creada correctamente.</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-terracotta-light active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Creando…" : "Crear cuenta"}
      </button>
    </form>
  );
}
