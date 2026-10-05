import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

const ignorePatterns = ["src/routeTree.gen.ts", "src/db/auth-schema.ts"];

export default defineConfig({
  plugins: [
    tanstackStart({ router: { tmpDir: "node_modules/.tanstack" } }),
    react({ compiler: true }),
    tailwindcss(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
  ],
  resolve: { tsconfigPaths: true },
  lint: {
    ignorePatterns,
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    ignorePatterns,
    sortImports: true,
    sortPackageJson: true,
    sortTailwindcss: true,
  },
});
