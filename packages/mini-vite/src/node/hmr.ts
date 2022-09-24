import path from 'node:path'
import { ViteDevServer } from "./server"

export function getShortName(file: string, root: string): string {
    return file.startsWith(root + '/') ? path.posix.relative(root, file) : file
}

export async function handleHMRUpdate(
    file: string,
    server: ViteDevServer
): Promise<void> {
    const { ws, config, moduleGraph } = server
    const shortFile = getShortName(file, config.root)

    const mods = moduleGraph.getModulesByFile(file)
    if (!mods) {
        return
    }

    for (let mod of mods) {
        moduleGraph.invalidateModule(mod)
    }

    ws.send({
        type: "update",
        updates: [
            {
                type: "js-update",
                timestamp: Date.now(),
                path: shortFile,
                acceptedPath: shortFile,
            },
        ],
    });
}

