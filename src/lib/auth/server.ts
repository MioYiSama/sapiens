import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { i18n, locales } from "@better-auth/i18n";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/auth-schema";

export const auth = betterAuth({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET!,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  advanced: { database: { joins: true } },
  plugins: [
    i18n({
      detection: ["header"],
      translations: {
        en: locales.en,
        zh: locales.zh,
      },
    }),
    tanstackStartCookies(),
  ],
  emailAndPassword: {
    enabled: true,
  },
});
