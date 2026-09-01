"use client";

import { useState } from "react";

export function ReferralCard({ referralCode }: { referralCode: string }) {
  const [copied, setCopied] = useState(false);
  const link = typeof window !== "undefined" ? `${window.location.origin}/cuenta/registro?ref=${referralCode}` : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — user can still select the text manually
    }
  }

  return (
    <div className="rounded-2xl border border-sand-dark bg-white p-5">
      <p className="font-medium text-volcanic">Invita y gana</p>
      <p className="mt-1 text-sm text-volcanic/60">
        Comparte tu link — cuando la persona que invitaste haga su primera compra, ganas crédito.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <input
          readOnly
          value={link}
          className="flex-1 rounded-lg border border-sand-dark bg-sand px-3 py-2 text-xs text-volcanic/70"
        />
        <button
          onClick={copy}
          className="shrink-0 rounded-full bg-terracotta px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          {copied ? "¡Copiado!" : "Copiar"}
        </button>
      </div>
    </div>
  );
}
