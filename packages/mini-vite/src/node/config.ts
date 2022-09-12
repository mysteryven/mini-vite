import { Plugin } from "./plugin"

export interface ResolvedConfig {
    root: string
    plugins: Plugin[]
}

export async function resolveConfig(): Promise<ResolvedConfig> {

    return {
        root: process.cwd(),
        plugins: [
            
        ]
    }
}