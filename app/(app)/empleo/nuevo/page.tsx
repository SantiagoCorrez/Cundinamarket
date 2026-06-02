import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { BackBar } from "@/components/nav";
import { Button, Field, Input, Textarea, Select } from "@/components/ui";
import { createJob } from "@/lib/actions/modules";
import { JOB_SECTORS, CONTRACT_TYPES, MUNICIPALITIES } from "@/lib/taxonomy";

export default async function NewJobPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/empleo/nuevo");

  return (
    <div>
      <BackBar title="Publicar vacante" />
      <form action={createJob} className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Empresa" required>
            <Input name="companyName" placeholder="Nombre de la empresa" />
          </Field>
          <Field label="Sector">
            <Select name="sector">
              {JOB_SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Cargo / puesto" required>
          <Input name="title" placeholder="Ej: Auxiliar de cocina" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo de contrato">
            <Select name="contractType">
              {CONTRACT_TYPES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Jornada">
            <Input name="workday" placeholder="Diurna / Nocturna" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Salario aproximado">
            <Input name="salary" type="number" inputMode="numeric" placeholder="1300000" />
          </Field>
          <Field label="Municipio">
            <Select name="municipality" defaultValue="Mosquera">
              {MUNICIPALITIES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Funciones del cargo" required>
          <Textarea name="functions" placeholder="Describe las funciones principales." />
        </Field>
        <Field label="Requisitos">
          <Textarea name="requirements" placeholder="Requisitos del candidato." />
        </Field>
        <Field label="Experiencia requerida">
          <Input name="experience" placeholder="Ej: 6 meses a 1 año" />
        </Field>

        <Field label="Dirección aproximada">
          <Input name="address" placeholder="Sector / dirección" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Teléfono">
            <Input name="phone" type="tel" placeholder="3XX XXX XXXX" />
          </Field>
          <Field label="WhatsApp">
            <Input name="whatsapp" type="tel" placeholder="3XX XXX XXXX" />
          </Field>
        </div>
        <Field label="Correo de contacto">
          <Input name="email" type="email" placeholder="rrhh@empresa.co" />
        </Field>

        <Button size="lg" className="w-full">Publicar vacante</Button>
      </form>
    </div>
  );
}
