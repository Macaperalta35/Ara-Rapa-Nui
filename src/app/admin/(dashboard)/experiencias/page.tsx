import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteExperience } from "@/lib/actions/admin-catalog";
import { formatClp } from "@/lib/format";

export default async function AdminExperiencesPage() {
  const supabase = await createClient();
  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-volcanic">Experiencias</h1>
        <Link
          href="/admin/experiencias/nuevo"
          className="rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:bg-terracotta-light"
        >
          + Nueva experiencia
        </Link>
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {(experiences ?? []).map((exp) => (
          <li
            key={exp.id}
            className="flex items-center justify-between rounded-2xl border border-sand-dark bg-white p-4"
          >
            <div>
              <p className="font-medium text-volcanic">
                {exp.name_es} {!exp.is_active && <span className="text-xs text-volcanic/40">(inactivo)</span>}
              </p>
              <p className="text-sm text-volcanic/60">{formatClp(exp.price_clp)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/admin/experiencias/${exp.id}`} className="text-sm text-ocean hover:underline">
                Editar
              </Link>
              <form action={deleteExperience.bind(null, exp.id)}>
                <button className="text-sm text-red-600 hover:underline">Eliminar</button>
              </form>
            </div>
          </li>
        ))}
        {(experiences ?? []).length === 0 && <p className="text-volcanic/50">Sin experiencias todavía.</p>}
      </ul>
    </div>
  );
}
