import Link from "next/link";

const modules = [
  { href: "/search", label: "Comercios", icon: "🏪", bg: "bg-brand/20" },
  { href: "/espacios", label: "CundiEspacios", icon: "🏠", bg: "bg-info/12" },
  { href: "/servicios", label: "CundiServicios", icon: "🛠️", bg: "bg-warn/15" },
  { href: "/empleo", label: "CundiEmpleo", icon: "💼", bg: "bg-success/12" },
  { href: "/news", label: "Noticias", icon: "📰", bg: "bg-ink/5" },
  { href: "/emergency", label: "Atención", icon: "🚨", bg: "bg-danger/12" },
];

export function ModuleGrid() {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {modules.map((m) => (
        <Link
          key={m.href}
          href={m.href}
          className="active:scale-95 transition flex flex-col items-center gap-1.5 bg-surface border border-line/60 rounded-2xl py-3.5 shadow-card"
        >
          <span className={`h-11 w-11 rounded-2xl grid place-items-center text-2xl ${m.bg}`}>
            {m.icon}
          </span>
          <span className="text-[11px] font-semibold text-ink text-center leading-tight px-1">
            {m.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
