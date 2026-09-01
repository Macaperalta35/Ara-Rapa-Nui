"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden rounded-full border border-sand-dark px-4 py-2 text-sm font-medium text-volcanic hover:bg-sand"
    >
      Imprimir / Guardar PDF
    </button>
  );
}
