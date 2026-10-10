import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite-plus";

import pkg from "./package.json";

const ignorePatterns = [
  "drizzle",
  "src/routeTree.gen.ts",
  "src/components/ui",
  "src/lib/db/auth-schema.ts",
  "src/paraglide",
];

export default defineConfig({
  plugins: [
    tanstackStart({
      router: { tmpDir: "node_modules/.tanstack" },
    }),
    react({ compiler: true }),
    tailwindcss(),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide",
      emitTsDeclarations: true,
      strategy: ["preferredLanguage", "baseLocale"],
    }),
    nitro({
      preset: "node-server",
      output: { dir: "dist" },
      minify: true,
    }),
    svgr(),
  ],
  resolve: { tsconfigPaths: true },
  define: {
    __VERSION__: JSON.stringify(pkg.version),
    __REPOSITORY_URL__: JSON.stringify(pkg.repository.url),
  },
  build: {
    rolldownOptions: {
      onLog(level, log, handler) {
        // Suppress "use client" warning
        if (log.code === "MODULE_LEVEL_DIRECTIVE") return;
        return handler(level, log);
      },
    },
  },
  lint: {
    ignorePatterns,
    options: { typeAware: true, typeCheck: true },
    plugins: ["react", "react-perf"],
  },
  fmt: {
    ignorePatterns,
    sortImports: true,
    sortPackageJson: true,
    sortTailwindcss: { functions: ["cn"] },
  },
});
