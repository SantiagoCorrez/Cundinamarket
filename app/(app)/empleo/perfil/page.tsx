import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BackBar } from "@/components/nav";
import { Button, Field, Input, Textarea, Card } from "@/components/ui";
import { ImageUpload } from "@/components/image-upload";
import { saveCandidateProfile } from "@/lib/actions/modules";

export const dynamic = "force-dynamic";

export default async function CandidateProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/empleo/perfil");

  const profile = await prisma.candidateProfile.findUnique({ where: { userId: session.id } });
  const saved = await prisma.savedJob.findMany({
    where: { userId: session.id },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <BackBar title="Mi perfil laboral" />
      <form action={saveCandidateProfile} className="p-4 space-y-4">
        <Field label="Nombre">
          <Input defaultValue={session.name} disabled />
        </Field>
        <Field label="Experiencia laboral">
          <Textarea name="experience" defaultValue={profile?.experience || ""} placeholder="Cuéntanos tu experiencia." />
        </Field>
        <Field label="Habilidades">
          <Input name="skills" defaultValue={profile?.skills || ""} placeholder="Ej: trabajo en equipo, manejo de caja" />
        </Field>
        <Field label="Formación académica">
          <Input name="education" defaultValue={profile?.education || ""} placeholder="Ej: Bachiller, Técnico…" />
        </Field>
        <Field label="Hoja de vida (imagen/PDF como imagen)">
          <ImageUpload name="cv" max={1} label="Adjuntar hoja de vida" />
        </Field>
        <Button size="lg" className="w-full">Guardar perfil</Button>
      </form>

      {saved.length > 0 && (
        <section className="p-4">
          <h2 className="font-bold mb-2">Vacantes guardadas y postulaciones</h2>
          <div className="space-y-2">
            {saved.map((s) => (
              <Card key={s.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{s.job.title}</p>
                  <p className="text-xs text-ink-soft">{s.job.companyName}</p>
                </div>
                <span className={`text-xs font-semibold ${s.applied ? "text-success" : "text-ink-faint"}`}>
                  {s.applied ? "Postulado ✓" : "Guardada"}
                </span>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
