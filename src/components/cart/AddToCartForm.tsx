"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { useTranslations } from "@/lib/i18n/LanguageProvider";
import { formatClp } from "@/lib/format";
import type { CartItem } from "@/lib/types/cart";

type Props =
  | {
      type: "package";
      id: string;
      slug: string;
      nameEs: string;
      nameEn: string;
      unitPriceClp: number;
      imageUrl: string | null;
    }
  | {
      type: "experience";
      id: string;
      slug: string;
      nameEs: string;
      nameEn: string;
      unitPriceClp: number;
      imageUrl: string | null;
      requiresDate: boolean;
    }
  | {
      type: "product";
      id: string;
      slug: string;
      nameEs: string;
      nameEn: string;
      unitPriceClp: number;
      imageUrl: string | null;
      stock: number;
    }
  | {
      type: "vehicle_rental";
      id: string;
      slug: string;
      nameEs: string;
      nameEn: string;
      pricePerDayClp: number;
      imageUrl: string | null;
    };

function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  return diff;
}

export function AddToCartForm(props: Props) {
  const { addItem } = useCart();
  const t = useTranslations();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const outOfStock = props.type === "product" && props.stock <= 0;
  const needsDate =
    (props.type === "package" || (props.type === "experience" && props.requiresDate)) as boolean;

  const rentalDays = props.type === "vehicle_rental" ? daysBetween(startDate, endDate) : 0;

  function handleAdd() {
    setError(null);

    if (props.type === "vehicle_rental") {
      if (!startDate || !endDate || rentalDays < 1) {
        setError("Elige una fecha de término posterior a la de inicio.");
        return;
      }
    }

    const base = {
      lineId: crypto.randomUUID(),
      quantity,
      nameEs: props.nameEs,
      nameEn: props.nameEn,
      imageUrl: props.imageUrl,
    };

    let item: CartItem;
    if (props.type === "package") {
      item = {
        ...base,
        unitPriceClp: props.unitPriceClp,
        type: "package",
        packageId: props.id,
        slug: props.slug,
        startDate: date || undefined,
      };
    } else if (props.type === "experience") {
      item = {
        ...base,
        unitPriceClp: props.unitPriceClp,
        type: "experience",
        experienceId: props.id,
        slug: props.slug,
        selectedDate: date || undefined,
      };
    } else if (props.type === "vehicle_rental") {
      item = {
        ...base,
        unitPriceClp: props.pricePerDayClp * rentalDays,
        type: "vehicle_rental",
        vehicleId: props.id,
        slug: props.slug,
        startDate,
        endDate,
      };
    } else {
      item = { ...base, unitPriceClp: props.unitPriceClp, type: "product", productId: props.id, slug: props.slug };
    }

    addItem(item);
    setAdded(true);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-sand-dark bg-white p-5">
      {needsDate && (
        <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
          {t.specialRequest.preferredDate.replace(" (opcional)", "").replace(" (optional)", "")}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
          />
        </label>
      )}

      {props.type === "vehicle_rental" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
              {t.common.startDate}
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
              {t.common.endDate}
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
              />
            </label>
          </div>
          {rentalDays > 0 && (
            <p className="text-sm text-volcanic/60">
              {rentalDays} {rentalDays === 1 ? t.common.day : t.common.days} ·{" "}
              <span className="font-medium text-terracotta">
                {formatClp(props.pricePerDayClp * rentalDays)}
              </span>
            </p>
          )}
        </>
      )}

      <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
        {t.common.quantity}
        <input
          type="number"
          min={1}
          max={props.type === "product" ? Math.max(props.stock, 1) : 20}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="w-24 rounded-lg border border-sand-dark px-3 py-2 text-sm"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className="rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-terracotta-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {outOfStock ? "Sin stock" : added ? "✓ " + t.common.addToCart : t.common.addToCart}
      </button>
    </div>
  );
}
