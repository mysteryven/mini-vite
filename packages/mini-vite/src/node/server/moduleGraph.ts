export class ModuleNode {
    url: string;
    id: string | null = null;
    importers = new Set<ModuleNode>()
    importedModules = new Set<ModuleNode>()

    constructor(url: string) {
        this.url = url
    }
}

export class ModuleGraph {
    urlToModuleMap = new Map<string, ModuleNode>()
    idToModuleMap = new Map<string, ModuleNode>()
    fileToModulesMap = new Map<string, Set<ModuleNode>>()

    
}