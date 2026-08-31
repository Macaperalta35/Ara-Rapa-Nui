"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { useTranslations } from "@/lib/i18n/LanguageProvider";
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
    };

export function AddToCartForm(props: Props) {
  const { addItem } = useCart();
  const t = useTranslations();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState("");
  const [added, setAdded] = useState(false);

  const outOfStock = props.type === "product" && props.stock <= 0;
  const needsDate =
    (props.type === "package" || (props.type === "experience" && props.requiresDate)) as boolean;

  function handleAdd() {
    const base = {
      lineId: crypto.randomUUID(),
      quantity,
      unitPriceClp: props.unitPriceClp,
      nameEs: props.nameEs,
      nameEn: props.nameEn,
      imageUrl: props.imageUrl,
    };

    let item: CartItem;
    if (props.type === "package") {
      item = { ...base, type: "package", packageId: props.id, slug: props.slug, startDate: date || undefined };
    } else if (props.type === "experience") {
      item = {
        ...base,
        type: "experience",
        experienceId: props.id,
        slug: props.slug,
        selectedDate: date || undefined,
      };
    } else {
      item = { ...base, type: "product", productId: props.id, slug: props.slug };
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
