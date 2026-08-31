import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: experience } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!experience) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Editar experiencia</h1>
      <div className="mt-6 max-w-2xl rounded-2xl border border-sand-dark bg-white p-6">
        <ExperienceForm experience={experience} />
      </div>
    </div>
  );
}
