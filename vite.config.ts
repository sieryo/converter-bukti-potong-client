import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { relative, resolve } from "node:path";
import { readdirSync, writeFileSync } from "fs";
import { join } from "path";


function distManifestPlugin() {
  return {
    name: "dist-manifest",
    closeBundle() {
      const distDir = "dist";
      const files: string[] = [];

      const walk = (dir: string) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const fullPath = join(dir, entry.name);

          if (entry.isDirectory()) {
            walk(fullPath);
          } else {
            const rel = relative(distDir, fullPath)
              .replace(/\\/g, "/"); // windows-safe

            files.push(rel);
          }
        }
      };

      walk(distDir);

      writeFileSync(
        join(distDir, "dist-manifest.json"),
        JSON.stringify(
          {
            version: Date.now(),
            files,
          },
          null,
          2
        )
      );
    },
  };
}


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    distManifestPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})


