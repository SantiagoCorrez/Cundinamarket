"use client";

import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui";

const slides = [
  { icon: "🏪", title: "Encuentra comercios cerca de ti", text: "Restaurantes, tiendas, salud, tecnología y mucho más de tu municipio." },
  { icon: "🛠️", title: "Servicios, inmuebles y empleo", text: "CundiServicios, CundiEspacios y CundiEmpleo en un solo lugar." },
  { icon: "📰", title: "Tu municipio, siempre informado", text: "Noticias oficiales, alertas y canales de atención municipal." },
];

export default function WelcomePage() {
  const router = useRouter();

  function start() {
    localStorage.setItem("cundi_onboarded", "1");
    router.replace("/home");
  }

  return (
    <main className="min-h-dvh mx-auto max-w-md flex flex-col px-6 py-10 bg-surface">
      <div className="flex items-center gap-2">
        <BrandMark size={36} />
        <span className="font-extrabold text-lg">
          Cundi<span className="text-brand-strong">Market</span>
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-8 py-8">
        {slides.map((s) => (
          <div key={s.title} className="flex items-start gap-4 animate-fadeup">
            <div className="h-14 w-14 rounded-2xl bg-brand/20 grid place-items-center text-3xl shrink-0">
              {s.icon}
            </div>
            <div>
              <h2 className="font-bold text-ink text-lg leading-tight">{s.title}</h2>
              <p className="text-sm text-ink-soft mt-1">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Button size="lg" className="w-full" onClick={start}>
          Comenzar
        </Button>
        <p className="text-center text-xs text-ink-faint">
          Piloto en Mosquera · Cundinamarca, Colombia
        </p>
      </div>
    </main>
  );
}
