import { SourceDescription } from "./server/PluginContainer"

export interface Plugin {
    enforce?: 'pre' | 'post'
    resolveId?: (id: string) => Promise<string>
    load?: (id: string) => Promise<string>    
    transform?: (code: string, id: string) => Promise<SourceDescription>
    transformIndexHtml?: (this: void, html: string) => string
}