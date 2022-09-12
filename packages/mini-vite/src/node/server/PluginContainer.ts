import { ResolvedConfig } from '../config';
import { createPluginHookUtils } from '../plugins';

export interface ResolvedId {
    id: string;
}

export type PluginContext = {
    resolve: (id: string, importer?: string) => Promise<string | null>
}

export interface PluginContainer {
    resolveId(id: string, importer?: string): Promise<string | null>;
    transform(code: string, id: string): Promise<string | null>;
    load(id: string): Promise<string | null>;
    close(): Promise<void>;
}

export async function createPluginContainer(config: ResolvedConfig) {

    const { getSortedPlugins } = createPluginHookUtils(config.plugins)

    class Context {
        async resolve(id: string, importer?: string) {
            let out = await container.resolveId(id, importer)
            return out
        }
    }

    const container: PluginContainer = {
        async resolveId(rawId, importer) {
            const ctx = new Context()
            let id: string | null = null

            for (let plugin of getSortedPlugins('resolveId')) {
                if (!plugin.resolveId) {
                    continue
                }
                const handler = plugin.resolveId
                const result = await handler.call(ctx, rawId, importer)

                if (!result) {
                    continue
                }

                if (typeof result === 'string') {
                    id = result
                }
            }

            if (id) {
                return id
            } else {
                return null
            }
        },
        async load(id: string) {
            const ctx = new Context()
            for (let plugin of getSortedPlugins('load')) {
                if (!plugin.load) {
                    continue
                }

                const handler = plugin.load
                const result = await handler.call(ctx, id)

                if (result) {
                    return result
                }
            }

            return null
        },
        async transform(code: string, id: string) {
            const ctx = new Context()

            for (let plugin of getSortedPlugins('transform')) {
                if (!plugin.transform) {
                    continue
                }
                const result = await plugin.transform.call(ctx, code, id)
                if (!result) {
                    continue
                }

                code = result
            }

            return code
        },
        async close() {
            console.log("waiting to implement")
        }
    }

    return container
}