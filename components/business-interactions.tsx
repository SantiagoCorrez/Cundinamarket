"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart, Flag, Star } from "lucide-react";
import { Sheet } from "./sheet";
import { Button, Textarea } from "./ui";
import { toggleFavorite, rateTarget, reportTarget } from "@/lib/actions/social";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  businessId,
  initial,
  isAuthed,
}: {
  businessId: string;
  initial: boolean;
  isAuthed: boolean;
}) {
  const router = useRouter();
  const [fav, setFav] = useState(initial);
  const [pending, start] = useTransition();

  function click() {
    if (!isAuthed) {
      router.push(`/login?next=/business/${businessId}`);
      return;
    }
    setFav((f) => !f);
    start(async () => {
      await toggleFavorite(businessId);
    });
  }

  return (
    <button
      onClick={click}
      disabled={pending}
      aria-label="Favorito"
      className="h-11 w-11 grid place-items-center rounded-full bg-surface border border-line shadow-card active:scale-95 transition"
    >
      <Heart size={20} className={cn(fav ? "fill-danger text-danger" : "text-ink")} />
    </button>
  );
}

export function RateButton({
  targetId,
  type,
  isAuthed,
}: {
  targetId: string;
  type: "business" | "provider";
  isAuthed: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(5);
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  function openSheet() {
    if (!isAuthed) {
      router.push(`/login`);
      return;
    }
    setOpen(true);
  }

  function submit(formData: FormData) {
    formData.set("stars", String(stars));
    formData.set(type === "business" ? "businessId" : "providerId", targetId);
    start(async () => {
      await rateTarget(formData);
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
        router.refresh();
      }, 900);
    });
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={openSheet}>
        <Star size={16} /> Calificar
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Califica tu experiencia">
        {done ? (
          <p className="text-center py-6 font-semibold text-success">¡Gracias por tu calificación! ✔</p>
        ) : (
          <form action={submit} className="space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setStars(n)}>
                  <Star
                    size={36}
                    className={n <= stars ? "fill-[#f5a623] text-[#f5a623]" : "text-line"}
                  />
                </button>
              ))}
            </div>
            <Textarea name="comment" placeholder="Cuéntanos sobre tu experiencia (opcional)" />
            <Button className="w-full" disabled={pending}>
              {pending ? "Enviando…" : "Enviar calificación"}
            </Button>
          </form>
        )}
      </Sheet>
    </>
  );
}

const reasons = [
  "Información incorrecta",
  "Negocio inexistente",
  "Contenido inapropiado",
  "Promociones engañosas",
];

export function ReportButton({
  targetId,
  targetType,
  isAuthed,
}: {
  targetId: string;
  targetType: "BUSINESS" | "PROPERTY" | "SERVICE" | "JOB";
  isAuthed: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(reasons[0]);
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  function openSheet() {
    if (!isAuthed) return router.push("/login");
    setOpen(true);
  }

  function submit(formData: FormData) {
    formData.set("targetId", targetId);
    formData.set("targetType", targetType);
    formData.set("reason", reason);
    start(async () => {
      await reportTarget(formData);
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
      }, 900);
    });
  }

  return (
    <>
      <button onClick={openSheet} className="inline-flex items-center gap-1 text-xs text-ink-faint">
        <Flag size={13} /> Reportar
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Reportar publicación">
        {done ? (
          <p className="text-center py-6 font-semibold text-success">Reporte enviado. ¡Gracias!</p>
        ) : (
          <form action={submit} className="space-y-3">
            {reasons.map((r) => (
              <label key={r} className="flex items-center gap-3 p-3 rounded-2xl border border-line">
                <input
                  type="radio"
                  name="reason"
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="accent-ink"
                />
                <span className="text-sm">{r}</span>
              </label>
            ))}
            <Textarea name="detail" placeholder="Detalles adicionales (opcional)" />
            <Button variant="danger" className="w-full" disabled={pending}>
              {pending ? "Enviando…" : "Enviar reporte"}
            </Button>
          </form>
        )}
      </Sheet>
    </>
  );
}
