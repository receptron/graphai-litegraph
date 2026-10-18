import { test } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import path from "node:path";
import { listBundleJsFiles } from "./dist_assets.ts";

// Vite replaces a Node built-in imported from browser code with this stub instead of failing the build;
// the module then throws at evaluation time and the app never mounts.
const viteNodeBuiltinStubPattern = /__vite[-_]browser[-_]external/;

test("browser bundle does not pull in Node built-ins", () => {
  const bundleFiles = listBundleJsFiles();
  assert.ok(bundleFiles.length > 0, "dist/assets has no .js files");
  const offendingFiles = bundleFiles.filter((filePath) => viteNodeBuiltinStubPattern.test(readFileSync(filePath, "utf8")));
  assert.deepStrictEqual(
    offendingFiles.map((filePath) => path.basename(filePath)),
    [],
    "a Node-only module was bundled for the browser (look for require___vite_browser_external in the file)",
  );
});
