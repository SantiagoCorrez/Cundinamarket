"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Field, Input, Select } from "@/components/ui";
import { BrandMark } from "@/components/brand";
import { loginAction, registerAction, type AuthState } from "@/lib/actions/auth";
import { MUNICIPALITIES } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const params = useSearchParams();
  const next = params.get("next") || "";
  const initialRole = params.get("role") === "merchant" ? "MERCHANT" : "CITIZEN";
  const [role, setRole] = useState<"CITIZEN" | "MERCHANT">(initialRole);

  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, undefined);

  return (
    <main className="min-h-dvh mx-auto max-w-md flex flex-col px-6 py-10 bg-surface">
      <Link href="/home" className="flex items-center gap-2 mb-8">
        <BrandMark size={32} />
        <span className="font-extrabold">
          Cundi<span className="text-brand-strong">Market</span>
        </span>
      </Link>

      <h1 className="text-2xl font-extrabold text-ink">
        {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      </h1>
      <p className="text-sm text-ink-soft mt-1">
        {mode === "login"
          ? "Bienvenido de vuelta a tu municipio."
          : "Únete a la comunidad de CundiMarket."}
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next} />
        <input type="hidden" name="role" value={role} />

        {mode === "register" && (
          <>
            <div className="grid grid-cols-2 gap-2 p-1 bg-bg rounded-2xl">
              {(["CITIZEN", "MERCHANT"] as const).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "h-11 rounded-xl text-sm font-semibold transition",
                    role === r ? "bg-brand text-brand-ink shadow-card" : "text-ink-soft",
                  )}
                >
                  {r === "CITIZEN" ? "👤 Ciudadano" : "🏪 Comerciante"}
                </button>
              ))}
            </div>
            <Field label="Nombre completo" required>
              <Input name="name" placeholder="Tu nombre" required />
            </Field>
          </>
        )}

        <Field label="Correo electrónico" required>
          <Input name="email" type="email" placeholder="correo@ejemplo.com" required />
        </Field>

        <Field label="Contraseña" required hint={mode === "register" ? "Mínimo 6 caracteres" : undefined}>
          <Input name="password" type="password" placeholder="••••••••" required minLength={6} />
        </Field>

        {mode === "register" && (
          <>
            <Field label="Teléfono / WhatsApp">
              <Input name="phone" type="tel" placeholder="3XX XXX XXXX" />
            </Field>
            <Field label="Municipio">
              <Select name="municipality" defaultValue="Mosquera">
                {MUNICIPALITIES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </Field>
          </>
        )}

        {state?.error && (
          <p className="text-sm text-danger bg-danger/10 rounded-xl px-3 py-2">{state.error}</p>
        )}

        <Button size="lg" className="w-full" disabled={pending}>
          {pending ? "Procesando…" : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-ink-faint">O</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <p className="text-center text-sm text-ink-soft">
        {mode === "login" ? (
          <>
            ¿No tienes cuenta?{" "}
            <Link href={`/register${next ? `?next=${next}` : ""}`} className="font-semibold text-ink underline">
              Crear cuenta
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link href={`/login${next ? `?next=${next}` : ""}`} className="font-semibold text-ink underline">
              Iniciar sesión
            </Link>
          </>
        )}
      </p>
    </main>
  );
}
