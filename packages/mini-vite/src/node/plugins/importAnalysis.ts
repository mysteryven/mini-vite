import { init, parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string';
import { Plugin } from "../plugin";
import { isJSRequest } from "../utils";

export function importAnalysisPlugin(): Plugin {
    return {
        name: 'vite:import-analysis',
        async transform(source, importer) {
            if (!isJSRequest(importer)) {
                return null
            }

            await init;
            const [imports] = parseImports(source)

            if (!imports.length) {
                return null
            }

            const s = new MagicString(source)
            for (let i = 0; i < imports.length; i++) {
                const {
                    s: start,
                    e: end,
                    n: specifier
                } = imports[i];

                if (specifier) {
                    const resolved = await this.resolve(specifier)
                    if (resolved) {
                        s.overwrite(start, end, resolved)
                    }
                }
            }

            return s.toString()
        }
    }
}