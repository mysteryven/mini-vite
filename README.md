# Mini Vite

[中文](./README-CN.md)  

## Features

- [x] Same file/directory/function name with Vite
- [x] Load JS/TS/JSX/TSX/CSS files
- [x] Import/Load static file(eg. png, jpeg)
- [x] Load files from public path use just like `/vite.svg` directly.
- [ ] Dependency Pre-Bundling 
- [ ] Hot Module Replacement
- [ ] Load local config file
- [ ] Read ENV from `.env.*`

I will finish this rest of features soon.   

## Preview

```bash
pnpm i

cd packages/mini-vite && pnpm build 

cd packages/demo && pnpm dev
```

## Run in local

```bash
cd packages/mini-vite && pnpm build:watch
```