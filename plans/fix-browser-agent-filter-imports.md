# fix: browser white screen from Node-only agent filter imports

Issue: #33

## Problem

`src/utils/graph.ts` imports from the `@graphai/agent_filters` barrel. The barrel re-exports
`@graphai/step_runner_agent_filter`, which depends on the Node-only `@inquirer/input`
(`AsyncLocalStorage`). Vite bundles it for the browser, the module throws at evaluation
(`AsyncLocalStorage is not a constructor`), and the app never mounts.

## Scope

- Only `src/utils/graph.ts` imports `@graphai/agent_filters`.
- The other `@graphai/*` imports (`vanilla`, `sleeper_agents`, `data_agents`) have no Node-only dependencies.
- `functions/` (Firebase Functions, Node runtime) is out of scope.

## Change

- Import `streamAgentFilterGenerator` from `@graphai/stream_agent_filter` and `httpAgentFilter`
  from `@graphai/http_client_agent_filter` (both added with `yarn add`).
- `yarn remove @graphai/agent_filters` (no other users).

## Verification

- Clean install with `--frozen-lockfile`, then format / lint / typecheck / build.
- `vite preview` in headless Chrome: the UI renders, with no uncaught errors.
- The built bundle no longer contains `AsyncLocalStorage`.

## Follow-up (proposed, not implemented)

A CI step that fails when `dist/assets/*.js` contains `AsyncLocalStorage` or `@inquirer`.
