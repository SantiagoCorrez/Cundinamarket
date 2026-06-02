import { prisma } from "@/lib/prisma";
import { Card, Button, Field, Input, Select } from "@/components/ui";
import { createContact, deleteContact } from "@/lib/actions/admin";
import { MUNICIPALITIES } from "@/lib/taxonomy";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const contacts = await prisma.emergencyContact.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="p-5 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-extrabold">Canales de atención</h1>
      <p className="text-ink-soft text-sm mt-1">Números de instituciones municipales para acceso rápido.</p>

      <Card className="p-4 mt-4">
        <form action={createContact} className="grid sm:grid-cols-[5rem_1fr_1fr_auto] gap-3 items-end">
          <Field label="Ícono"><Input name="icon" placeholder="🚓" defaultValue="📞" /></Field>
          <Field label="Servicio"><Input name="name" placeholder="Ej: Policía Nacional" required /></Field>
          <Field label="Teléfono"><Input name="phone" placeholder="123" required /></Field>
          <Button>Agregar</Button>
          <input type="hidden" name="municipality" value="Mosquera" />
        </form>
      </Card>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        {contacts.map((c) => (
          <Card key={c.id} className="p-3 flex items-center gap-3">
            <span className="h-11 w-11 rounded-2xl bg-danger/12 grid place-items-center text-2xl">{c.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{c.name}</p>
              <p className="text-sm text-ink-soft">{c.phone}</p>
            </div>
            <form action={deleteContact.bind(null, c.id)}>
              <Button size="sm" variant="ghost" className="text-danger">Eliminar</Button>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
