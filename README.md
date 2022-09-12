# Mini Vite

## Features

- [x] Same file/directory/function name with Vite
- [x] Support to load JS/TS/JSX/TSX/CSS files
- [x] Support to import/load static file
- [x] Support load files from public path use just like `/vite.svg`.
- [ ] Pre build
- [ ] HMR
- [ ] Support to load local config file
- [ ] Support to read ENV
- [ ] Support external vite/Rollup plugins

## How to run

```bash
pnpm i

cd packages/mini-vite && pnpm build 

cd packages/demo && pnpm dev
```

## Debug

```bash
cd packages/mini-vite && pnpm build:watch
```