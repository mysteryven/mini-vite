import connect from 'connect'
import chokidar, { FSWatcher } from 'chokidar'
import colors from 'picocolors'
import { resolveHttpServer } from '../http';
import http from 'node:http'
import { createPluginContainer, PluginContainer } from "./PluginContainer";
import { createDevHtmlTransformFn, indexHtmlMiddleware } from './middlewares/indexHtml';
import { transformMiddleware } from './middlewares/transform';
import { resolveConfig, ResolvedConfig } from '../config';
import { servePublicMiddleware, serveStaticMiddleware } from './middlewares/static';
import { initDepsOptimizer } from '../optimizer/optimizer';
import { ModuleGraph } from './moduleGraph';
import { createWebSocketServer } from './ws';
import { normalizePath } from '../utils';
import { handleHMRUpdate } from '../hmr';

export interface ViteDevServer {
    config: ResolvedConfig,
    pluginContainer: PluginContainer
    transformIndexHtml: (url: string, html: string, originUrl?: string) => Promise<string>
    listen: (port?: number) => Promise<void>
    middlewares: connect.Server,
    httpServer: http.Server,
    moduleGraph: ModuleGraph,
    watcher: FSWatcher,
    ws: ReturnType<typeof createWebSocketServer>;
}

export async function createServer() {
    const config = await resolveConfig()
    const pluginContainer = await createPluginContainer(config)
    const middlewares = connect()
    const httpServer = resolveHttpServer(middlewares)

    const watcher = chokidar.watch(
        config.root,
        {
            ignored: [
                '**/.git/**',
                '**/node_modules/**',
            ],
            ignoreInitial: true,
        }
    )

    const server: ViteDevServer = {
        config,
        middlewares,
        httpServer,
        transformIndexHtml: null!, // be set soon
        pluginContainer,
        async listen(port?: number) {
            // Entry of pre-bundling
            await initDepsOptimizer(config)
            await startServer(server, port)
        },
        moduleGraph: new ModuleGraph((url) => {
            return pluginContainer.resolveId(url)
        }),
        watcher,
        ws: createWebSocketServer()
    }

    watcher.on('change', async (file) => {
        file = normalizePath(file)
        await handleHMRUpdate(file, server)
    })

    server.transformIndexHtml = createDevHtmlTransformFn(server)

    // Serve for public directory.
    // If we have import like `import a from '../public/vite.svg'` in JS file.
    // First, it will be processed in `transformMiddleware`, and `a` is the path of vite.svg.
    // When use `a` such as <img src="a">, this request will be process by `servePublicMiddleware`
    middlewares.use(
        servePublicMiddleware(config.publicDir)
    )

    // The main middleware for request, 
    // We will use this middleware to process JS/TS/CSS etc.
    // For example, The request of /main/index.ts will be processed here.
    middlewares.use(transformMiddleware(server))

    // To serve static files, such as /public/vite.svg
    middlewares.use(serveStaticMiddleware(server.config.root))

    // The internal middleware to process index.html
    // transformIndexHtml hook will be called in this middleware
    // and configureServer hook will be called before this middleware
    server.middlewares.use(indexHtmlMiddleware(server))

    return server;
}

function startServer(server: ViteDevServer, inlinePort?: number) {
    const port = inlinePort ?? 5173;
    const hostname = 'localhost'

    const start = performance.now()
    server.httpServer.listen(port, hostname)
    const end = performance.now()

    const url = `http://${hostname}:${port}/`
    const colorUrl = (url: string) =>
        colors.cyan(url.replace(/:(\d+)\//, (_, port) => `:${colors.bold(port)}/`));

    console.info(`\n${colors.green("VITE")}  ready in ${(end - start).toFixed(0)} ms`)
    console.info(`\n   ${colors.green('➜')}  ${colors.bold('Network')}: ${colorUrl(url)}\n`)
}