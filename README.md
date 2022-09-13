# Mini Vite

[中文](./README-CN.md)  

## Features

- [x] Same structure with Vite.
- [x] Support JS, TS, JSX, TSX, CSS, static files.
- [x] Support `public` as public directory.
- [ ] Dependency Pre-Bundling. (working in progress, 70%)
- [ ] Hot Module Replacement.
- [ ] Load local config file.
- [ ] Read ENV from `.env.*`.

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