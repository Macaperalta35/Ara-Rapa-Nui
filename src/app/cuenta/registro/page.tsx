"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "@/lib/i18n/LanguageProvider";

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const referredByCode = searchParams.get("ref");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone, referred_by_code: referredByCode ?? undefined } },
    });

    if (error) {
      setError(error.message);
      setPending(false);
      return;
    }

    setSuccess(true);
    setPending(false);

    // If email confirmation is off, signUp already returns a session.
    if (data.session) {
      router.push("/cuenta");
      router.refresh();
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-volcanic">{t.account.register}</h1>
        <p className="mt-4 text-volcanic/70">{t.account.registerSuccess}</p>
        <Link href="/cuenta/login" className="mt-6 inline-block text-sm text-ocean hover:underline">
          {t.account.login} →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-volcanic">{t.account.register}</h1>
      {referredByCode && (
        <p className="mt-2 text-sm text-ocean">Te invitó un amigo — ¡bienvenido a Ara Rapa Nui!</p>
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
          {t.common.phone}
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
          {t.account.password}
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-sand-dark px-3 py-2 text-sm"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-terracotta-light active:scale-[0.98] disabled:opacity-60"
        >
          {pending ? "…" : t.account.register}
        </button>
      </form>

      <p className="mt-4 text-sm text-volcanic/60">
        {t.account.alreadyHaveAccount}{" "}
        <Link href="/cuenta/login" className="text-ocean hover:underline">
          {t.account.login}
        </Link>
      </p>
    </div>
  );
}
