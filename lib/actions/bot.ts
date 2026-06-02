"use server";

import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/taxonomy";

export type BotResult = { id: string; name: string; category: string; rating: number; href: string };
export type BotReply = { reply: string; results: BotResult[] };

export async function askBot(message: string): Promise<BotReply> {
  const m = message.toLowerCase().trim();

  const toResults = (
    list: { id: string; name: string; ratingAvg: number; category: { name: string } }[],
    prefix = "/business",
  ): BotResult[] =>
    list.map((b) => ({ id: b.id, name: b.name, category: b.category.name, rating: b.ratingAvg, href: `${prefix}/${b.id}` }));

  // Saludos
  if (/^(hola|buenas|hey|hi|saludos)/.test(m)) {
    return { reply: "¡Hola! 👋 Soy CundiBot. Puedo ayudarte a encontrar comercios, promociones o servicios en tu municipio. ¿Qué buscas?", results: [] };
  }

  // Promociones
  if (m.includes("promo") || m.includes("descuento") || m.includes("oferta")) {
    const promos = await prisma.promotion.findMany({
      where: { active: true, business: { status: "VERIFIED" } },
      include: { business: { include: { category: true } } },
      take: 5,
      orderBy: { createdAt: "desc" },
    });
    return {
      reply: promos.length ? "🔥 Estas son las promociones activas:" : "Por ahora no hay promociones activas.",
      results: promos.map((p) => ({ id: p.business.id, name: `${p.title} — ${p.business.name}`, category: p.business.category.name, rating: p.business.ratingAvg, href: `/business/${p.business.id}` })),
    };
  }

  // Empleo / inmuebles / servicios
  if (m.includes("empleo") || m.includes("trabajo") || m.includes("vacante")) {
    return { reply: "💼 Revisa las vacantes disponibles en CundiEmpleo.", results: [{ id: "empleo", name: "Ver vacantes", category: "CundiEmpleo", rating: 0, href: "/empleo" }] };
  }
  if (m.includes("arriendo") || m.includes("apartamento") || m.includes("casa") || m.includes("inmueble") || m.includes("local")) {
    return { reply: "🏠 Encuentra inmuebles en CundiEspacios.", results: [{ id: "espacios", name: "Ver inmuebles", category: "CundiEspacios", rating: 0, href: "/espacios" }] };
  }
  if (m.includes("plomer") || m.includes("electric") || m.includes("servicio") || m.includes("técnico") || m.includes("tecnico")) {
    return { reply: "🛠️ Estos servicios pueden ayudarte. Mira CundiServicios.", results: [{ id: "servicios", name: "Ver servicios", category: "CundiServicios", rating: 0, href: "/servicios" }] };
  }

  // Coincidencia por categoría
  const cat = CATEGORIES.find(
    (c) => m.includes(c.name.toLowerCase()) || c.subcategories.some((s) => m.includes(s.toLowerCase())) ||
      (c.slug === "gastronomia" && (m.includes("restaurante") || m.includes("comida") || m.includes("comer"))),
  );
  if (cat) {
    const list = await prisma.business.findMany({
      where: { status: "VERIFIED", category: { slug: cat.slug } },
      include: { category: true },
      orderBy: { ratingAvg: "desc" },
      take: 5,
    });
    return {
      reply: list.length ? `${cat.icon} Encontré estos comercios en ${cat.name}:` : `No hay comercios verificados en ${cat.name} todavía.`,
      results: toResults(list),
    };
  }

  // Búsqueda libre
  const list = await prisma.business.findMany({
    where: {
      status: "VERIFIED",
      OR: [{ name: { contains: m } }, { description: { contains: m } }, { products: { some: { name: { contains: m } } } }],
    },
    include: { category: true },
    orderBy: { ratingAvg: "desc" },
    take: 5,
  });
  if (list.length) return { reply: "Esto fue lo que encontré:", results: toResults(list) };

  return {
    reply: "No encontré resultados exactos 🤔. Prueba con una categoría (ej: \"restaurantes\", \"droguería\") o escribe \"promociones\".",
    results: [],
  };
}
