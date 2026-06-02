"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login?next=/admin");
  return session!;
}

export async function approveBusiness(id: string) {
  await requireAdmin();
  await prisma.business.update({ where: { id }, data: { status: "VERIFIED", rejectionNote: null } });
  revalidatePath("/admin/comercios");
}

export async function rejectBusiness(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.business.update({
    where: { id },
    data: { status: "REJECTED", rejectionNote: String(formData.get("note") || "Información incompleta o no verificable.") },
  });
  revalidatePath("/admin/comercios");
}

export async function suspendBusiness(id: string) {
  await requireAdmin();
  await prisma.business.update({ where: { id }, data: { status: "SUSPENDED" } });
  revalidatePath("/admin/comercios");
}

export async function toggleFeatured(id: string, value: boolean) {
  await requireAdmin();
  await prisma.business.update({ where: { id }, data: { featured: value } });
  revalidatePath("/admin/comercios");
}

export async function createNews(formData: FormData) {
  const admin = await requireAdmin();
  await prisma.news.create({
    data: {
      title: String(formData.get("title") || ""),
      body: String(formData.get("body") || ""),
      type: String(formData.get("type") || "NEWS"),
      municipality: String(formData.get("municipality") || "Mosquera"),
      imageUrl: formData.getAll("image").map(String).filter(Boolean)[0] || null,
      authorId: admin.id,
    },
  });
  revalidatePath("/admin/noticias");
  revalidatePath("/news");
  redirect("/admin/noticias");
}

export async function deleteNews(id: string) {
  await requireAdmin();
  await prisma.news.delete({ where: { id } });
  revalidatePath("/admin/noticias");
  revalidatePath("/news");
}

export async function resolveReport(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const action = String(formData.get("action")); // dismiss | suspend
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) return;
  if (action === "suspend" && report.targetType === "BUSINESS") {
    await prisma.business.update({ where: { id: report.targetId }, data: { status: "SUSPENDED" } }).catch(() => {});
  }
  await prisma.report.update({ where: { id }, data: { status: action === "suspend" ? "REVIEWED" : "DISMISSED" } });
  revalidatePath("/admin/reportes");
}

export async function createContact(formData: FormData) {
  await requireAdmin();
  const count = await prisma.emergencyContact.count();
  await prisma.emergencyContact.create({
    data: {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      icon: String(formData.get("icon") || "📞"),
      municipality: String(formData.get("municipality") || "Mosquera"),
      order: count,
    },
  });
  revalidatePath("/admin/contactos");
  revalidatePath("/emergency");
}

export async function deleteContact(id: string) {
  await requireAdmin();
  await prisma.emergencyContact.delete({ where: { id } });
  revalidatePath("/admin/contactos");
  revalidatePath("/emergency");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const count = await prisma.category.count();
  await prisma.category.create({
    data: { name, slug, icon: String(formData.get("icon") || "🏪"), order: count },
  });
  revalidatePath("/admin/categorias");
}
