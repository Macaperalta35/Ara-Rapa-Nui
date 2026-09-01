"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "@/lib/i18n/LanguageProvider";

export default function CustomerLoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Correo o contraseña incorrectos.");
      setPending(false);
      return;
    }

    router.push("/cuenta");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-volcanic">{t.account.login}</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
          {pending ? "…" : t.account.login}
        </button>
      </form>

      <p className="mt-4 text-sm text-volcanic/60">
        {t.account.noAccountYet}{" "}
        <Link href="/cuenta/registro" className="text-ocean hover:underline">
          {t.account.register}
        </Link>
      </p>
    </div>
  );
}
