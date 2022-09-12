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


export const FS_PREFIX = `/@fs/`
export const VALID_ID_PREFIX = `/@id/`
export const CLIENT_PUBLIC_PATH = `/@vite/client`
export const ENV_PUBLIC_PATH = `/@vite/env`

const internalPrefixes = [
  FS_PREFIX,
  VALID_ID_PREFIX,
  CLIENT_PUBLIC_PATH,
  ENV_PUBLIC_PATH
]

const InternalPrefixRE = new RegExp(`^(?:${internalPrefixes.join('|')})`)

export const isInternalRequest = (url: string): boolean =>
  InternalPrefixRE.test(url)

export const queryRE = /\?.*$/s
export const hashRE = /#.*$/s

export const cleanUrl = (url: string): string =>
  url.replace(hashRE, '').replace(queryRE, '')


const importQueryRE = /(\?|&)import=?(?:&|$)/
export const isImportRequest = (url: string): boolean => importQueryRE.test(url)