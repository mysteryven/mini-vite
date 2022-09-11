import { PluginContext as RollupPluginContext } from 'rollup'
import { Plugin } from '../plugin'
import { createPluginHookUtils } from '../plugins';
import { isExternalUrl, normalizePath } from '../utils';

interface PartialResolvedId {
    id: string;
}

export interface ResolvedId {
    id: string;
}

export type PluginContext = Omit<
    RollupPluginContext,
    | 'cache'
    | 'emitAsset'
    | 'emitChunk'
    | 'getAssetFileName'
    | 'getChunkFileName'
    | 'isExternal'
    | 'moduleIds'
    | 'resolveId'
    | 'load'
>

export interface SourceDescription {
    code: string;
}

type LoadResult = SourceDescription | string | null | void;

interface PluginContainer {
    resolveId(id: string): Promise<PartialResolvedId | null>;
    transform(code: string, id: string): Promise<SourceDescription | null>;
    load(id: string): Promise<LoadResult | null>;
    close(): Promise<void>;
}

export async function createPluginContainer(plugins: Plugin[]) {

    const { getSortedPlugins } = createPluginHookUtils(plugins)

    class Context {
        async resolve(id: string) {

            let out = await container.resolveId(id)
            if (typeof out === 'string') out = { id: out }
            return out as ResolvedId | null
        }
    }


    const container: PluginContainer = {
        async resolveId(rawId) {
            const ctx = new Context()
            let id: string | null = null

            const partial: Partial<PartialResolvedId> = {}
            for (let plugin of getSortedPlugins('resolveId')) {
                if (!plugin.resolveId) {
                    continue
                }
                const handler = plugin.resolveId
                const result = await handler.call(ctx, rawId)

                if (!result) {
                    continue
                }

                if (typeof result === 'string') {
                    id = result
                }
            }

            if (id) {
                partial.id = isExternalUrl(id) ? id : normalizePath(id)
                return partial as PartialResolvedId
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

                code = result.code
            }

            return {
                code
            }
        },
        async close() {
            console.log("waiting to implement")
        }
    }
}