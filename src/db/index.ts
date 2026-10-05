import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

import { authRelations } from "./auth-schema";
import relations from "./schema";

export const db = drizzle(env.DB, {
  relations: { ...relations, ...authRelations },
});
