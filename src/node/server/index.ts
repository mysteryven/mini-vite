import connect from 'connect'
import colors from 'picocolors'
import { resolveHttpServer } from '../http';
import http from 'node:http'
import { createPluginContainer } from "./PluginContainer";


interface ViteDevServer {
    pluginContainer: ReturnType<typeof createPluginContainer>
    listen: (port?: number) => Promise<void>
    middlewares: connect.Server,
    httpServer: http.Server

}

export async function createServer() {
    const pluginContainer = createPluginContainer([])
    const middlewares = connect()

    const httpServer = resolveHttpServer(middlewares)

    const server: ViteDevServer = {
        middlewares,
        httpServer,
        pluginContainer,
        async listen(port?: number) {
            await startServer(server, port)
        }
    }

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
    console.info(`  ${colors.green('➜')}  ${colors.bold('Network')}: ${colorUrl(url)}\n`)
}