import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "sapiens",
    compatibilityDate: "2026-10-01",
    observability: {
      enabled: true,
    },
    entrypoint: "@tanstack/react-start/server-entry",
  },
});
