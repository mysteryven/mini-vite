import connect from 'connect'
import colors from 'picocolors'
import { resolveHttpServer } from '../http';
import http from 'node:http'
import { createPluginContainer } from "./PluginContainer";
import { createDevHtmlTransformFn, indexHtmlMiddleware } from './middlewares/indexHtml';
import { Plugin } from '../plugin';

export interface ViteDevServer {
    config: {
        root: string,
        plugins: Plugin[]
    },
    pluginContainer: ReturnType<typeof createPluginContainer>
    transformIndexHtml: (url: string, html: string, originUrl?: string) => Promise<string>
    listen: (port?: number) => Promise<void>
    middlewares: connect.Server,
    httpServer: http.Server
}

export async function createServer() {
    const pluginContainer = createPluginContainer([])
    const middlewares = connect()
    const httpServer = resolveHttpServer(middlewares)

    const server: ViteDevServer = {
        config: {
            root: process.cwd(), 
            plugins: []
        },
        middlewares,
        httpServer,
        transformIndexHtml: null!,
        pluginContainer,
        async listen(port?: number) {
            await startServer(server, port)
        }
    }

    server.transformIndexHtml = createDevHtmlTransformFn(server)

    // A middleware to process index.html
    // transformIndexHtml will be trigger here
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