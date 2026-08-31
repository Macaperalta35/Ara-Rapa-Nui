import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Editar producto</h1>
      <div className="mt-6 max-w-2xl rounded-2xl border border-sand-dark bg-white p-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
