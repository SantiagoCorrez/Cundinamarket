"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function num(v: FormDataEntryValue | null): number | null {
  const n = Number(String(v ?? "").replace(/\D/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/* ---------------- CundiEspacios ---------------- */
export async function createProperty(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login?next=/espacios/nuevo");

  const photos = formData.getAll("photos").map(String).filter(Boolean);
  const prop = await prisma.property.create({
    data: {
      userId: session!.id,
      offerType: String(formData.get("offerType") || "RENT"),
      propertyType: String(formData.get("propertyType") || "Apartamento"),
      municipality: String(formData.get("municipality") || "Mosquera"),
      neighborhood: String(formData.get("neighborhood") || "") || null,
      address: String(formData.get("address") || "") || null,
      area: num(formData.get("area")),
      rooms: num(formData.get("rooms")),
      bathrooms: num(formData.get("bathrooms")),
      parking: formData.get("parking") === "on",
      stratum: num(formData.get("stratum")),
      price: num(formData.get("price")),
      description: String(formData.get("description") || ""),
      services: String(formData.get("services") || "") || null,
      ownerName: String(formData.get("ownerName") || session!.name),
      phone: String(formData.get("phone") || ""),
      whatsapp: String(formData.get("whatsapp") || "") || null,
      photos: { create: photos.map((url) => ({ url })) },
    },
  });
  revalidatePath("/espacios");
  redirect(`/espacios/${prop.id}`);
}

/* ---------------- CundiServicios ---------------- */
export async function createService(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login?next=/servicios/nuevo");

  const photos = formData.getAll("photos").map(String).filter(Boolean);
  const sp = await prisma.serviceProvider.create({
    data: {
      userId: session!.id,
      providerName: String(formData.get("providerName") || session!.name),
      category: String(formData.get("category") || "hogar"),
      serviceType: String(formData.get("serviceType") || ""),
      municipality: String(formData.get("municipality") || "Mosquera"),
      coverageZone: String(formData.get("coverageZone") || "") || null,
      description: String(formData.get("description") || ""),
      yearsExperience: num(formData.get("yearsExperience")),
      phone: String(formData.get("phone") || ""),
      whatsapp: String(formData.get("whatsapp") || "") || null,
      photoUrl: photos[0] || null,
      photos: { create: photos.slice(1).map((url) => ({ url })) },
    },
  });
  revalidatePath("/servicios");
  redirect(`/servicios/${sp.id}`);
}

/* ---------------- CundiEmpleo ---------------- */
export async function createJob(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login?next=/empleo/nuevo");

  const job = await prisma.job.create({
    data: {
      userId: session!.id,
      companyName: String(formData.get("companyName") || ""),
      sector: String(formData.get("sector") || "Comercio"),
      title: String(formData.get("title") || ""),
      contractType: String(formData.get("contractType") || "Tiempo completo"),
      workday: String(formData.get("workday") || "") || null,
      salary: num(formData.get("salary")),
      functions: String(formData.get("functions") || ""),
      requirements: String(formData.get("requirements") || ""),
      experience: String(formData.get("experience") || "") || null,
      municipality: String(formData.get("municipality") || "Mosquera"),
      address: String(formData.get("address") || "") || null,
      phone: String(formData.get("phone") || "") || null,
      email: String(formData.get("email") || "") || null,
      whatsapp: String(formData.get("whatsapp") || "") || null,
    },
  });
  revalidatePath("/empleo");
  redirect(`/empleo/${job.id}`);
}

export async function toggleSaveJob(jobId: string, applied = false) {
  const session = await getSession();
  if (!session) return { error: "Inicia sesión." };
  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId: session.id, jobId } },
  });
  if (existing && !applied) {
    await prisma.savedJob.delete({ where: { id: existing.id } });
  } else if (existing && applied) {
    await prisma.savedJob.update({ where: { id: existing.id }, data: { applied: true } });
  } else {
    await prisma.savedJob.create({ data: { userId: session.id, jobId, applied } });
  }
  revalidatePath(`/empleo/${jobId}`);
  return { ok: true };
}

export async function saveCandidateProfile(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login?next=/empleo/perfil");
  const cv = formData.getAll("cv").map(String).filter(Boolean)[0] || undefined;
  const data = {
    experience: String(formData.get("experience") || "") || null,
    skills: String(formData.get("skills") || "") || null,
    education: String(formData.get("education") || "") || null,
    ...(cv ? { cvUrl: cv } : {}),
  };
  await prisma.candidateProfile.upsert({
    where: { userId: session!.id },
    create: { userId: session!.id, ...data },
    update: data,
  });
  revalidatePath("/empleo/perfil");
  redirect("/empleo");
}
