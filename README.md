# Mini Vite

[中文](./README-CN.md)  

## Features

- [x] Same file/directory/function name with Vite
- [x] Support to load JS/TS/JSX/TSX/CSS files
- [x] Support to import/load static file
- [x] Support load files from public path use just like `/vite.svg`.
- [ ] Pre build
- [ ] HMR
- [ ] Support to load local config file
- [ ] Support to read ENV

I will finish this rest of features soon.   

## Preview

```bash
pnpm i

cd packages/mini-vite && pnpm build 

cd packages/demo && pnpm dev
```

## Work in local

```bash
cd packages/mini-vite && pnpm build:watch
```