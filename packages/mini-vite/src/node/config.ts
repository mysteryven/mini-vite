import { Plugin } from "./plugin"
import { cssPostPlugin } from "./plugins/css"
import { esbuildPlugin } from "./plugins/esbuild"
import { resolvePlugin } from "./plugins/resolve"

export interface ResolvedConfig {
    root: string
    plugins: Plugin[]
}

export async function resolveConfig(): Promise<ResolvedConfig> {
    const config: ResolvedConfig = {
        root: process.cwd(),
        plugins: []
    }

    config.plugins = [
        resolvePlugin(config),
        esbuildPlugin(),
        cssPostPlugin()
    ]

    return config
}