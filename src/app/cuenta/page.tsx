import Link from "next/link";
import { requireCustomerPage } from "@/lib/auth/customer-guard";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-locale";
import { formatClp } from "@/lib/format";
import { ReferralCard } from "@/components/account/ReferralCard";

export default async function AccountHomePage() {
  const user = await requireCustomerPage();
  const { dict } = await getDictionary();

  const supabase = await createClient();
  const { data: customer } = await supabase
    .from("customers")
    .select("name, referral_code, credit_clp")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-volcanic">
        {dict.account.welcomeBack}
        {customer?.name ? `, ${customer.name}` : ""}
      </h1>
      <p className="mt-1 text-sm text-volcanic/60">{user.email}</p>

      {(customer?.credit_clp ?? 0) > 0 && (
        <p className="mt-3 inline-block rounded-full bg-ocean/15 px-3 py-1 text-sm font-medium text-ocean">
          Tienes {formatClp(customer!.credit_clp)} de crédito disponible
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/cuenta/pedidos"
          className="rounded-2xl border border-sand-dark bg-white p-5 font-medium text-volcanic transition-shadow hover:shadow-md"
        >
          {dict.account.orders} →
        </Link>

        {customer?.referral_code && <ReferralCard referralCode={customer.referral_code} />}
      </div>
    </div>
  );
}
