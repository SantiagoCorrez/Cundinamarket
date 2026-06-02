import Link from "next/link";
import { MessageSquareText, ChevronRight } from "lucide-react";
import { ModuleGrid } from "@/components/module-grid";
import { Card } from "@/components/ui";

export default function ExplorePage() {
  return (
    <div className="animate-fadeup">
      <header className="bg-ink text-white rounded-b-[2rem] px-5 pt-6 pb-7">
        <h1 className="text-2xl font-extrabold">Explorar</h1>
        <p className="text-white/60 text-sm mt-1">Todo tu municipio en un solo lugar</p>
      </header>

      <section className="px-4 mt-5">
        <ModuleGrid />
      </section>

      <section className="px-4 mt-5">
        <Link href="/chatbot">
          <Card className="p-4 flex items-center gap-3 bg-brand/15 border-brand/30">
            <span className="h-12 w-12 rounded-2xl bg-brand grid place-items-center">
              <MessageSquareText size={22} className="text-brand-ink" />
            </span>
            <div className="flex-1">
              <p className="font-bold text-ink">Asistente CundiBot</p>
              <p className="text-xs text-ink-soft">Pregúntame qué necesitas y te oriento</p>
            </div>
            <ChevronRight className="text-ink-soft" />
          </Card>
        </Link>
      </section>

      <section className="px-4 mt-4 space-y-2">
        {[
          { href: "/espacios", icon: "🏠", title: "CundiEspacios", desc: "Arriendo, venta y permuta de inmuebles" },
          { href: "/servicios", icon: "🛠️", title: "CundiServicios", desc: "Técnicos y profesionales cerca de ti" },
          { href: "/empleo", icon: "💼", title: "CundiEmpleo", desc: "Vacantes y oportunidades locales" },
          { href: "/emergency", icon: "🚨", title: "Canales de atención", desc: "Policía, bomberos, ambulancia y más" },
        ].map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="p-3.5 flex items-center gap-3">
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-ink">{m.title}</p>
                <p className="text-xs text-ink-soft">{m.desc}</p>
              </div>
              <ChevronRight size={18} className="text-ink-faint" />
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
