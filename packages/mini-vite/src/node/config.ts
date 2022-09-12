import { Plugin } from "./plugin"
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
        esbuildPlugin()
    ]

    return config
}