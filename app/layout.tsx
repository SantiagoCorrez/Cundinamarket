import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CundiMarket — Conectando tu municipio",
  description:
    "Marketplace local de Cundinamarca: comercios, inmuebles, servicios, empleo y noticias de tu municipio.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "CundiMarket", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#c2f92c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg text-ink">{children}</body>
    </html>
  );
}
