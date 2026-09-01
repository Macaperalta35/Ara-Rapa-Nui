"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { useTranslations, useLocale } from "@/lib/i18n/LanguageProvider";
import { formatClp } from "@/lib/format";
import { submitCheckout } from "@/lib/actions/checkout";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const { items, totalClp, clear } = useCart();
  const t = useTranslations();
  const { locale } = useLocale();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setLoggedIn(true);
      setEmail(data.user.email ?? "");
      const { data: customer } = await supabase
        .from("customers")
        .select("name, phone")
        .eq("id", data.user.id)
        .maybeSingle();
      if (customer?.name) setName(customer.name);
      if (customer?.phone) setPhone(customer.phone);
    });
  }, []);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <p className="text-volcanic/60">{t.cart.empty}</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const result = await submitCheckout({
      items,
      guest: { name, email, phone },
      locale,
    });

    if ("error" in result) {
      setError(result.error);
      setPending(false);
      return;
    }

    clear();
    window.location.href = result.paymentUrl;
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1fr]">
      <div>
        <h1 className="font-display text-2xl font-semibold text-volcanic">{t.checkout.title}</h1>
        {loggedIn ? (
          <p className="mt-1 text-sm text-volcanic/60">
            Comprando como <span className="font-medium text-volcanic">{email}</span>
          </p>
        ) : (
          <p className="mt-1 text-sm text-volcanic/60">
            {t.checkout.guestNotice}{" "}
            <Link href="/cuenta/login" className="text-ocean hover:underline">
              {t.account.alreadyHaveAccount}
            </Link>
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
            {t.common.name}
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
            {t.common.email}
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-volcanic">
            {t.common.phone}
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-terracotta px-6 py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-terracotta-light active:scale-[0.98] disabled:opacity-60"
          >
            {pending ? t.checkout.processing : t.checkout.payButton}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-sand-dark bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-volcanic">
          {t.checkout.orderSummary}
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {items.map((line) => (
            <li key={line.lineId} className="flex justify-between text-sm">
              <span className="text-volcanic/80">
                {line.quantity}× {locale === "es" ? line.nameEs : line.nameEn}
              </span>
              <span className="font-medium text-volcanic">
                {formatClp(line.unitPriceClp * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-sand-dark pt-4 font-medium">
          <span>{t.common.total}</span>
          <span className="font-display text-lg text-terracotta">{formatClp(totalClp)}</span>
        </div>
      </div>
    </div>
  );
}
