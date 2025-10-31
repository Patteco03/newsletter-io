import dotenv from "dotenv";
import type { PrismaConfig } from "prisma";

dotenv.config({ path: "../../apps/server/.env" });

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
} satisfies PrismaConfig;
