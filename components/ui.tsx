import * as React from "react";
import { cn } from "@/lib/utils";

/* ---------- Button ---------- */
type Variant = "primary" | "dark" | "outline" | "ghost" | "danger" | "soft";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-ink hover:bg-brand-strong active:scale-[.98] font-semibold",
  dark: "bg-ink text-white hover:bg-ink/90 active:scale-[.98] font-semibold",
  outline: "border border-line bg-surface text-ink hover:bg-bg active:scale-[.98]",
  ghost: "text-ink hover:bg-bg active:scale-[.98]",
  soft: "bg-brand/15 text-brand-ink hover:bg-brand/25 font-medium",
  danger: "bg-danger text-white hover:bg-danger/90 active:scale-[.98] font-semibold",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-xl gap-1.5",
  md: "h-11 px-4 text-[15px] rounded-2xl gap-2",
  lg: "h-13 px-5 text-base rounded-2xl gap-2 py-3.5",
  icon: "h-10 w-10 rounded-full justify-center",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className = "") {
  return cn(
    "inline-flex items-center justify-center transition-all select-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

/* ---------- Card ---------- */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-surface rounded-xl2 shadow-card border border-line/60", className)}
      {...props}
    />
  );
}

/* ---------- Inputs ---------- */
const fieldBase =
  "w-full bg-surface border border-line rounded-2xl px-4 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink/40 focus:ring-2 focus:ring-brand/40 transition";

export function Field({ label, hint, children, required }: { label: string; hint?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "py-3 min-h-24", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, "h-12 appearance-none bg-no-repeat pr-10", className)} {...props}>
      {children}
    </select>
  );
}

/* ---------- Badge / Pill ---------- */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "success" | "warn" | "danger" | "info";
  className?: string;
}) {
  const tones = {
    neutral: "bg-bg text-ink-soft",
    brand: "bg-brand/20 text-brand-ink",
    success: "bg-success/15 text-success",
    warn: "bg-warn/15 text-[#9a6a00]",
    danger: "bg-danger/12 text-danger",
    info: "bg-info/12 text-info",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function VerifiedBadge({ small }: { small?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-success/15 text-success font-semibold",
        small ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-0.5 text-xs",
      )}
      title="Comercio verificado"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z" opacity=".25" />
        <path d="m9.5 12.5 1.7 1.7 3.6-3.6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Verificado
    </span>
  );
}

/* ---------- Stars ---------- */
export function Stars({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[#f5a623]">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.3 6.2 21l1.5-6.6L2.5 9.8l6.7-.6L12 3l2.8 6.2 6.7.6-5.2 4.6L17.8 21 12 17.3Z" />
      </svg>
      <span className="text-sm font-semibold text-ink">{value > 0 ? value.toFixed(1) : "Nuevo"}</span>
      {typeof count === "number" && count > 0 && (
        <span className="text-xs text-ink-faint">({count})</span>
      )}
    </span>
  );
}

/* ---------- Section title ---------- */
export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-1">
      <h2 className="text-[17px] font-bold text-ink">{children}</h2>
      {action}
    </div>
  );
}

/* ---------- Empty state ---------- */
export function EmptyState({ icon = "🔍", title, subtitle, action }: { icon?: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="font-semibold text-ink">{title}</p>
      {subtitle && <p className="text-sm text-ink-soft mt-1 max-w-xs">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ---------- Spinner ---------- */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin-slow",
        className,
      )}
    />
  );
}

/* ---------- Avatar / Logo ---------- */
export function Logo({ name, src, size = 56 }: { name: string; src?: string | null; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className="rounded-2xl object-cover bg-bg"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-2xl bg-ink text-brand grid place-items-center font-bold"
      style={{ width: size, height: size, fontSize: size / 2.6 }}
    >
      {initials}
    </div>
  );
}
