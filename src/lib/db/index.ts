import { drizzle } from "drizzle-orm/node-postgres";

import { authRelations } from "./auth-schema";
import relations from "./schema";

export const db = drizzle(process.env.DATABASE_URL!, {
  relations: { ...relations, ...authRelations },
});
