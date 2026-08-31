import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { CartProvider } from "@/lib/cart/cart-context";
import { getLocale } from "@/lib/i18n/get-locale";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ara Rapa Nui",
  description:
    "Paquetes turísticos, experiencias y productos de Rapa Nui, hechos por su gente.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${geistSans.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-sand text-volcanic antialiased">
        <LanguageProvider initialLocale={locale}>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
