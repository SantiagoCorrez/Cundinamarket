"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/brand";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const seen = typeof window !== "undefined" && localStorage.getItem("cundi_onboarded");
    const t = setTimeout(() => {
      router.replace(seen ? "/home" : "/welcome");
    }, 1700);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="min-h-dvh bg-ink flex flex-col items-center justify-center text-center px-8">
      <div className="animate-fadeup flex flex-col items-center">
        <BrandMark size={84} />
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white">
          Cundi<span className="text-brand">Market</span>
        </h1>
        <p className="mt-2 text-white/70 text-sm">Conectando tu municipio</p>
      </div>
      <div className="absolute bottom-16 flex flex-col items-center gap-3">
        <span className="h-6 w-6 rounded-full border-2 border-brand border-t-transparent animate-spin-slow" />
        <span className="text-white/50 text-xs">Cargando aplicación…</span>
      </div>
    </main>
  );
}
