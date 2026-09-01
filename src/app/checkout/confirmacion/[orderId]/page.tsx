import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDictionary } from "@/lib/i18n/get-locale";
import { formatClp } from "@/lib/format";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const { dict } = await getDictionary();

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, status, total_clp, customer_name")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) notFound();

  const title =
    order.status === "paid" || order.status === "fulfilled"
      ? dict.confirmation.paidTitle
      : order.status === "failed" || order.status === "cancelled"
        ? dict.confirmation.failedTitle
        : dict.confirmation.pendingTitle;

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-volcanic">{title}</h1>
      <p className="mt-4 text-sm text-volcanic/60">
        {dict.confirmation.orderNumber}: <span className="font-mono">{order.id}</span>
      </p>
      <p className="mt-1 font-display text-xl text-terracotta">{formatClp(order.total_clp)}</p>

      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-terracotta-light active:scale-[0.98]"
      >
        {dict.confirmation.backHome}
      </Link>
    </div>
  );
}
