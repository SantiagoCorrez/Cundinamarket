import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", db: "connected", timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Health check failed:", error);
    return Response.json(
      { status: "error", db: "disconnected", timestamp: new Date().toISOString() },
      { status: 503 }
    );
  }
}