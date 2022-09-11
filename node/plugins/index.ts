import { Plugin } from '../plugin'

export function createPluginHookUtils(plugins: Plugin[]) {
    function getSortedPlugins(hookName: keyof Plugin) {
        let ret: Plugin[] = []
        for (let plugin of plugins) {
            if (plugin[hookName]) {
                ret.push(plugin)
            }
        }

        return ret.filter(Boolean); // filter plugin return falsy
    }

    return {
        getSortedPlugins
    }
}

export function getSortedPluginsByHook(
    hookName: keyof Plugin,
    plugins: readonly Plugin[]
): Plugin[] {
    const pre: Plugin[] = []
    const normal: Plugin[] = []
    const post: Plugin[] = []
    for (const plugin of plugins) {
        const hook = plugin[hookName]
        if (hook) {
            if (typeof hook === 'object') {
                if (hook.order === 'pre') {
                    pre.push(plugin)
                    continue
                }
                if (hook.order === 'post') {
                    post.push(plugin)
                    continue
                }
            }
            normal.push(plugin)
        }
    }
    return [...pre, ...normal, ...post]
}