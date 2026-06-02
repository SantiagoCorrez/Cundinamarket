import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { BackBar } from "@/components/nav";
import { Button, Field, Input, Textarea, Select } from "@/components/ui";
import { ImageUpload } from "@/components/image-upload";
import { createProperty } from "@/lib/actions/modules";
import { OFFER_TYPES, PROPERTY_TYPES, MUNICIPALITIES } from "@/lib/taxonomy";

export default async function NewPropertyPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/espacios/nuevo");

  return (
    <div>
      <BackBar title="Publicar inmueble" />
      <form action={createProperty} className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo de oferta" required>
            <Select name="offerType">
              {OFFER_TYPES.map((o) => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Tipo de inmueble" required>
            <Select name="propertyType">
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Municipio">
            <Select name="municipality" defaultValue="Mosquera">
              {MUNICIPALITIES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </Field>
          <Field label="Barrio / sector">
            <Input name="neighborhood" placeholder="Ej: Centro" />
          </Field>
        </div>

        <Field label="Dirección aproximada">
          <Input name="address" placeholder="Calle 00 # 0-00" />
        </Field>

        <Field label="Precio (COP)" required hint="Valor de arriendo o venta">
          <Input name="price" type="number" inputMode="numeric" placeholder="900000" />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Habitaciones">
            <Input name="rooms" type="number" inputMode="numeric" placeholder="3" />
          </Field>
          <Field label="Baños">
            <Input name="bathrooms" type="number" inputMode="numeric" placeholder="2" />
          </Field>
          <Field label="Área m²">
            <Input name="area" type="number" inputMode="numeric" placeholder="80" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3 items-center">
          <Field label="Estrato">
            <Input name="stratum" type="number" inputMode="numeric" placeholder="3" />
          </Field>
          <label className="flex items-center gap-2 mt-6">
            <input type="checkbox" name="parking" className="h-5 w-5 accent-brand-strong" />
            <span className="text-sm font-medium">Tiene parqueadero</span>
          </label>
        </div>

        <Field label="Descripción">
          <Textarea name="description" placeholder="Describe el inmueble, su ubicación y ventajas." />
        </Field>
        <Field label="Servicios incluidos">
          <Input name="services" placeholder="Agua, luz, gas, internet…" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Teléfono" required>
            <Input name="phone" type="tel" defaultValue={session.email ? "" : ""} placeholder="3XX XXX XXXX" />
          </Field>
          <Field label="WhatsApp">
            <Input name="whatsapp" type="tel" placeholder="3XX XXX XXXX" />
          </Field>
        </div>
        <Field label="Nombre del responsable">
          <Input name="ownerName" defaultValue={session.name} />
        </Field>

        <Field label="Fotografías" hint="Mínimo 1, máximo 5">
          <ImageUpload name="photos" max={5} label="Fotos del inmueble" />
        </Field>

        <Button size="lg" className="w-full">Publicar anuncio</Button>
      </form>
    </div>
  );
}
