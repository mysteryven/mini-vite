import { ResolvedConfig } from "../config";
import { Plugin } from "../plugin";
import { isCSSRequest } from "../utils";

export function cssPostPlugin(config: ResolvedConfig): Plugin {

    return {
        name: 'vite:css-post',
        async transform(code, id) {
            if (!isCSSRequest(id)) {
                return null
            }

            const result = [
                `const style = document.createElement('style')`,
                `style.setAttribute('type', 'text/css')`,
                `style.innerHTML = ${JSON.stringify(code)}`,
                `document.head.appendChild(style)`
            ]

            return result.join('\n')
        }
    }
}