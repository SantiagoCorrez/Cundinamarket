"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function toggleFavorite(businessId: string) {
  const session = await getSession();
  if (!session) return { error: "Inicia sesión para guardar favoritos." };

  const existing = await prisma.favorite.findUnique({
    where: { userId_businessId: { userId: session.id, businessId } },
  });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { userId: session.id, businessId } });
  }
  revalidatePath(`/business/${businessId}`);
  return { ok: true, favorited: !existing };
}

async function recomputeBusinessRating(businessId: string) {
  const agg = await prisma.rating.aggregate({
    where: { businessId },
    _avg: { stars: true },
    _count: true,
  });
  await prisma.business.update({
    where: { id: businessId },
    data: { ratingAvg: agg._avg.stars || 0, ratingCount: agg._count },
  });
}

async function recomputeProviderRating(providerId: string) {
  const agg = await prisma.rating.aggregate({
    where: { providerId },
    _avg: { stars: true },
    _count: true,
  });
  await prisma.serviceProvider.update({
    where: { id: providerId },
    data: { ratingAvg: agg._avg.stars || 0, ratingCount: agg._count },
  });
}

export async function rateTarget(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Inicia sesión para calificar." };

  const stars = Number(formData.get("stars"));
  const comment = String(formData.get("comment") || "").trim() || null;
  const businessId = (formData.get("businessId") as string) || null;
  const providerId = (formData.get("providerId") as string) || null;
  if (!stars || stars < 1 || stars > 5) return { error: "Calificación inválida." };

  await prisma.rating.create({
    data: { userId: session.id, businessId, providerId, stars, comment },
  });

  if (businessId) {
    await recomputeBusinessRating(businessId);
    revalidatePath(`/business/${businessId}`);
  }
  if (providerId) {
    await recomputeProviderRating(providerId);
    revalidatePath(`/servicios/${providerId}`);
  }
  return { ok: true };
}

export async function reportTarget(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Inicia sesión para reportar." };

  await prisma.report.create({
    data: {
      userId: session.id,
      targetType: String(formData.get("targetType")),
      targetId: String(formData.get("targetId")),
      reason: String(formData.get("reason")),
      detail: String(formData.get("detail") || "") || null,
    },
  });
  return { ok: true };
}
