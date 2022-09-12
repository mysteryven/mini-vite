import sirv from "sirv";
import connect from 'connect'
import path from "node:path";
import { isInternalRequest } from "../../utils";

export function serveStaticMiddleware(
    dir: string
): connect.NextHandleFunction {
    const serve = sirv(dir, {
        dev: true,
        etag: true
    })

    return function viteServeStaticMiddleware(req, res, next) {
        const url = req.url
        if (
            !url ||
            url.endsWith('/') ||
            path.extname(url) === '.html' ||
            isInternalRequest(url)
        ) {
            return next()
        }

        serve(req, res, next)
    }
}