export const KNOWN_ASSET_TYPES = [
    // only support a few type now.
    'png',
    'jpe?g',
    'svg',
    'webp',
    
    // other
    'txt'
]

export const DEFAULT_ASSETS_RE = new RegExp(
    `\\.(` + KNOWN_ASSET_TYPES.join('|') + `)(\\?.*)?$`
)

export const CLIENT_PUBLIC_PATH = `/@vite/client`

export const HMR_PORT = 24678