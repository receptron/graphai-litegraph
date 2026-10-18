# fix: CI guard against the white-screen / editor-init regressions

Issue: #38 (regressions: #33 / #34, #36 / #37)

## Problem

`build.yml` only runs typecheck, lint and build. Both #33 (Node-only `@inquirer` bundled for the
browser) and #36 (`anyOf.map is not a function` during editor init) pass all three; they only fail
when the built app runs in a browser.

## Change

Two `node:test` files under `test/`, run by `yarn test` after `yarn build` in CI:

- `test_bundle_browser_safe.ts`: fails if `dist/assets/*.js` contains Vite's Node built-in stub
  (`__vite-browser-external`), which is what a Node-only import becomes in a browser build.
- `test_render_smoke.ts`: serves `dist/` with `vite preview`, opens it in headless Chromium
  (Playwright), stubs the agent server's `/agents` with one agent, and fails on any page error,
  `console.error` or `alert`, on an empty `#app`, or if the LiteGraph canvas never initializes.

Support: `test/tsconfig.json` (typechecked by `yarn typecheck`), `test/package.json` (`"type": "module"`
scoped to the tests, so the root CommonJS config files are unaffected), `lint` / `format` cover `test/`.

## Scope

- Out of scope: functional tests of the editor (running a graph against a server). The smoke test
  only proves the app boots and the editor initializes.

## Verification

Temporarily reverting #34's source change makes both tests fail; reverting #37's makes the smoke
test fail. Neither revert is committed.
