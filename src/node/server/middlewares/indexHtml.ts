import connect from 'connect'
import path from 'node:path'
import fs from 'node:fs'
import { ViteDevServer } from '../index'

export function indexHtmlMiddleware(
    server: ViteDevServer
): connect.NextHandleFunction {
    return async function viteIndexHtmlMiddleware(req, res, next) {
        const url = req.url
        if (url?.endsWith(".html")) {
            const filename = path.join(server.config.root, url.slice(1))
            if (fs.existsSync(filename)) {
                try {
                    let html = fs.readFileSync(filename, 'utf-8')

                    html = await server.transformIndexHtml(url, html, req.originalUrl)
                    
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/html");
                    return res.end(html);
                } catch (e) {
                    return next(e)
                }
            }
        }

        next()
    }
}

export function createDevHtmlTransformFn(server: ViteDevServer) {
    return async (url: string, html: string, originUrl?: string) => {
        const plugins = server.config.plugins
        for (let plugin of plugins) {
            const hook = plugin.transformIndexHtml
            if (hook) {
                html = hook.call(undefined, html)
            }
        }

        return html
    }
}