import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

const __filename = import.meta.url;
const __dirname = path.dirname(__filename);
const rootFolderPath = __dirname.replace("file:///", "");
console.log("paths", __filename, __dirname, rootFolderPath);

/**
 * Resolve path for windows, strip off funky stuff for windows.
 * Like file:///e:/Projects/Bookmarks/file:
 */
function resolvePath(alias: string, rootFolder: string, folder: string) {
  const result = path.resolve(rootFolderPath, folder);
  console.log(alias, folder, result);
  return result;
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolvePath("@", __dirname, "./src"),
      "@/services": resolvePath("@/services", __dirname, "./src/services"),
      "@/support": resolvePath("@/support", __dirname, "./src/support"),
      "@/components": resolvePath(
        "@/components",
        __dirname,
        "./src/components"
      ),
      "@/assets": resolvePath("@assets", __dirname, "./src/assets"),
      "@assets": resolvePath("@assets", __dirname, "./src/assets"),
    },
  },
  plugins: [vue(), tsconfigPaths()],
});
