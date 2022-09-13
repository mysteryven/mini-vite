import { build } from 'esbuild'
import path from 'path'
import { ResolvedConfig } from "../config"
import { esbuildDepPlugin } from './esbuildDepPlugin'
import { scanImports } from "./scan"

export async function initDepsOptimizer(
    config: ResolvedConfig,
): Promise<void> {

    const { deps } = await scanImports(config)
    runOptimizeDeps(deps, config)
}

export async function runOptimizeDeps(deps: Record<string, string>, config: ResolvedConfig) {
    await build({
        entryPoints: deps,
        write: true,
        bundle: true,
        format: "esm",
        splitting: true,
        outdir: path.resolve(config.root, config.cacheDir),
        plugins: [esbuildDepPlugin(deps, config)],
    });
}
