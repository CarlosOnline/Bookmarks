import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(path.dirname(import.meta.url));
console.log("paths", __dirname, import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/support": path.resolve(__dirname, "./src/support"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
  plugins: [vue()],
});
