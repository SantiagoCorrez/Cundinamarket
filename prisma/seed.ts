import { PrismaClient } from "../lib/generated/prisma";
import bcrypt from "bcryptjs";
import {
  CATEGORIES,
  SERVICE_CATEGORIES,
  NEIGHBORHOODS_MOSQUERA,
} from "../lib/taxonomy";

const prisma = new PrismaClient();

const img = (seed: string, w = 600, h = 400) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const pick = <T,>(arr: T[], i: number) => arr[i % arr.length];

async function main() {
  console.log("🌱 Limpiando base de datos…");
  await prisma.rating.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.report.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.product.deleteMany();
  await prisma.businessPhoto.deleteMany();
  await prisma.business.deleteMany();
  await prisma.propertyPhoto.deleteMany();
  await prisma.property.deleteMany();
  await prisma.servicePhoto.deleteMany();
  await prisma.serviceProvider.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.job.deleteMany();
  await prisma.news.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash("123456", 10);

  console.log("👤 Usuarios…");
  const admin = await prisma.user.create({
    data: { name: "Administrador CundiMarket", email: "admin@cundimarket.co", passwordHash: hash, role: "ADMIN" },
  });
  const merchant = await prisma.user.create({
    data: { name: "Pedro Comerciante", email: "comerciante@cundimarket.co", phone: "3120000000", passwordHash: hash, role: "MERCHANT" },
  });
  const citizen = await prisma.user.create({
    data: { name: "Laura Ciudadana", email: "ciudadano@cundimarket.co", phone: "3110000000", passwordHash: hash, role: "CITIZEN" },
  });

  console.log("📂 Categorías…");
  const catMap: Record<string, { id: string; subs: { id: string; name: string }[] }> = {};
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    const cat = await prisma.category.create({
      data: { name: c.name, slug: c.slug, icon: c.icon, order: i },
    });
    const subs = [];
    for (const s of c.subcategories) {
      const sub = await prisma.subcategory.create({
        data: { name: s, slug: s.toLowerCase().replace(/\s+/g, "-"), categoryId: cat.id },
      });
      subs.push({ id: sub.id, name: sub.name });
    }
    catMap[c.slug] = { id: cat.id, subs };
  }

  console.log("🏪 Comercios…");
  const businesses = [
    { name: "Hamburguesas Mosquera", cat: "gastronomia", sub: "Comida rápida", desc: "Las mejores hamburguesas artesanales del municipio. Ingredientes frescos y carne 100% de res.", schedule: "Lun-Dom 11:00am - 10:00pm", rating: 4.6, featured: true, promos: [{ title: "2x1 en hamburguesas clásicas", discount: 50 }], products: [{ name: "Hamburguesa clásica", price: 15000 }, { name: "Hamburguesa doble", price: 22000 }, { name: "Papas a la francesa", price: 8000 }] },
    { name: "Pizza Italia", cat: "gastronomia", sub: "Restaurantes", desc: "Auténtica pizza al horno de leña, recetas tradicionales italianas.", schedule: "Mar-Dom 12:00pm - 11:00pm", rating: 4.7, featured: true, promos: [{ title: "Pizza familiar + gaseosa 1.5L", discount: 20 }], products: [{ name: "Pizza Margarita", price: 28000 }, { name: "Pizza Pepperoni", price: 32000 }] },
    { name: "Droguería La Salud", cat: "salud", sub: "Droguerías", desc: "Medicamentos, productos de aseo personal y servicio de toma de presión gratuita.", schedule: "Lun-Dom 7:00am - 9:00pm", rating: 4.4, featured: true, products: [] },
    { name: "TecnoCell Mosquera", cat: "tecnologia", sub: "Tiendas de celulares", desc: "Venta de celulares, accesorios y reparación de equipos con garantía.", schedule: "Lun-Sáb 9:00am - 7:00pm", rating: 4.3, promos: [{ title: "20% en accesorios", discount: 20 }], products: [{ name: "Vidrio templado", price: 12000 }, { name: "Forro silicona", price: 18000 }] },
    { name: "Ferretería El Tornillo", cat: "hogar", sub: "Ferreterías", desc: "Todo para construcción, herramientas y materiales eléctricos.", schedule: "Lun-Sáb 7:00am - 6:00pm", rating: 4.2, products: [] },
    { name: "Supermercado La Economía", cat: "comercio-general", sub: "Supermercados", desc: "Mercado completo a los mejores precios. Domicilios sin costo.", schedule: "Lun-Dom 7:00am - 9:00pm", rating: 4.5, featured: true, promos: [{ title: "Martes de frutas y verduras 15% off", discount: 15 }], products: [] },
    { name: "Boutique Estilo", cat: "moda", sub: "Ropa", desc: "Moda femenina y masculina, últimas tendencias.", schedule: "Lun-Sáb 10:00am - 8:00pm", rating: 4.1, products: [] },
    { name: "Taller AutoMaster", cat: "automotriz", sub: "Talleres mecánicos", desc: "Mecánica general, alineación, balanceo y cambio de aceite.", schedule: "Lun-Sáb 8:00am - 6:00pm", rating: 4.4, products: [{ name: "Cambio de aceite", price: 60000 }] },
    { name: "Café del Parque", cat: "gastronomia", sub: "Cafeterías", desc: "Café de origen, postres caseros y desayunos.", schedule: "Lun-Dom 7:00am - 8:00pm", rating: 4.8, featured: true, promos: [{ title: "Combo desayuno", discount: 10 }], products: [{ name: "Capuchino", price: 6000 }, { name: "Torta de zanahoria", price: 9000 }] },
    { name: "Veterinaria Patitas", cat: "mascotas", sub: "Veterinarias", desc: "Consulta, vacunación, peluquería canina y venta de alimento.", schedule: "Lun-Sáb 8:00am - 7:00pm", rating: 4.6, products: [] },
    { name: "Academia Saber", cat: "educacion", sub: "Academias", desc: "Refuerzo escolar, preicfes y cursos de inglés.", schedule: "Lun-Vie 2:00pm - 8:00pm", rating: 4.3, products: [] },
    { name: "Gimnasio FitZone", cat: "salud", sub: "Gimnasios", desc: "Máquinas de última generación, clases grupales y entrenadores certificados.", schedule: "Lun-Sáb 5:00am - 10:00pm", rating: 4.5, promos: [{ title: "Matrícula gratis primer mes", discount: 100 }], products: [] },
  ];

  let bi = 0;
  for (const b of businesses) {
    bi++;
    const cm = catMap[b.cat];
    const sub = cm.subs.find((s) => s.name === b.sub);
    const created = await prisma.business.create({
      data: {
        ownerId: merchant.id,
        name: b.name,
        categoryId: cm.id,
        subcategoryId: sub?.id,
        description: b.desc,
        address: `Calle ${10 + bi} # ${bi}-${20 + bi}`,
        neighborhood: pick(NEIGHBORHOODS_MOSQUERA, bi),
        municipality: "Mosquera",
        phone: `60145${(1000000 + bi).toString().slice(-7)}`,
        whatsapp: `31${(20000000 + bi * 111111).toString().slice(-8)}`,
        schedule: b.schedule,
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        logoUrl: img(`logo-${bi}`, 200, 200),
        status: "VERIFIED",
        featured: !!b.featured,
        ratingAvg: b.rating,
        ratingCount: 0,
        views: Math.floor(Math.random() * 400),
        photos: { create: [{ url: img(`biz-${bi}-a`), type: "FACADE" }, { url: img(`biz-${bi}-b`), type: "INTERIOR" }] },
        products: { create: (b.products || []).map((p) => ({ name: p.name, price: p.price })) },
        promotions: { create: (b.promos || []).map((p) => ({ title: p.title, discount: p.discount, active: true })) },
      },
    });

    // calificaciones
    const ratings = [
      { stars: Math.round(b.rating), comment: "Muy buen servicio, recomendado." },
      { stars: Math.min(5, Math.round(b.rating) ), comment: "Excelente atención." },
    ];
    for (const r of ratings) {
      await prisma.rating.create({ data: { businessId: created.id, userId: citizen.id, stars: r.stars, comment: r.comment } });
    }
    const agg = await prisma.rating.aggregate({ where: { businessId: created.id }, _avg: { stars: true }, _count: true });
    await prisma.business.update({ where: { id: created.id }, data: { ratingAvg: agg._avg.stars || 0, ratingCount: agg._count } });
  }

  // Comercio pendiente de verificación (para el panel admin)
  await prisma.business.create({
    data: {
      ownerId: merchant.id,
      name: "Panadería El Trigal",
      categoryId: catMap["gastronomia"].id,
      subcategoryId: catMap["gastronomia"].subs.find((s) => s.name === "Panaderías")?.id,
      description: "Pan fresco todos los días, tortas por encargo.",
      address: "Carrera 3 # 5-15",
      neighborhood: "Centro",
      municipality: "Mosquera",
      phone: "6014599999",
      whatsapp: "3155557788",
      schedule: "Lun-Dom 5:00am - 8:00pm",
      logoUrl: img("logo-pan", 200, 200),
      status: "IN_REVIEW",
      photos: { create: [{ url: img("pan-a"), type: "FACADE" }, { url: img("pan-b"), type: "SIGN" }] },
    },
  });

  console.log("📰 Noticias…");
  const news = [
    { title: "Festival Gastronómico de Mosquera 2026", type: "EVENT", body: "El próximo 12 de junio se realizará el Festival Gastronómico en el parque principal. Más de 40 comercios locales participarán con sus mejores platos. ¡Te esperamos!" },
    { title: "Corte programado de agua en el sector Centro", type: "ALERT", body: "La empresa de acueducto informa que el día jueves se realizará un mantenimiento. El servicio se suspenderá de 8:00am a 4:00pm en los barrios Centro y El Recreo." },
    { title: "Jornada de vacunación gratuita para mascotas", type: "BULLETIN", body: "La Alcaldía invita a la jornada de vacunación antirrábica gratuita este sábado en la plaza de mercado, de 8:00am a 1:00pm." },
    { title: "Cierre vial temporal por obras en la Av. Principal", type: "ALERT", body: "Por trabajos de repavimentación, la Av. Principal tendrá cierres parciales durante la próxima semana. Use rutas alternas." },
    { title: "Programa de apoyo a emprendedores locales", type: "OFFICIAL", body: "Comunicado oficial: se abren inscripciones para el programa de fortalecimiento de comercios locales. Capacitación y capital semilla disponibles." },
  ];
  for (const n of news) {
    await prisma.news.create({ data: { ...n, authorId: admin.id, imageUrl: img(`news-${n.title.length}`) } });
  }

  console.log("🚨 Canales de atención…");
  const contacts = [
    { name: "Policía Nacional", phone: "123", icon: "🚓" },
    { name: "Bomberos Mosquera", phone: "6018279999", icon: "🚒" },
    { name: "Ambulancia / Emergencias médicas", phone: "125", icon: "🚑" },
    { name: "Hospital María Auxiliadora", phone: "6018270000", icon: "🏥" },
    { name: "Defensa Civil", phone: "144", icon: "🛟" },
    { name: "Tránsito Municipal", phone: "6018271111", icon: "🚦" },
  ];
  for (let i = 0; i < contacts.length; i++) {
    await prisma.emergencyContact.create({ data: { ...contacts[i], order: i } });
  }

  console.log("🏠 CundiEspacios…");
  const props = [
    { offerType: "RENT", propertyType: "Apartamento", price: 900000, rooms: 3, bathrooms: 2, parking: true, area: 80, neighborhood: "Centro", desc: "Apartamento amplio cerca al parque principal, excelente iluminación." },
    { offerType: "SALE", propertyType: "Casa", price: 320000000, rooms: 4, bathrooms: 3, parking: true, area: 150, neighborhood: "El Recreo", desc: "Casa de dos pisos con patio, lista para habitar." },
    { offerType: "RENT", propertyType: "Local comercial", price: 1500000, rooms: 0, bathrooms: 1, parking: false, area: 45, neighborhood: "Centro", desc: "Local sobre vía principal, ideal para restaurante o tienda." },
    { offerType: "RENT", propertyType: "Habitación", price: 450000, rooms: 1, bathrooms: 1, parking: false, area: 18, neighborhood: "Porvenir", desc: "Habitación independiente con baño privado, servicios incluidos." },
    { offerType: "SALE", propertyType: "Lote", price: 180000000, rooms: 0, bathrooms: 0, parking: false, area: 200, neighborhood: "Serrezuela", desc: "Lote urbanizable con servicios disponibles." },
  ];
  for (let i = 0; i < props.length; i++) {
    const p = props[i];
    await prisma.property.create({
      data: {
        userId: citizen.id,
        offerType: p.offerType,
        propertyType: p.propertyType,
        municipality: "Mosquera",
        neighborhood: p.neighborhood,
        address: `Calle ${20 + i}`,
        area: p.area,
        rooms: p.rooms || null,
        bathrooms: p.bathrooms || null,
        parking: p.parking,
        stratum: 3,
        price: p.price,
        description: p.desc,
        services: "Agua, luz, gas, internet",
        ownerName: "María Rodríguez",
        phone: "6014588888",
        whatsapp: `31${(30000000 + i * 222222).toString().slice(-8)}`,
        verified: i < 3,
        status: "ACTIVE",
        photos: { create: [{ url: img(`prop-${i}-a`) }, { url: img(`prop-${i}-b`) }, { url: img(`prop-${i}-c`) }] },
      },
    });
  }

  console.log("🛠️ CundiServicios…");
  const providers = [
    { name: "Carlos Gómez", cat: "hogar", type: "Plomería", zone: "Mosquera y alrededores", desc: "Reparación de fugas, instalación de sanitarios, destape de tuberías. Más de 10 años de experiencia.", years: 10, rating: 4.8 },
    { name: "Laura Pérez", cat: "hogar", type: "Electricidad", zone: "Mosquera centro", desc: "Instalaciones eléctricas residenciales y comerciales, mantenimiento.", years: 6, rating: 4.6 },
    { name: "Andrés Ruiz", cat: "tecnico", type: "Reparación de computadores", zone: "Mosquera y Funza", desc: "Mantenimiento, formateo, recuperación de datos y venta de repuestos.", years: 8, rating: 4.7 },
    { name: "Diana Torres", cat: "personal", type: "Peluquería a domicilio", zone: "Todo Mosquera", desc: "Cortes, peinados, manicure y pedicure a domicilio.", years: 5, rating: 4.9 },
    { name: "Jorge Martínez", cat: "profesional", type: "Contabilidad", zone: "Mosquera", desc: "Asesoría contable y tributaria para personas y pequeñas empresas.", years: 12, rating: 4.5 },
  ];
  for (let i = 0; i < providers.length; i++) {
    const p = providers[i];
    const sp = await prisma.serviceProvider.create({
      data: {
        userId: citizen.id,
        providerName: p.name,
        category: p.cat,
        serviceType: p.type,
        municipality: "Mosquera",
        coverageZone: p.zone,
        description: p.desc,
        yearsExperience: p.years,
        phone: "6014577777",
        whatsapp: `31${(40000000 + i * 333333).toString().slice(-8)}`,
        photoUrl: img(`prov-${i}`, 200, 200),
        verified: i < 4,
        ratingAvg: p.rating,
        ratingCount: 1,
      },
    });
    await prisma.rating.create({ data: { providerId: sp.id, userId: citizen.id, stars: Math.round(p.rating), comment: "Muy profesional y puntual." } });
  }

  console.log("💼 CundiEmpleo…");
  const jobs = [
    { title: "Auxiliar de cocina", company: "Restaurante Don Pedro", sector: "Gastronomía", salary: 1300000, contract: "Tiempo completo", functions: "Preparación de alimentos, apoyo en cocina, limpieza del área.", req: "Experiencia mínima 6 meses, disponibilidad inmediata." },
    { title: "Cajero(a) de supermercado", company: "Supermercado La Economía", sector: "Comercio", salary: 1200000, contract: "Tiempo completo", functions: "Atención al cliente, manejo de caja, organización de productos.", req: "Bachiller, experiencia en caja deseable." },
    { title: "Domiciliario en moto", company: "Pizza Italia", sector: "Logística", salary: 1400000, contract: "Tiempo completo", functions: "Entrega de pedidos a domicilio en el municipio.", req: "Moto propia, licencia vigente, documentos al día." },
    { title: "Vendedor(a) de mostrador", company: "Ferretería El Tornillo", sector: "Comercio", salary: 1250000, contract: "Medio tiempo", functions: "Asesoría y venta de productos de ferretería.", req: "Conocimiento básico en herramientas." },
    { title: "Auxiliar administrativo", company: "Academia Saber", sector: "Servicios", salary: 1500000, contract: "Tiempo completo", functions: "Manejo de agenda, atención telefónica, archivo.", req: "Técnico o tecnólogo, manejo de Office." },
  ];
  for (const j of jobs) {
    await prisma.job.create({
      data: {
        userId: merchant.id,
        companyName: j.company,
        sector: j.sector,
        title: j.title,
        contractType: j.contract,
        workday: "Diurna",
        salary: j.salary,
        functions: j.functions,
        requirements: j.req,
        experience: "6 meses a 1 año",
        municipality: "Mosquera",
        address: "Centro",
        phone: "6014566666",
        email: "rrhh@empresa.co",
        whatsapp: "3166665544",
      },
    });
  }

  console.log("✅ Seed completado.");
  console.log("   Admin:       admin@cundimarket.co / 123456");
  console.log("   Comerciante: comerciante@cundimarket.co / 123456");
  console.log("   Ciudadano:   ciudadano@cundimarket.co / 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
