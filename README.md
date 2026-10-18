# GraphAI Graph Builder

## 📋 Requirements

- Node.js 22.18 or later (`yarn test` runs the TypeScript tests with Node's built-in type stripping).

![screen](docs/screen.png)

# Usage

## 📖 Instruction

```
yarn install
```

### run server

see https://github.com/receptron/graphai-agent-server

### run vue

```
yarn run serve
```

### test

Needs a build: checks `dist/` for Node-only modules and renders it in headless Chromium.

```
yarn playwright install chromium
yarn run build
yarn run test
```
