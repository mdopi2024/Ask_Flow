import { env } from "./config/env";
import prisma from "./config/prisma";
import app from "./app";
import { seedAdmin } from "./utils/adminSedding";

async function main(): Promise<void> {
  try {
    await prisma.$connect();
    if (env.isDev()) console.log("✅ Connected to PostgreSQL via Prisma");

    await seedAdmin();

    app.listen(env.PORT, () => {
      if (env.isDev()) {
        console.log(`🚀 Server running on http://localhost:${env.PORT}`);
        console.log(`   Environment : ${env.NODE_ENV}`);
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  if (env.isDev()) console.log("\n🛑 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

main();