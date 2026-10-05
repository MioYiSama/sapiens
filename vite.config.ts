import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";
import { cloudflare } from "@cloudflare/vite-plugin";

const ignorePatterns = ["src/routeTree.gen.ts"];

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({ router: { tmpDir: "node_modules/.tanstack" } }),
    react({ compiler: true }),
    tailwindcss(),
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
