import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import peerDepsExternal from "rollup-plugin-peer-deps-external"

const sharedPlugins = [peerDepsExternal(), resolve(), json(), commonjs()]

const config = [
  // ESM bundle + per-file declarations (consumed by the dts step below).
  {
    input: "src/index.ts",
    output: {
      file: "dist/esm/index.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: [
      ...sharedPlugins,
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "dist/esm",
        sourceMap: true,
        outDir: "dist/esm",
      }),
    ],
  },
  // CJS bundle. No declarations needed — the dts plugin produces a single
  // `dist/index.d.ts` that both formats reference via the `exports` map.
  {
    input: "src/index.ts",
    output: {
      file: "dist/cjs/index.cjs",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    plugins: [
      ...sharedPlugins,
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
        sourceMap: true,
        outDir: "dist/cjs",
      }),
    ],
  },
  // Roll all per-file `.d.ts` files into a single bundled declaration file.
  {
    input: "dist/esm/index.d.ts",
    output: { file: "dist/index.d.ts", format: "esm" },
    plugins: [dts()],
  },
]

export default config
