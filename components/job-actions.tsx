"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Check } from "lucide-react";
import { Button } from "./ui";
import { toggleSaveJob } from "@/lib/actions/modules";

export function JobActions({
  jobId,
  initialSaved,
  initialApplied,
  isAuthed,
  contact,
}: {
  jobId: string;
  initialSaved: boolean;
  initialApplied: boolean;
  isAuthed: boolean;
  contact?: { phone?: string | null; whatsapp?: string | null; email?: string | null };
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [applied, setApplied] = useState(initialApplied);
  const [, start] = useTransition();

  function requireAuth() {
    if (!isAuthed) {
      router.push(`/login?next=/empleo/${jobId}`);
      return false;
    }
    return true;
  }

  function apply() {
    if (!requireAuth()) return;
    setApplied(true);
    setSaved(true);
    start(() => void toggleSaveJob(jobId, true));
  }

  function save() {
    if (!requireAuth()) return;
    setSaved((s) => !s);
    start(() => void toggleSaveJob(jobId, false));
  }

  return (
    <div className="sticky bottom-0 bg-surface/95 backdrop-blur border-t border-line p-3 flex gap-2">
      <Button onClick={save} variant="outline" size="lg" className="px-4">
        <Bookmark size={18} className={saved ? "fill-ink" : ""} />
      </Button>
      {applied ? (
        <Button size="lg" className="flex-1 bg-success text-white" disabled>
          <Check size={18} /> Postulación enviada
        </Button>
      ) : (
        <Button size="lg" className="flex-1" onClick={apply}>
          Postularme
        </Button>
      )}
    </div>
  );
}
