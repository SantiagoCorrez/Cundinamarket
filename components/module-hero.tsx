import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function ModuleHero({
  title,
  subtitle,
  icon,
  cta,
}: {
  title: string;
  subtitle: string;
  icon: string;
  cta?: { href: string; label: string };
}) {
  return (
    <header className="bg-ink text-white rounded-b-[2rem] px-5 pt-5 pb-6">
      <div className="flex items-center justify-between">
        <Link href="/explore" className="h-9 w-9 grid place-items-center rounded-full bg-white/10">
          <ChevronLeft size={22} />
        </Link>
        <span className="text-3xl">{icon}</span>
      </div>
      <h1 className="text-2xl font-extrabold mt-3">{title}</h1>
      <p className="text-white/60 text-sm mt-0.5">{subtitle}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-4 inline-flex h-11 px-5 rounded-2xl bg-brand text-brand-ink font-semibold items-center"
        >
          {cta.label}
        </Link>
      )}
    </header>
  );
}

export function FilterChips({
  base,
  param,
  current,
  options,
}: {
  base: string;
  param: string;
  current?: string;
  options: { key: string; label: string }[];
}) {
  const make = (key?: string) => {
    const sp = new URLSearchParams();
    if (key) sp.set(param, key);
    const qs = sp.toString();
    return qs ? `${base}?${qs}` : base;
  };
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3">
      <Link
        href={make()}
        className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium border transition ${!current ? "bg-ink text-white border-ink" : "bg-surface border-line text-ink-soft"}`}
      >
        Todos
      </Link>
      {options.map((o) => (
        <Link
          key={o.key}
          href={make(o.key)}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium border transition whitespace-nowrap ${current === o.key ? "bg-ink text-white border-ink" : "bg-surface border-line text-ink-soft"}`}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}
