import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const distDir = path.join(repoRoot, "dist");
const distAssetsDir = path.join(distDir, "assets");

export const assertDistBuilt = (): void => {
  if (!existsSync(distAssetsDir)) {
    throw new Error(`${distAssetsDir} not found: run \`yarn build\` before \`yarn test\``);
  }
};

export const listBundleJsFiles = (): string[] => {
  assertDistBuilt();
  return readdirSync(distAssetsDir)
    .filter((fileName) => fileName.endsWith(".js"))
    .map((fileName) => path.join(distAssetsDir, fileName));
};
