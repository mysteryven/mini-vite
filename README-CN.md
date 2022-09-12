# Mini-Vite

＃ 特征

- [x] 与 Vite 相同的文件/目录/函数名
- [x] 支持加载 JS/TS/JSX/TSX/CSS 文件
- [x] 支持导入/加载静态文件
- [x] 支持从公共路径加载文件，就像 `/vite.svg` 一样。
- [ ] 预构建
- [ ] HMR
- [ ] 支持加载本地配置文件
- [ ] 支持读取 ENV


我将很快完成剩下的功能。

## 如何运行

```bash
pnpm i 

cd packages/mini-vite && pnpm build

cd packages/demo && pnpm dev
```

## 在本地开发

```bash
cd packages/mini-vite && pnpm build:watch
```