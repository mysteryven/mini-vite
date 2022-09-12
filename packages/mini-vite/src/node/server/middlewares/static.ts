import sirv from "sirv";
import connect from 'connect'
import path from "node:path";
import { isImportRequest, isInternalRequest } from "../../utils";


export function servePublicMiddleware(
    dir: string,
  ): connect.NextHandleFunction {
    const serve = sirv(dir,{
        dev: true,
        etag: true
    })
  
    return function viteServePublicMiddleware(req, res, next) {
      // skip import request and internal requests `/@fs/ /@vite-client` etc...
      if (isImportRequest(req.url!) || isInternalRequest(req.url!)) {
        return next()
      }
      serve(req, res, next)
    }
  }

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