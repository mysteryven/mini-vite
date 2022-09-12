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
