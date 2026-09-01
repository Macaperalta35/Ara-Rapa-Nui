"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "@/lib/i18n/LanguageProvider";

export function AccountLink() {
  const t = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (email === undefined) return null; // avoid a flash before we know session state

  if (!email) {
    return (
      <Link href="/cuenta/login" className="hover:text-white">
        {t.account.login}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/cuenta" className="hover:text-white">
        {t.account.myAccount}
      </Link>
      <button onClick={logout} className="hover:text-white">
        {t.account.logout}
      </button>
    </div>
  );
}
