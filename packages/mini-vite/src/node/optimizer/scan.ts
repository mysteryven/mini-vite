import { build, Plugin } from 'esbuild'
import { ResolvedConfig } from "../config";
import createDebug from 'debug'
import { KNOWN_ASSET_TYPES } from '../constant';

const debug = createDebug('mini-vite:esbuild-scan-import')

export async function scanImports(config: ResolvedConfig): Promise<{
    deps: Record<string, string>
}> {
    const entries: string[] = config.optimizeDeps.entries

    const deps: Record<string, string> = {}
    const plugin = esbuildScanPlugin(deps, entries)

    debug(entries)

    await Promise.all(
        entries.map((entry) =>
            build({
                absWorkingDir: process.cwd(),
                write: false,
                entryPoints: [entry],
                bundle: true,
                format: 'esm',
                logLevel: 'error',
                plugins: [plugin],
            })
        )
    )

    debug(deps)

    return {
        deps
    };
}

function esbuildScanPlugin(
    depImports: Record<string, string>,
    entries: string[]
): Plugin {
    const externalUnlessEntry = ({ path }: { path: string }) => ({
        path,
        external: !entries.includes(path)
    })

    return {
        name: "vite:dep-scan",
        setup(build) {
            build.onResolve(
                {
                    filter: /^[\w@][^:]/
                },
                async ({ path: id, importer, pluginData }) => {
                    debug(id)
                    if (depImports[id]) {
                        return externalUnlessEntry({ path: id })
                    }

                    depImports[id] = id

                    return externalUnlessEntry({ path: id })
                }
            )

            // css & json & wasm
            build.onResolve(
                {
                    filter: /\.(css|less|sass|scss|styl|stylus|pcss|postcss|json|wasm)$/
                },
                externalUnlessEntry
            )

            // known asset types
            build.onResolve(
                {
                    filter: new RegExp(`\\.(${KNOWN_ASSET_TYPES.join('|')})$`)
                },
                externalUnlessEntry
            )
        }
    }
}