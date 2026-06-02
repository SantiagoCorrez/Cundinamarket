"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function num(v: FormDataEntryValue | null): number | null {
  const n = Number(String(v ?? "").replace(/\D/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function requireOwner(businessId: string) {
  const session = await getSession();
  if (!session) redirect("/login");
  const b = await prisma.business.findUnique({ where: { id: businessId } });
  if (!b || (b.ownerId !== session!.id && session!.role !== "ADMIN")) redirect("/merchant");
  return { session: session!, business: b! };
}

export async function createBusiness(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login?next=/merchant/nuevo");

  // si era ciudadano, lo promovemos a comerciante
  if (session!.role === "CITIZEN") {
    await prisma.user.update({ where: { id: session!.id }, data: { role: "MERCHANT" } });
  }

  const name = String(formData.get("name") || "").trim();
  const categoryId = String(formData.get("categoryId") || "");
  if (!name || !categoryId) redirect("/merchant/nuevo");

  // Validación: nombre no duplicado
  const dup = await prisma.business.findFirst({ where: { name: { equals: name } } });

  const logos = formData.getAll("logo").map(String).filter(Boolean);
  const facade = formData.getAll("facade").map(String).filter(Boolean);
  const sign = formData.getAll("sign").map(String).filter(Boolean);
  const interior = formData.getAll("interior").map(String).filter(Boolean);

  const photos = [
    ...facade.map((url) => ({ url, type: "FACADE" })),
    ...sign.map((url) => ({ url, type: "SIGN" })),
    ...interior.map((url) => ({ url, type: "INTERIOR" })),
  ];

  const business = await prisma.business.create({
    data: {
      ownerId: session!.id,
      name: dup ? `${name} (${Date.now().toString().slice(-4)})` : name,
      categoryId,
      subcategoryId: String(formData.get("subcategoryId") || "") || null,
      description: String(formData.get("description") || ""),
      address: String(formData.get("address") || ""),
      neighborhood: String(formData.get("neighborhood") || "") || null,
      municipality: String(formData.get("municipality") || "Mosquera"),
      phone: String(formData.get("phone") || ""),
      whatsapp: String(formData.get("whatsapp") || "") || null,
      schedule: String(formData.get("schedule") || "") || null,
      instagram: String(formData.get("instagram") || "") || null,
      facebook: String(formData.get("facebook") || "") || null,
      logoUrl: logos[0] || null,
      status: "IN_REVIEW",
      photos: { create: photos },
    },
  });

  revalidatePath("/merchant");
  redirect(`/merchant/${business.id}?registered=1`);
}

export async function updateBusiness(formData: FormData) {
  const id = String(formData.get("id") || "");
  const { business } = await requireOwner(id);

  // Si cambian datos sensibles, vuelve a verificación
  const newAddress = String(formData.get("address") || business.address);
  const sensitiveChanged = newAddress !== business.address;

  await prisma.business.update({
    where: { id },
    data: {
      name: String(formData.get("name") || business.name),
      description: String(formData.get("description") || ""),
      address: newAddress,
      neighborhood: String(formData.get("neighborhood") || "") || null,
      phone: String(formData.get("phone") || business.phone),
      whatsapp: String(formData.get("whatsapp") || "") || null,
      schedule: String(formData.get("schedule") || "") || null,
      instagram: String(formData.get("instagram") || "") || null,
      facebook: String(formData.get("facebook") || "") || null,
      ...(sensitiveChanged && business.status === "VERIFIED" ? { status: "IN_REVIEW" } : {}),
    },
  });
  revalidatePath(`/merchant/${id}`);
  redirect(`/merchant/${id}`);
}

export async function createPromotion(formData: FormData) {
  const businessId = String(formData.get("businessId") || "");
  await requireOwner(businessId);
  await prisma.promotion.create({
    data: {
      businessId,
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      discount: num(formData.get("discount")),
      imageUrl: formData.getAll("image").map(String).filter(Boolean)[0] || null,
      active: true,
    },
  });
  revalidatePath(`/merchant/${businessId}`);
  redirect(`/merchant/${businessId}`);
}

export async function togglePromotion(promotionId: string, businessId: string) {
  await requireOwner(businessId);
  const p = await prisma.promotion.findUnique({ where: { id: promotionId } });
  if (p) await prisma.promotion.update({ where: { id: promotionId }, data: { active: !p.active } });
  revalidatePath(`/merchant/${businessId}`);
}

export async function addProduct(formData: FormData) {
  const businessId = String(formData.get("businessId") || "");
  await requireOwner(businessId);
  await prisma.product.create({
    data: {
      businessId,
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || ""),
      price: num(formData.get("price")),
    },
  });
  revalidatePath(`/merchant/${businessId}`);
  redirect(`/merchant/${businessId}`);
}
