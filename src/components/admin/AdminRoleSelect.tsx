"use client";

import { useState, useTransition } from "react";
import { updateAdminRole } from "@/lib/actions/admin-users";
import type { AdminRole } from "@/lib/auth/admin-guard";

export function AdminRoleSelect({ profileId, role }: { profileId: string; role: AdminRole }) {
  const [value, setValue] = useState(role);
  const [pending, startTransition] = useTransition();

  function handleChange(next: AdminRole) {
    setValue(next);
    startTransition(async () => {
      try {
        await updateAdminRole(profileId, next);
      } catch {
        setValue(role); // revert on failure (e.g. tried to demote yourself)
      }
    });
  }

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => handleChange(e.target.value as AdminRole)}
      className="rounded-lg border border-sand-dark px-2 py-1 text-sm disabled:opacity-60"
    >
      <option value="admin">Admin</option>
      <option value="superadmin">Superadmin</option>
    </select>
  );
}
