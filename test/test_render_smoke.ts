import { test } from "node:test";
import assert from "node:assert";
import { preview } from "vite";
import { chromium, type Page } from "playwright";
import type { ExpressAgentInfo } from "@receptron/graphai_express_type";
import { assertDistBuilt, distDir, repoRoot } from "./dist_assets.ts";

const previewPort = 4173;
const editorInitTimeout_ms = 15000;
const agentServerUrl = "http://localhost:8085/agents";

const echoAgentInfo: ExpressAgentInfo = {
  agentId: "echoAgent",
  name: "echoAgent",
  url: `${agentServerUrl}/echoAgent`,
  description: "Echo agent",
  category: ["test"],
  author: "Receptron team",
  license: "MIT",
  repository: "https://github.com/receptron/graphai",
  samples: [],
  inputs: undefined,
  output: undefined,
  stream: false,
};

const collectPageProblems = (page: Page): string[] => {
  const pageProblems: string[] = [];
  page.on("pageerror", (error) => pageProblems.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") {
      pageProblems.push(`console.error: ${message.text()}`);
    }
  });
  page.on("dialog", async (dialog) => {
    pageProblems.push(`dialog: ${dialog.message()}`);
    await dialog.dismiss();
  });
  return pageProblems;
};

const stubExternalRequests = async (page: Page): Promise<void> => {
  // The app only renders the editor once the agent server answers, so the server is stubbed with one agent.
  await page.route(agentServerUrl, (route) => route.fulfill({ json: { agents: [echoAgentInfo] }, headers: { "access-control-allow-origin": "*" } }));
  await page.route("https://fonts.googleapis.com/**", (route) => route.fulfill({ contentType: "text/css", body: "" }));
};

const waitForEditorCanvas = async (page: Page): Promise<boolean> => {
  try {
    // LGraphCanvas attaches itself to the <canvas> element as `data` once the editor is set up.
    await page.waitForFunction(() => Reflect.get(document.getElementById("mycanvas") ?? {}, "data") !== undefined, undefined, {
      timeout: editorInitTimeout_ms,
    });
    return true;
  } catch {
    return false;
  }
};

const assertAppRendersEditor = async (page: Page): Promise<void> => {
  const pageProblems = collectPageProblems(page);
  await stubExternalRequests(page);
  await page.goto(`http://localhost:${previewPort}/`);
  const editorInitialized = await waitForEditorCanvas(page);
  const appRootChildCount = await page.locator("#app > *").count();

  assert.deepStrictEqual(pageProblems, [], "the page reported errors");
  assert.ok(appRootChildCount > 0, "#app is empty (white screen)");
  assert.ok(editorInitialized, "the LiteGraph editor canvas was never initialized");
};

test("built app renders and initializes the LiteGraph editor without errors", async () => {
  assertDistBuilt();
  const previewServer = await preview({ configFile: false, root: repoRoot, build: { outDir: distDir }, preview: { port: previewPort, strictPort: true } });
  try {
    const browser = await chromium.launch();
    try {
      await assertAppRendersEditor(await browser.newPage());
    } finally {
      await browser.close();
    }
  } finally {
    await previewServer.close();
  }
});
