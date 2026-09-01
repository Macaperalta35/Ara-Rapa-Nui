import { PolynesianFlower } from "@/components/ui/PolynesianFlower";

export function CatalogPageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <PolynesianFlower className="h-8 w-8 shrink-0 text-hibiscus" />
        <h1 className="font-display text-3xl font-semibold text-volcanic">{title}</h1>
      </div>
      {subtitle && <p className="mt-2 text-sm text-volcanic/60">{subtitle}</p>}
    </div>
  );
}
