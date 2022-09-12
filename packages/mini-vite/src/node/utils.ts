import path from 'node:path'
import os from 'node:os'

export const isWindows = os.platform() === 'win32'

export const externalRE = /^(https?:)?\/\//
export const isExternalUrl = (url: string): boolean => externalRE.test(url)

export function slash(p: string): string {
    return p.replace(/\\/g, '/')
}
export function normalizePath(id: string): string {
    return path.posix.normalize(isWindows ? slash(id) : id)
}

export function isObject(value: unknown): value is Record<string, any> {
    return Object.prototype.toString.call(value) === '[object Object]'
}

const knownJsSrcRE = /\.((j|t)sx?)($|\?)/
export function isJSRequest(url: string) {
    if (knownJsSrcRE.test(url)) {
      return true
    }
    if (!path.extname(url) && !url.endsWith('/')) {
      return true
    }
    return false 
}

const cssLangs = `\\.(css|less|sass|scss|styl|stylus|pcss|postcss)($|\\?)`
const cssLangRE = new RegExp(cssLangs)
export const isCSSRequest = (request: string): boolean =>
  cssLangRE.test(request)