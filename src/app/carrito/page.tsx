"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { useTranslations, useLocale } from "@/lib/i18n/LanguageProvider";
import { formatClp } from "@/lib/format";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalClp } = useCart();
  const t = useTranslations();
  const { locale } = useLocale();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-volcanic">{t.cart.title}</h1>
        <p className="mt-3 text-volcanic/60">{t.cart.empty}</p>
        <Link
          href="/catalogo/paquetes"
          className="mt-6 inline-block rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-terracotta-light active:scale-[0.98]"
        >
          {t.cart.goToCatalog}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-volcanic">{t.cart.title}</h1>

      <ul className="mt-8 flex flex-col gap-4">
        {items.map((line) => (
          <li
            key={line.lineId}
            className="flex items-center gap-4 rounded-2xl border border-sand-dark bg-white p-4"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-sand-dark">
              {line.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={line.imageUrl}
                  alt={locale === "es" ? line.nameEs : line.nameEn}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium text-volcanic">
                {locale === "es" ? line.nameEs : line.nameEn}
              </p>
              {line.type === "vehicle_rental" && (
                <p className="text-sm text-volcanic/60">
                  {line.startDate} → {line.endDate}
                </p>
              )}
              {line.type === "package" && line.startDate && (
                <p className="text-sm text-volcanic/60">{line.startDate}</p>
              )}
              {line.type === "experience" && line.selectedDate && (
                <p className="text-sm text-volcanic/60">{line.selectedDate}</p>
              )}
              <p className="text-sm text-volcanic/60">{formatClp(line.unitPriceClp)}</p>
            </div>

            <input
              type="number"
              min={1}
              value={line.quantity}
              onChange={(e) => updateQuantity(line.lineId, Number(e.target.value))}
              className="w-16 rounded-lg border border-sand-dark px-2 py-1 text-center text-sm"
            />

            <p className="w-24 text-right font-medium text-volcanic">
              {formatClp(line.unitPriceClp * line.quantity)}
            </p>

            <button
              onClick={() => removeItem(line.lineId)}
              className="text-sm text-terracotta hover:underline"
            >
              {t.common.remove}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-sand-dark pt-6">
        <span className="text-lg font-medium text-volcanic">{t.common.total}</span>
        <span className="font-display text-2xl font-semibold text-terracotta">
          {formatClp(totalClp)}
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-full bg-terracotta px-6 py-4 text-center text-sm font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-terracotta-light active:scale-[0.98]"
      >
        {t.cart.checkout}
      </Link>
    </div>
  );
}
