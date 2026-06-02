// Taxonomía de CundiMarket — fuente única para seed y formularios.

export type CategorySeed = {
  name: string;
  slug: string;
  icon: string;
  subcategories: string[];
};

export const CATEGORIES: CategorySeed[] = [
  {
    name: "Gastronomía",
    slug: "gastronomia",
    icon: "🍽️",
    subcategories: [
      "Restaurantes",
      "Comida rápida",
      "Cafeterías",
      "Panaderías",
      "Postres",
      "Comida típica",
      "Comida internacional",
      "Heladerías",
    ],
  },
  {
    name: "Moda y Vestuario",
    slug: "moda",
    icon: "👕",
    subcategories: ["Ropa", "Zapaterías", "Accesorios", "Ropa deportiva", "Moda infantil"],
  },
  {
    name: "Salud y Bienestar",
    slug: "salud",
    icon: "💊",
    subcategories: ["Droguerías", "Ópticas", "Consultorios", "Gimnasios", "Spa", "Veterinarias"],
  },
  {
    name: "Automotriz",
    slug: "automotriz",
    icon: "🚗",
    subcategories: [
      "Talleres mecánicos",
      "Lavaderos",
      "Repuestos",
      "Diagnóstico automotriz",
      "Venta de vehículos",
      "Lubricentros",
    ],
  },
  {
    name: "Hogar y Construcción",
    slug: "hogar",
    icon: "🏠",
    subcategories: [
      "Ferreterías",
      "Materiales de construcción",
      "Muebles",
      "Decoración",
      "Electrodomésticos",
    ],
  },
  {
    name: "Tecnología",
    slug: "tecnologia",
    icon: "📱",
    subcategories: [
      "Tiendas de celulares",
      "Reparación de equipos",
      "Computadores",
      "Accesorios tecnológicos",
    ],
  },
  {
    name: "Comercio General",
    slug: "comercio-general",
    icon: "🛒",
    subcategories: ["Supermercados", "Tiendas de barrio", "Minimercados", "Papelerías"],
  },
  {
    name: "Educación",
    slug: "educacion",
    icon: "🎓",
    subcategories: ["Institutos", "Academias", "Centros de formación"],
  },
  {
    name: "Entretenimiento",
    slug: "entretenimiento",
    icon: "🎉",
    subcategories: ["Salones de eventos", "Discotecas", "Bares", "Recreación"],
  },
  {
    name: "Mascotas",
    slug: "mascotas",
    icon: "🐾",
    subcategories: ["Veterinarias", "Tiendas de mascotas", "Guarderías"],
  },
];

export const MUNICIPALITIES = [
  "Mosquera",
  "Funza",
  "Madrid",
  "Soacha",
  "Facatativá",
  "Zipaquirá",
  "Chía",
  "Cota",
  "Girardot",
  "Fusagasugá",
];

export const NEIGHBORHOODS_MOSQUERA = [
  "Centro",
  "El Recreo",
  "Porvenir",
  "Serrezuela",
  "Planadas",
  "La Estancia",
  "Rubí",
  "Diana Turbay",
];

// CundiServicios
export const SERVICE_CATEGORIES = [
  {
    key: "hogar",
    name: "Servicios para el hogar",
    icon: "🔧",
    types: ["Plomería", "Electricidad", "Cerrajería", "Pintura", "Reparaciones generales"],
  },
  {
    key: "tecnico",
    name: "Servicios técnicos",
    icon: "💻",
    types: [
      "Reparación de electrodomésticos",
      "Reparación de celulares",
      "Reparación de computadores",
      "Instalación de cámaras de seguridad",
    ],
  },
  {
    key: "profesional",
    name: "Servicios profesionales",
    icon: "📊",
    types: ["Contabilidad", "Asesoría jurídica", "Diseño gráfico", "Marketing digital"],
  },
  {
    key: "personal",
    name: "Servicios personales",
    icon: "💇",
    types: ["Peluquería a domicilio", "Maquillaje", "Entrenadores personales", "Cuidado de mascotas"],
  },
];

// CundiEspacios
export const OFFER_TYPES = [
  { key: "RENT", label: "Arriendo" },
  { key: "SALE", label: "Venta" },
  { key: "SWAP", label: "Permuta" },
];

export const PROPERTY_TYPES = [
  "Casa",
  "Apartamento",
  "Habitación",
  "Local comercial",
  "Oficina",
  "Lote",
];

export const PROPERTY_STATUS = [
  { key: "ACTIVE", label: "Activo" },
  { key: "RESERVED", label: "Reservado" },
  { key: "CLOSED", label: "Vendido / Arrendado" },
];

// CundiEmpleo
export const JOB_SECTORS = [
  "Comercio",
  "Gastronomía",
  "Servicios",
  "Construcción",
  "Tecnología",
  "Logística",
  "Atención al cliente",
];

export const CONTRACT_TYPES = [
  "Tiempo completo",
  "Medio tiempo",
  "Temporal",
  "Prestación de servicios",
  "Por días",
];

// Estados de verificación de comercio
export const BUSINESS_STATUS: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  PENDING: { label: "Registro pendiente", color: "ink-soft", icon: "⏳" },
  IN_REVIEW: { label: "En verificación", color: "warn", icon: "🔍" },
  VERIFIED: { label: "Comercio verificado", color: "success", icon: "✔" },
  REJECTED: { label: "Registro rechazado", color: "danger", icon: "✕" },
  SUSPENDED: { label: "Comercio suspendido", color: "danger", icon: "⛔" },
};

export const NEWS_TYPES: Record<string, { label: string; icon: string }> = {
  NEWS: { label: "Noticia", icon: "📰" },
  BULLETIN: { label: "Boletín", icon: "📋" },
  OFFICIAL: { label: "Comunicado oficial", icon: "🏛️" },
  ALERT: { label: "Alerta", icon: "🚨" },
  EVENT: { label: "Evento", icon: "🎉" },
};
