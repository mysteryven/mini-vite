import { ViteDevServer } from ".";
import { isObject } from "../utils";

export function transformRequest(
    url: string,
    server: ViteDevServer,
): Promise<string | null> {

    const request = doTransform(url, server)

    return request;
}

async function doTransform(
    url: string,
    server: ViteDevServer
): Promise<string | null> {
    const { pluginContainer } = server

    const id = (await pluginContainer.resolveId(url))?.id || url

    const loadResult = await pluginContainer.load(id)
    let code: string | null;

    if (isObject(loadResult)) {
        code = loadResult.code
    } else {
        code = loadResult || null
    }

    if (code === null) {
        return null
    }

    const transformResult = await pluginContainer.transform(code, id)

    return transformResult
}