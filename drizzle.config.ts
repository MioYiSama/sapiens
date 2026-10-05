import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/db/schema.ts", "./src/db/auth-schema.ts"],
  dialect: "sqlite",
  dbCredentials: {
    url: ".cloudflare/state/v3/d1/miniflare-D1DatabaseObject/94601e4d0eb75248132adb770a7c1d513b16da9afc2a052d6ec976e96344b434.sqlite",
  },
});
