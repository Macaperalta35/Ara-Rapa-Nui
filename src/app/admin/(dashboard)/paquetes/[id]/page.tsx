import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PackageForm } from "@/components/admin/PackageForm";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: pkg } = await supabase.from("packages").select("*").eq("id", id).maybeSingle();

  if (!pkg) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Editar paquete</h1>
      <div className="mt-6 max-w-2xl rounded-2xl border border-sand-dark bg-white p-6">
        <PackageForm pkg={pkg} />
      </div>
    </div>
  );
}
