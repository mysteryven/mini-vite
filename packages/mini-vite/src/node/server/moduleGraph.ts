import { extname } from 'node:path'
import { cleanUrl, removeImportQuery } from "../utils";

export class ModuleNode {
    url: string;
    id: string | null = null;
    importers = new Set<ModuleNode>()
    importedModules = new Set<ModuleNode>()
    transformResult: string | null = null
    file: string | null = null

    constructor(url: string) {
        this.url = url
    }
}

export class ModuleGraph {
    urlToModuleMap = new Map<string, ModuleNode>()
    idToModuleMap = new Map<string, ModuleNode>()
    fileToModulesMap = new Map<string, Set<ModuleNode>>()

    constructor(private resolveId: (
        url: string
    ) => Promise<string | null>) { }

    async resolveUrl(url: string) {
        url = removeImportQuery(url)
        const resolved = await this.resolveId(url)
        const resolvedId = resolved || url

        if (
            url !== resolvedId &&
            !url.includes('\0') &&
            !url.startsWith(`virtual:`)
        ) {
            const ext = extname(cleanUrl(resolvedId))
            const { pathname, search, hash } = new URL(url, 'relative://')
            if (ext && !pathname!.endsWith(ext)) {
                url = pathname + ext + search + hash
            }
        }
        return [url, resolvedId]
    }

    async getModuleByUrl(rawUrl: string) {
        const [url] = await this.resolveUrl(rawUrl)
        return this.urlToModuleMap.get(url)
    }

    async ensureEntryFromUrl(rawUrl: string) {
        const [url, resolvedId] = await this.resolveUrl(rawUrl)
        let mod = this.idToModuleMap.get(resolvedId)
        if (!mod) {
            mod = new ModuleNode(url)
            this.urlToModuleMap.set(url, mod)
            mod.id = resolvedId
            this.idToModuleMap.set(resolvedId, mod)
            const file = (mod.file = cleanUrl(resolvedId))
            let fileMappedModules = this.fileToModulesMap.get(file)
            if (!fileMappedModules) {
                fileMappedModules = new Set()
                this.fileToModulesMap.set(file, fileMappedModules)
            }
            fileMappedModules.add(mod)
        } else if (!this.urlToModuleMap.has(url)) {
            this.urlToModuleMap.set(url, mod)
        }
        return mod
    }
}