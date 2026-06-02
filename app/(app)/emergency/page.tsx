import { Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BackBar } from "@/components/nav";
import { Card } from "@/components/ui";
import { telLink } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EmergencyPage() {
  const contacts = await prisma.emergencyContact.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <BackBar title="Canales de atención" />
      <div className="p-4">
        <p className="text-sm text-ink-soft mb-4">
          Toca un servicio para llamar directamente. Líneas de atención del municipio de Mosquera.
        </p>
        <div className="space-y-3">
          {contacts.map((c) => (
            <Card key={c.id} className="p-3 flex items-center gap-3">
              <span className="h-12 w-12 rounded-2xl bg-danger/12 grid place-items-center text-2xl">
                {c.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink">{c.name}</p>
                <p className="text-sm text-ink-soft">{c.phone}</p>
              </div>
              <a
                href={telLink(c.phone)}
                className="h-11 px-4 rounded-2xl bg-ink text-white font-semibold flex items-center gap-2"
              >
                <Phone size={16} /> Llamar
              </a>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
