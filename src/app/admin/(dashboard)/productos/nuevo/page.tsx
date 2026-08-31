import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-volcanic">Nuevo producto</h1>
      <div className="mt-6 max-w-2xl rounded-2xl border border-sand-dark bg-white p-6">
        <ProductForm />
      </div>
    </div>
  );
}
