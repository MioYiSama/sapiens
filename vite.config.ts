import { cloudflare } from "@cloudflare/vite-plugin";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

const ignorePatterns = [
  "drizzle",
  "src/routeTree.gen.ts",
  "src/components/ui",
  "src/db/auth-schema.ts",
  "src/paraglide",
];

export default defineConfig({
  plugins: [
    tanstackStart({ router: { tmpDir: "node_modules/.tanstack" } }),
    react({ compiler: true }),
    tailwindcss(),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide",
      emitTsDeclarations: true,
      strategy: ["preferredLanguage", "baseLocale"],
    }),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
  ],
  resolve: { tsconfigPaths: true },
  lint: {
    ignorePatterns,
    options: { typeAware: true, typeCheck: true },
    plugins: ["react", "react-perf"],
  },
  fmt: {
    ignorePatterns,
    sortImports: true,
    sortPackageJson: true,
    sortTailwindcss: true,
  },
});
