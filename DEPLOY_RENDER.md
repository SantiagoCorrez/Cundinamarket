# Despliegue en Render (Capa Gratuita)

## 📋 Prerrequisitos
- Cuenta en [Render](https://render.com)
- Repositorio en GitHub
- Base de datos SQLite local con datos (opcional, para migración)

---

## 🔧 Configuración Local (Una sola vez)

### 1. Variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales locales de PostgreSQL (opcional)
```

### 2. Generar cliente Prisma
```bash
npm install
npx prisma generate
```

### 3. (Opcional) Migración de datos SQLite → PostgreSQL local
```bash
# Requiere PostgreSQL local corriendo
npx tsx scripts/migrate-sqlite-to-pg.ts
```

### 4. Probar build local
```bash
npm run build
npm start
# Verificar en http://localhost:3000/api/health
```

---

## 🚀 Despliegue en Render (Blueprint)

### Opción A: Blueprint Automático (Recomendado)
1. Push a GitHub (rama `main`)
2. En Render Dashboard → **New +** → **Blueprint**
3. Conectar repositorio → **Apply**
4. Render crea automáticamente:
   - Base de datos PostgreSQL (free, 512MB)
   - Servicio Web (free, 512MB RAM)
5. Esperar build (~3-5 min)

### Opción B: Manual
1. **New → PostgreSQL** → Free → Name: `cundimarket-db`
2. **New → Web Service** → Connect repo
   - Build Command: `npm ci && npm run db:migrate && npm run build`
   - Start Command: `npm start`
   - Health Check: `/api/health`
   - Env Vars: `DATABASE_URL` (from database), `JWT_SECRET` (generate), `NODE_ENV=production`, `NEXT_TELEMETRY_DISABLED=1`

---

## 🌱 Post-Deploy: Poblar Base de Datos

En Render Shell (pestaña **Shell** del servicio web):
```bash
npm run db:seed
```

Credenciales de prueba creadas:
| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@cundimarket.co | 123456 |
| Merchant | comerciante@cundimarket.co | 123456 |
| Citizen | ciudadano@cundimarket.co | 123456 |

---

## ⚡ Keep-Alive (Evitar Cold Start 30s)

El plan gratuito duerme tras 15min inactividad.

**UptimeRobot (Gratis):**
1. Crear cuenta en uptimerobot.com
2. Add Monitor → HTTP(s)
3. URL: `https://TU-APP.onrender.com/api/health`
4. Intervalo: 5 minutos
5. Alert contacts: Email/Telegram

---

## 🔍 Verificación Post-Deploy

| Check | Comando/URL |
|-------|-------------|
| Health | `https://TU-APP.onrender.com/api/health` |
| Home | `https://TU-APP.onrender.com/` |
| Login | `https://TU-APP.onrender.com/login` |
| Admin | `https://TU-APP.onrender.com/admin` |

---

## 🛠️ Comandos Útiles en Render Shell

```bash
# Ver logs
# (Pestaña Logs en Dashboard)

# Migraciones manuales
npm run db:migrate

# Reset BD (cuidado: borra datos)
npm run db:reset

# Seed datos prueba
npm run db:seed

# Prisma Studio (temporal)
npx prisma studio
# Luego port-forward: render ssh -L 5555:localhost:5555
```

---

## 📊 Límites Plan Gratuito Render

| Recurso | Límite |
|---------|--------|
| RAM | 512 MB |
| CPU | Compartido |
| Build Time | 15 min |
| Sleep | 15 min inactividad |
| PostgreSQL | 512 MB / 1 GB transfer |
| Bandwidth | 100 GB/mes |

---

## 🐛 Troubleshooting

### Build falla por memoria
```yaml
# En render.yaml buildCommand:
NODE_OPTIONS="--max-old-space-size=4096" npm ci && npm run db:migrate && npm run build
```

### Migración falla
```bash
# En Render Shell:
npx prisma migrate status
npx prisma migrate resolve --applied "nombre_migracion"
```

### Health check 503
- Verificar `DATABASE_URL` inyectada correctamente
- Verificar que migraciones se ejecutaron en build
- Logs del servicio web

---

## 📝 Checklist Pre-Producción

- [ ] `JWT_SECRET` fuerte en producción (Render lo genera)
- [ ] Dominio personalizado configurado (opcional)
- [ ] HTTPS forzado (automático en Render)
- [ ] UptimeRobot configurado
- [ ] Backup estrategia (pg_dump programado)
- [ ] Monitoreo de errores (Sentry, opcional)

---

## 🔄 Actualizaciones Futuras

```bash
git push origin main
# Render auto-deploy si "Auto-Deploy" está ON en Settings
```

Para cambios de schema:
1. Local: `npx prisma migrate dev --name nombre_cambio`
2. Commit `prisma/migrations/`
3. Push → Render ejecuta `prisma migrate deploy` en build