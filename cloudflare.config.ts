import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "sapiens",
    compatibilityDate: "2026-10-01",
    entrypoint: "src/server.ts",
    observability: {
      enabled: true,
      logs: { enabled: true },
      traces: { enabled: true },
      issues: { enabled: true },
    },
    env: {
      DB: bindings.d1({
        name: "sapiens-db",
        id: "379a6408-bddc-4d8b-a3bd-b15f530eeedd",
        dev: { remote: false },
      }),
      BETTER_AUTH_SECRET: bindings.secret(),
    },
  },
});
