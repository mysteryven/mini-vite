import { PluginContext } from "./server/PluginContainer"

export interface Plugin {
    name?: string
    enforce?: 'pre' | 'post'
    resolveId?: (id: string, importer?: string) => Promise<string | null>
    load?: (id: string) => Promise<string | null>    
    transform?: (this: PluginContext,code: string, id: string) => Promise<string | null>
    transformIndexHtml?: (this: void, html: string) => string
}