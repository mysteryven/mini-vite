
export interface Plugin {
    name?: string
    enforce?: 'pre' | 'post'
    resolveId?: (id: string, importer?: string) => Promise<string | null>
    load?: (id: string) => Promise<string>    
    transform?: (code: string, id: string) => Promise<string>
    transformIndexHtml?: (this: void, html: string) => string
}