import { requireSuperAdminPage } from "@/lib/auth/admin-guard";
import { createClient } from "@/lib/supabase/server";
import { removeAdminAccess } from "@/lib/actions/admin-users";
import { CreateAdminForm } from "@/components/admin/CreateAdminForm";
import { AdminRoleSelect } from "@/components/admin/AdminRoleSelect";

export default async function AdminUsersPage() {
  const { user } = await requireSuperAdminPage();

  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Administradores</h1>
      <p className="mt-1 text-sm text-volcanic/60">
        Solo los superadmin pueden crear cuentas y cambiar roles de acceso al panel.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-sand-dark bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sand-dark text-left text-volcanic/60">
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Desde</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((profile) => (
              <tr key={profile.id} className="border-b border-sand-dark/60 last:border-0">
                <td className="px-4 py-3">
                  {profile.email}
                  {profile.id === user.id && (
                    <span className="ml-2 text-xs text-volcanic/40">(tú)</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <AdminRoleSelect profileId={profile.id} role={profile.role} />
                </td>
                <td className="px-4 py-3 text-volcanic/60">
                  {new Date(profile.created_at).toLocaleDateString("es-CL")}
                </td>
                <td className="px-4 py-3 text-right">
                  {profile.id !== user.id && (
                    <form action={removeAdminAccess.bind(null, profile.id)}>
                      <button className="text-sm text-red-600 hover:underline">Quitar acceso</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 max-w-lg">
        <CreateAdminForm />
      </div>
    </div>
  );
}
