# GraphAI Graph Builder

## 📋 Requirements

- Node.js version 20 or later.

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
