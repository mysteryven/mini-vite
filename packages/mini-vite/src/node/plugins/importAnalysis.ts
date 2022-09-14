import { init, parse as parseImports } from 'es-module-lexer'
import MagicString from 'magic-string';
import path from 'node:path'
import { Plugin } from "../plugin";
import createDebug from 'debug'
import { bareImportRE, cleanUrl, isCSSRequest, isJSRequest } from "../utils";
import { ResolvedConfig } from '../config';
const debug = createDebug('mini-vite:import-analysis')

const skipRE = /\.(map|json)($|\?)/
export const canSkipImportAnalysis = (id: string): boolean =>
    skipRE.test(id);

export function importAnalysisPlugin(): Plugin {
    let configContext: ResolvedConfig;

    return {
        name: 'vite:import-analysis',
        configResolved(config) {
            configContext = config;
        },
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

                if (!specifier) {
                    continue
                }

                if (bareImportRE.test(specifier)) {
                    debug(path.join(configContext.root, configContext.cacheDir, specifier))
                    s.overwrite(
                        start,
                        end,
                        path.join(configContext.root, configContext.cacheDir, specifier + '.js') 
                    )
                } else if (specifier) {
                    const resolved = await this.resolve(specifier, importer)
                    if (resolved) {
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