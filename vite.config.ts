import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

const __filename = import.meta.url;
const __dirname = path.dirname(__filename);
const rootFolderPath = __dirname.replace("file:///", "");
console.log("paths", __filename, __dirname, rootFolderPath);

const githubMode = __dirname == "file:///github/workspace";
if (githubMode) {
  console.log("**** github action ****");
}

/**
 * Resolve path for npm run dev on windows, strip off funky stuff for windows.
 * Like file:///e:/Projects/Bookmarks/file:
 */
function resolvePath(alias: string, folder: string) {
  if (githubMode) {
    return path.resolve(__dirname, folder);
  }

  const result = path.resolve(rootFolderPath, folder);
  console.log(alias, folder, result);
  return result;
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolvePath("@", "./src"),
      "@/services": resolvePath("@/services", "./src/services"),
      "@/support": resolvePath("@/support", "./src/support"),
      "@/components": resolvePath("@/components", "./src/components"),
      "@/assets": resolvePath("@assets", "./src/assets"),
      "@assets": resolvePath("@assets", "./src/assets"),
    },
  },
  plugins: [vue(), tsconfigPaths()],
});
