import connect from 'connect'
import { isCSSRequest, isImportRequest, isJSRequest, removeImportQuery } from '../../utils';
import { ViteDevServer } from '../index';
import { transformRequest } from '../transformRequest';
import createDebug from 'debug'
const debug = createDebug('mini-vite:transform')

const knownIgnoreList = new Set(['/', '/favicon.ico'])

export function transformMiddleware(
    server: ViteDevServer
): connect.NextHandleFunction {
    return async function viteTransformMiddleware(req, res, next) {
        if (req.method !== 'GET' || knownIgnoreList.has(req.url!)) {
            return next()
        }
        let url = req.url!;

        debug(url)
        if (
            isJSRequest(url) ||
            isCSSRequest(url) ||
            isImportRequest(url)
        ) {
            // assets will be add postfix '?import' in vite:import-analysis. 
            url = removeImportQuery(url)
            const result = await transformRequest(url, server, debug)
            if (result) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/javascript");
                return res.end(result);
            }
        }

        next()
    }
}


