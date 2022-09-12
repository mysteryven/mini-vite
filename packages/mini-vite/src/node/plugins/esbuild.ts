import { transform, TransformOptions } from "esbuild";
import path from "node:path";
import { Plugin } from "../plugin";
import { isJSRequest } from "../utils";

type Loader = TransformOptions['loader']

export function esbuildPlugin(): Plugin {
    return {
        name: 'vite:esbuild',
        async transform(code, id) {
            if (!isJSRequest(id)) {
                return null
            }

            const ext = path.extname(id).slice(1)
            let loader: Loader = 'js'

            if (ext === 'cjs' || ext === 'mjs') {
                loader = 'js'
            } else {
                loader = ext as Loader
            }

            const result = await transform(code, {
                loader,
                target: "esnext",
                format: "esm"
            })

            return result.code
        }
    }
}