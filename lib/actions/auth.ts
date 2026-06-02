"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
  type Role,
} from "@/lib/auth";

export type AuthState = { error?: string } | undefined;

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const phone = String(formData.get("phone") || "").trim();
  const municipality = String(formData.get("municipality") || "Mosquera");
  const role = (String(formData.get("role") || "CITIZEN") as Role) || "CITIZEN";
  const next = String(formData.get("next") || "");

  if (!name || !email || password.length < 6) {
    return { error: "Completa todos los campos. La contraseña debe tener mínimo 6 caracteres." };
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Ya existe una cuenta con este correo." };

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      municipality,
      role: role === "MERCHANT" ? "MERCHANT" : "CITIZEN",
      passwordHash: await hashPassword(password),
    },
  });

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
    municipality: user.municipality,
  });

  redirect(next || (user.role === "MERCHANT" ? "/merchant" : "/home"));
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Correo o contraseña incorrectos." };
  }

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
    municipality: user.municipality,
  });

  redirect(
    next ||
      (user.role === "ADMIN" ? "/admin" : user.role === "MERCHANT" ? "/merchant" : "/home"),
  );
}

export async function logoutAction() {
  await destroySession();
  redirect("/home");
}
