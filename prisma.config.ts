import { defineConfig } from "prisma/config";

try {
  process.loadEnvFile();
} catch {
  // no .env file present; rely on process env vars
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/docquery",
  },
});
