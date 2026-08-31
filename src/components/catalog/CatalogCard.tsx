import Link from "next/link";
import { formatClp } from "@/lib/format";
import type { Locale } from "@/lib/i18n/dictionaries";

export function CatalogCard({
  href,
  name,
  description,
  priceClp,
  imageUrl,
  meta,
  locale,
  fromLabel,
}: {
  href: string;
  name: string;
  description: string | null;
  priceClp: number;
  imageUrl: string | null;
  meta?: string;
  locale: Locale;
  fromLabel: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-sand-dark bg-white transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-sand-dark">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-terracotta/40">
            <MoaiIcon />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {meta && <span className="text-xs font-medium uppercase tracking-wide text-ocean">{meta}</span>}
        <h3 className="font-display text-lg font-semibold text-volcanic">{name}</h3>
        {description && (
          <p className="line-clamp-2 text-sm text-volcanic/70">{description}</p>
        )}
        <div className="mt-auto pt-2 text-sm font-medium text-terracotta">
          {fromLabel} {formatClp(priceClp)}
        </div>
      </div>
    </Link>
  );
}

function MoaiIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M9 2c-1.8 1-2.6 3-2.6 5.2 0 1.4.5 2.2 0 3.4-.6 1.4-1.4 2-1.4 4.4 0 3 1.6 5 4 6h6c2.4-1 4-3 4-6 0-2.4-.8-3-1.4-4.4-.5-1.2 0-2 0-3.4C17.6 5 16.8 3 15 2" />
      <path d="M9.5 9.5h.01M14.5 9.5h.01" />
      <path d="M10 13.5c.7.5 1.3.5 2 0" />
    </svg>
  );
}
