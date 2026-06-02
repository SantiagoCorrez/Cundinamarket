import { notFound } from "next/navigation";
import { MapPin, Briefcase, Clock, DollarSign } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BackBar } from "@/components/nav";
import { Badge, Card } from "@/components/ui";
import { JobActions } from "@/components/job-actions";
import { formatCOP } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const j = await prisma.job.findUnique({ where: { id } });
  if (!j) notFound();

  const saved = session
    ? await prisma.savedJob.findUnique({ where: { userId_jobId: { userId: session.id, jobId: id } } })
    : null;

  const meta = [
    { icon: Briefcase, label: "Empresa", value: j.companyName },
    { icon: MapPin, label: "Ubicación", value: `${j.municipality}${j.address ? `, ${j.address}` : ""}` },
    { icon: DollarSign, label: "Salario", value: formatCOP(j.salary) },
    { icon: Clock, label: "Contrato", value: `${j.contractType}${j.workday ? ` · ${j.workday}` : ""}` },
  ];

  return (
    <div>
      <BackBar title="Vacante" />
      <div className="p-4">
        <Badge tone="brand">{j.sector}</Badge>
        <h1 className="text-2xl font-extrabold mt-2">{j.title}</h1>
        <p className="text-ink-soft">{j.companyName}</p>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {meta.map((m) => (
            <Card key={m.label} className="p-3">
              <div className="flex items-center gap-1.5 text-ink-faint text-xs">
                <m.icon size={13} /> {m.label}
              </div>
              <p className="font-semibold text-sm text-ink mt-0.5">{m.value}</p>
            </Card>
          ))}
        </div>

        {j.functions && (
          <>
            <h2 className="font-bold mt-5">Funciones</h2>
            <p className="text-sm text-ink-soft mt-1 whitespace-pre-line leading-relaxed">{j.functions}</p>
          </>
        )}
        {j.requirements && (
          <>
            <h2 className="font-bold mt-4">Requisitos</h2>
            <p className="text-sm text-ink-soft mt-1 whitespace-pre-line leading-relaxed">{j.requirements}</p>
          </>
        )}
        {j.experience && (
          <p className="text-sm text-ink-soft mt-3">
            <span className="font-semibold text-ink">Experiencia:</span> {j.experience}
          </p>
        )}
      </div>

      <JobActions
        jobId={id}
        initialSaved={!!saved}
        initialApplied={!!saved?.applied}
        isAuthed={!!session}
        contact={{ phone: j.phone, whatsapp: j.whatsapp, email: j.email }}
      />
    </div>
  );
}
