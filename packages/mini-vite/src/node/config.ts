import path from "node:path"
import { Plugin } from "./plugin"
import { assetPlugin } from "./plugins/assets"
import { cssPostPlugin } from "./plugins/css"
import { esbuildPlugin } from "./plugins/esbuild"
import { importAnalysisPlugin } from "./plugins/importAnalysis"
import { resolvePlugin } from "./plugins/resolve"

export interface ResolvedConfig {
    root: string
    plugins: Plugin[]
    publicDir: string
    cacheDir: string
    optimizeDeps: {
        entries: string[]
    }
}

export async function resolveConfig(): Promise<ResolvedConfig> {
    const config: ResolvedConfig = {
        root: process.cwd(),
        plugins: [],
        publicDir: path.join(process.cwd(), 'public'),
        cacheDir: 'node_modules/.vite',
        optimizeDeps: {
            entries: ['./src/main.tsx'] // hard code it now.
        }
    }

    config.plugins = [
        assetPlugin(config),
        resolvePlugin(config),
        esbuildPlugin(),
        importAnalysisPlugin(),
        cssPostPlugin()
    ]


    const configureResolved: Plugin[] = []
    for (let plugin of config.plugins) {
        if (plugin['configResolved']) {
            configureResolved.push(plugin)
        }
    }
    await Promise.all(configureResolved.map(p => {
        if (p.configResolved) {
            return p.configResolved(config)
        }
    }))

    return config
}