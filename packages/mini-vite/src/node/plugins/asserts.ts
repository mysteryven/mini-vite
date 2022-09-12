import path from 'node:path'
import fs from 'node:fs'
import { ResolvedConfig } from "../config";
import { DEFAULT_ASSETS_RE } from "../constant";
import { Plugin } from "../plugin";
import { cleanUrl } from '../utils';

export function assetPlugin(config: ResolvedConfig): Plugin {
    return {
        name: 'vite:assets',
        async resolveId(id) {
            if (!DEFAULT_ASSETS_RE.test(id)) {
                return null
            }

            // Intercept files from `public` directory.  
            // We can use /vite.svg to get source in public directly
            // Otherwise will fallback  in vite:resolve, 
            // So this plugin should be pre of resolve.
            const publicFile = checkPublicFile(id, config)
            if (publicFile) {
                return id
            }

            return null
        },
        async load(id) {
            if (id.startsWith('\0')) {
                // Rollup convention, this id should be handled by the
                // plugin that marked it with \0
                return null 
            }

            if (!DEFAULT_ASSETS_RE.test(id)) {
                return null
            }

            return `export default ${JSON.stringify(id)}`
        }
    }
}

export function checkPublicFile(
    url: string,
    { publicDir }: ResolvedConfig
): string | undefined {
    if (!publicDir || !url.startsWith('/')) {
        return
    }
    const publicFile = path.join(publicDir, cleanUrl(url))
    if (fs.existsSync(publicFile)) {
        return publicFile
    } else {
        return
    }
}