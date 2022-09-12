import fs from 'fs/promises'
import type { Debugger } from 'debug';
import { ViteDevServer } from "./index";

export function transformRequest(
    url: string,
    server: ViteDevServer,
    debug: Debugger
): Promise<string | null> {
    const request = doTransform(url, server, debug)

    return request;
}

async function doTransform(
    url: string,
    server: ViteDevServer,
    debug: Debugger
): Promise<string | null> {
    const { pluginContainer } = server

    const id = (await pluginContainer.resolveId(url)) || url

    debug('id' + id)

    const loadResult = await pluginContainer.load(id)
    let code: string | null;

    // fallback for load hook
    if (!loadResult) {
        code = await fs.readFile(id, 'utf-8')
    } else {
        code = loadResult
    }


    if (code === null) {
        return null
    }

    const transformResult = await pluginContainer.transform(code, id)

    return transformResult
}