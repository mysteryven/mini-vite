import path from 'node:path'
import fs from 'node:fs'
import { ResolvedConfig } from '../config';
import { Plugin } from '../plugin'

export function resolvePlugin(resolveOptions: ResolvedConfig): Plugin {
    const { root } = resolveOptions

    return {
        name: "vite:resolve",
        async resolveId(id, importer) {
            let res: string | undefined

            // absolute path
            // /foo -> /fs-root/foo
            if (id.startsWith('/')) {
                const fsPath = path.resolve(root, id.slice(1))
                if ((res = tryFsResolve(fsPath))) {
                    return res
                }
            }

            // relative path
            // ./a  
            if (id.startsWith('.')) {
                const basedir = importer ? path.dirname(importer) : process.cwd()
                const fsPath = path.resolve(basedir, id)
                if ((res = tryFsResolve(fsPath))) {
                    return res
                }
            }

            return null
        }
    }
}

export const DEFAULT_EXTENSIONS = [
    '.mjs',
    '.js',
    '.mts',
    '.ts',
    '.jsx',
    '.tsx',
    '.json'
]

function tryFsResolve(fsPath: string) {
    if (fs.existsSync(fsPath)) {
        return fsPath
    }

    for (const ext of DEFAULT_EXTENSIONS) {
        if (fs.existsSync(fsPath + ext)) {
            return fsPath + ext
        }
    }
}