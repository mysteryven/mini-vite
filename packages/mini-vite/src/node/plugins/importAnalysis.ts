import { init, parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string';
import { Plugin } from "../plugin";
import createDebug from 'debug'
import { cleanUrl, isCSSRequest, isJSRequest } from "../utils";
const debug = createDebug('mini-vite:import-analysis')

const skipRE = /\.(map|json)($|\?)/
export const canSkipImportAnalysis = (id: string): boolean =>
    skipRE.test(id);

export function importAnalysisPlugin(): Plugin {
    return {
        name: 'vite:import-analysis',
        async transform(source, importer) {
            if (canSkipImportAnalysis(importer)) {
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
                    const resolved = await this.resolve(specifier, importer)
                    debug(specifier, resolved)
                    if (resolved) {
                        console.log('---')
                        console.log(resolved, markExplicitImport(resolved))
                        console.log('---')
                        s.overwrite(start, end, markExplicitImport(resolved))
                    }
                }
            }

            return s.toString()
        }
    }
}

export function isExplicitImportRequired(url: string): boolean {
    return !isJSRequest(cleanUrl(url)) && !isCSSRequest(url)
}

function markExplicitImport(url: string) {
    if (isExplicitImportRequired(url)) {
        return url + '?import'
    }
    return url
}