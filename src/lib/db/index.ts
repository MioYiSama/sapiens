import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import { authRelations } from "./auth-schema";
import relations from "./schema";

export const db = await (async () => {
  const db = drizzle(process.env.DATABASE_URL!, {
    jit: true,
    relations: { ...authRelations, ...relations },
  });

  await migrate(db, { migrationsFolder: "drizzle" });

  return db;
})();
