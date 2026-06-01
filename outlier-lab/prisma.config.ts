import { defineConfig } from "prisma/config";
import "dotenv/config";

function normalizeDatabaseUrl(connectionString: string | undefined) {
  if (!connectionString) {
    return connectionString;
  }

  const url = new URL(connectionString);

  if (url.searchParams.has("sslmode") && !url.searchParams.has("uselibpqcompat")) {
    url.searchParams.set("uselibpqcompat", "true");
  }

  return url.toString();
}

export default defineConfig({
  migrations: {
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    url: normalizeDatabaseUrl(process.env.DATABASE_URL),
  },
});