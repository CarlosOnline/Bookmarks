import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import fs from "fs";

const __filename = import.meta.url;
const __dirname = path.dirname(__filename);
const rootFolderPath = __dirname.replace("file:///", "");
console.log("paths", __filename, __dirname, rootFolderPath);

const githubMode = __dirname == "file:///github/workspace";
if (githubMode) {
  console.log(
    "**** github action ****",
    path.resolve(__dirname, "./src/services")
  );
}

function checkPath(filePath: string) {
  const found = fs.existsSync(filePath);
  console.log(found, filePath);
}

checkPath("file:///github/workspace/src/services/bookmarks/index.ts");
checkPath("/github/workspace/src/services/bookmarks/index.ts");
checkPath("file:/github/workspace/src/services/bookmarks/index.ts");

/**
 * Resolve path for npm run dev on windows, strip off funky stuff for windows.
 * Like file:///e:/Projects/Bookmarks/file:
 */
function resolvePath(alias: string, folder: string) {
  if (githubMode) {
    return "/github/workspace/" + folder.replace("./", "");
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
  plugins: [vue()],
});
