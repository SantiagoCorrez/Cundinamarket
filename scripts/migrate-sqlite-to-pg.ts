import { PrismaClient } from "../lib/generated/prisma";
import { PrismaClient as SqliteClient } from "@prisma/client";
import "dotenv/config";

const pg = new PrismaClient();
const sqlite = new SqliteClient({
  datasources: { db: { url: "file:./dev.db" } },
});

const TABLES_IN_ORDER = [
  "User",
  "Category",
  "Subcategory",
  "Business",
  "BusinessPhoto",
  "Promotion",
  "Product",
  "Rating",
  "Report",
  "News",
  "EmergencyContact",
  "Property",
  "PropertyPhoto",
  "ServiceProvider",
  "ServicePhoto",
  "Job",
  "SavedJob",
  "CandidateProfile",
  "Favorite",
];

async function truncateAll() {
  console.log("🧹 Truncando tablas en PostgreSQL (orden inverso)...");
  for (const table of [...TABLES_IN_ORDER].reverse()) {
    await pg.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
  }
}

async function migrateTable(table: string) {
  const rows = await (sqlite as any)[table.toLowerCase()].findMany();
  if (!rows.length) {
    console.log(`  ⏭️  ${table}: 0 filas (vacía)`);
    return;
  }

  const createMany = (pg as any)[table.toLowerCase()].createMany;
  if (createMany) {
    await createMany({ data: rows, skipDuplicates: true });
  } else {
    for (const row of rows) {
      await (pg as any)[table.toLowerCase()].create({ data: row });
    }
  }
  console.log(`  ✅ ${table}: ${rows.length} filas migradas`);
}

async function main() {
  console.log("🚀 Iniciando migración SQLite → PostgreSQL (Option A: delete + insert)");
  await pg.$connect();
  await sqlite.$connect();

  await truncateAll();

  console.log("\n📥 Migrando datos (orden FK)...");
  for (const table of TABLES_IN_ORDER) {
    await migrateTable(table);
  }

  console.log("\n✅ Migración completada.");
  await pg.$disconnect();
  await sqlite.$disconnect();
}

main().catch(async (e) => {
  console.error("❌ Error:", e);
  await pg.$disconnect();
  await sqlite.$disconnect();
  process.exit(1);
});