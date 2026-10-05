import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "cloudflare:workers";

import { db } from "@/db";
import * as schema from "@/db/auth-schema";

export const auth = betterAuth({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  advanced: { database: { joins: true } },
  plugins: [tanstackStartCookies()],
});
