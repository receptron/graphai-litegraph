# fix: editor init crash on single-schema anyOf

Issue: #36

## Problem

`jsonSchemaToIO` calls `inputs.anyOf.map(...)`. `@graphai/vanilla`'s `mergeObjectAgent` declares
`output: { anyOf: { type: "object" } }` (not an array), so registering agents throws, and the
LiteGraph canvas is never created when an agent server is available.

## Scope

- `jsonSchemaToIO` is the only `anyOf` reader in `src/`.
- The upstream schema in `receptron/graphai` is out of scope (reported separately if wanted).

## Change

Normalize with `[inputs.anyOf].flat()` so one schema object and an array of schemas both work.

## Verification

Build + headless Chrome with a stubbed agent server: the editor loads, the Graph tab shows the YAML,
and Run returns the server agent's result, with no console errors.
