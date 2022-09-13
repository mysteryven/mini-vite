import type { Plugin } from 'esbuild'
import { init, parse } from 'es-module-lexer'
import fs from 'node:fs/promises'
import * as resolve from 'resolve';
import createDebug from 'debug'
import { ResolvedConfig } from '../config'

const debug = createDebug('mini-vite:esbuildDepPlugin')

export function esbuildDepPlugin(
    deps: Record<string, string>,
    config: ResolvedConfig
): Plugin {

    return {
        name: 'vite:dep-pre-bundle',
        setup(build) {
            build.onResolve(
                { filter: /^[\w@][^:]/ },
                async ({ path: id, importer }) => {
                    if (!importer) {
                        return {
                            path: resolve.sync(id, { basedir: config.root }),
                            namespace: 'dep'
                        }
                    }

                    return {
                        path: resolve.sync(id, { basedir: config.root })
                    }
                }
            )

            build.onLoad(
                { filter: /.*/, namespace: 'dep' },
                async ({ path: id }) => {
                    
                    debug(id)
                    await init;

                    const entryContent = await fs.readFile(id, {
                        encoding: 'utf-8'
                    });
                    const parseResult = await parse(entryContent)
                    const [imports, e] = parseResult
                    const exports = e.map(i => i.n)
                    const hasImports = imports.length > 0;

                    const hasReExports = imports.some(({ ss, se }) => {
                        const exp = entryContent.slice(ss, se)
                        return /export\s+\*\s+from/.test(exp)
                    })

                    let contents = ''
                    if (!hasImports && !exports.length) {
                        const res = require(id);
                        const specifiers = Object.keys(res);
                        contents += `export { ${specifiers.join(",")} }  from "${id}";`

                        contents += `export default require("${id}");`
                    } else {
                        if (exports.includes('default')) {
                            contents += `import d from "${id}";export default d;`
                        }
                        if (hasReExports || exports.length > 1 || exports[0] !== 'default') {
                            contents += `\nexport * from "${id}"`
                        }
                    }

                    return {
                        loader: 'js',
                        contents,
                        resolveDir: config.root
                    }

                }
            )
        }
    }
}