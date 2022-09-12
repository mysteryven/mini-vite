import path from "node:path"
import { Plugin } from "./plugin"
import { assetPlugin } from "./plugins/asserts"
import { cssPostPlugin } from "./plugins/css"
import { esbuildPlugin } from "./plugins/esbuild"
import { importAnalysisPlugin } from "./plugins/importAnalysis"
import { resolvePlugin } from "./plugins/resolve"

export interface ResolvedConfig {
    root: string
    plugins: Plugin[],
    publicDir: string
}

export async function resolveConfig(): Promise<ResolvedConfig> {
    const config: ResolvedConfig = {
        root: process.cwd(),
        plugins: [],
        publicDir: path.join(process.cwd(), 'public')
    }

    config.plugins = [
        assetPlugin(config),
        resolvePlugin(config),
        esbuildPlugin(),
        importAnalysisPlugin(),
        cssPostPlugin()
    ]

    return config
}