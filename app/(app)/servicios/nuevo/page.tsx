import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { BackBar } from "@/components/nav";
import { Button, Field, Input, Textarea, Select } from "@/components/ui";
import { ImageUpload } from "@/components/image-upload";
import { createService } from "@/lib/actions/modules";
import { SERVICE_CATEGORIES, MUNICIPALITIES } from "@/lib/taxonomy";

export default async function NewServicePage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/servicios/nuevo");

  return (
    <div>
      <BackBar title="Ofrecer servicio" />
      <form action={createService} className="p-4 space-y-4">
        <Field label="Nombre completo" required>
          <Input name="providerName" defaultValue={session.name} />
        </Field>

        <Field label="Categoría" required>
          <Select name="category">
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>{c.icon} {c.name}</option>
            ))}
          </Select>
        </Field>

        <Field label="Tipo de servicio" required>
          <Select name="serviceType">
            {SERVICE_CATEGORIES.map((c) => (
              <optgroup key={c.key} label={c.name}>
                {c.types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </optgroup>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Municipio">
            <Select name="municipality" defaultValue="Mosquera">
              {MUNICIPALITIES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </Field>
          <Field label="Años de experiencia">
            <Input name="yearsExperience" type="number" inputMode="numeric" placeholder="5" />
          </Field>
        </div>

        <Field label="Zona de cobertura">
          <Input name="coverageZone" placeholder="Ej: Mosquera y alrededores" />
        </Field>

        <Field label="Descripción del servicio" required>
          <Textarea name="description" placeholder="Describe los servicios que ofreces." />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Teléfono" required>
            <Input name="phone" type="tel" placeholder="3XX XXX XXXX" />
          </Field>
          <Field label="WhatsApp">
            <Input name="whatsapp" type="tel" placeholder="3XX XXX XXXX" />
          </Field>
        </div>

        <Field label="Fotos de trabajos realizados">
          <ImageUpload name="photos" max={5} label="Fotos (opcional)" />
        </Field>

        <Button size="lg" className="w-full">Publicar servicio</Button>
      </form>
    </div>
  );
}
