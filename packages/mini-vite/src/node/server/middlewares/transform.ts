import connect from 'connect'
import { isJSRequest } from '../../utils';
import { ViteDevServer } from '../index';
import { transformRequest } from '../transformRequest';

const knownIgnoreList = new Set(['/', '/favicon.ico'])

export function transformMiddleware(
    server: ViteDevServer
): connect.NextHandleFunction {
    return async function viteTransformMiddleware(req, res, next) {
        if (req.method !== 'GET' || knownIgnoreList.has(req.url!)) {
            return next()
        }
        let url = req.url!;

        if (isJSRequest(url)) {
            const result = await transformRequest(url, server)
            if (result) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/javascript");
                return res.end(result);
            }
        }

        next()
    }
}


