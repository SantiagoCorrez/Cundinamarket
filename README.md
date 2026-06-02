# CundiMarket 🏪

Marketplace local de Cundinamarca — **piloto Mosquera**. Conecta comercios, inmuebles, servicios, empleo y noticias del municipio en una sola plataforma móvil (PWA) con panel administrativo web.

Diseño inspirado en el estilo visual de inDrive (lima vibrante + negro, tarjetas redondeadas, mobile-first).

## Stack

- **Next.js 16** (App Router, Server Actions, Turbopack) + **React 19**
- **TypeScript** + **Tailwind CSS v4**
- **Prisma 6** + **SQLite** (migrable a PostgreSQL en producción)
- Autenticación propia con **JWT** (jose) en cookie httpOnly + **bcrypt**
- Iconos **lucide-react**, PWA con manifest

## Puesta en marcha

```bash
npm install
npx prisma migrate dev      # crea la base de datos (dev.db)
npm run db:seed             # carga datos de ejemplo (Mosquera)
npm run dev                 # http://localhost:3000
```

> Si agregas rutas con el servidor corriendo y ves 404 inesperados, reinicia `npm run dev` (Turbopack reconstruye el árbol de rutas).

## Usuarios de prueba (contraseña: `123456`)

| Rol           | Correo                       |
|---------------|------------------------------|
| Administrador | `admin@cundimarket.co`       |
| Comerciante   | `comerciante@cundimarket.co` |
| Ciudadano     | `ciudadano@cundimarket.co`   |

## Funcionalidades implementadas

**App ciudadana (móvil/PWA)**
- Splash, onboarding, registro/login (ciudadano y comerciante), perfil.
- Home: buscador, categorías, módulos, comercios destacados, promociones, noticias.
- Búsqueda con filtros (categoría, mejor calificados, promociones, verificados, nuevos).
- Ficha de comercio: galería, horario, descripción, promociones, menú/catálogo,
  calificaciones, favoritos, contacto por **llamada** y **WhatsApp**, reporte ciudadano.
- Noticias municipales (noticia, alerta, comunicado, evento), detalle.
- Canales de atención municipal con llamada directa.
- Asistente **CundiBot** (búsqueda guiada por intención sobre la base real).
- Favoritos del usuario.

**Comerciante**
- Registro de negocio con **evidencias** para verificación (fachada, aviso, interior).
- Estados: pendiente → en verificación → verificado / rechazado / suspendido.
- Gestión: editar info, publicar promociones, administrar menú/catálogo, sello verificado.

**Módulos**
- 🏠 **CundiEspacios** — inmuebles (arriendo/venta/permuta): listado, filtros, detalle, publicar.
- 🛠️ **CundiServicios** — prestadores: categorías, perfil, calificación, publicar.
- 💼 **CundiEmpleo** — vacantes: filtros, detalle, postulación, guardados, perfil del candidato.

**Panel administrativo web** (`/admin`, solo ADMIN)
- Dashboard de analítica (comercios, usuarios, módulos, categorías top, más visitados, municipios).
- Verificación de comercios: aprobar, rechazar (con motivo), suspender, destacar.
- Gestión de noticias, categorías, reportes ciudadanos y canales de atención.

## Notas de seguridad y datos

- Contraseñas con hash bcrypt; sesión JWT en cookie httpOnly; control de acceso por rol.
- Las imágenes se suben comprimidas como data URL (suficiente para el piloto;
  en producción conviene un almacenamiento de objetos como S3/Cloudinary).
- Tratamiento de datos conforme a la **Ley 1581 de 2012** (texto en el registro).

## Próximos pasos sugeridos

- Migrar a PostgreSQL + almacenamiento de imágenes en la nube.
- Integración real de Google Maps (ubicación/rutas/alertas de tráfico) y Firebase Cloud Messaging (push).
- App nativa con React Native/Expo reutilizando la API.
- Búsqueda full-text e insensible a mayúsculas (Postgres / Meilisearch).
