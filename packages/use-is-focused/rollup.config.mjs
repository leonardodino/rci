import ts from 'rollup-plugin-ts'
import pkg from './package.json' assert { type: "json" }

const isWatchMode = process.env.ROLLUP_WATCH === 'true'

const input = 'src/index.ts'
const plugins = [ts({ browserslist: false })]
const external = ['react', 'react/jsx-runtime']
const sourcemap = isWatchMode ? false : true

/** @type {import('rollup').RollupOptions['watch']} */
const watch = { include: ['src/**'], clearScreen: false }

/** @type {import('rollup').RollupOptions} */
const cjs = {
  ...{ input, watch, plugins, external },
  output: { file: pkg.main, format: 'cjs', sourcemap, esModule: false },
}

/** @type {import('rollup').RollupOptions} */
const esm = {
  ...{ input, watch, plugins, external },
  output: { file: pkg.module, format: 'esm', sourcemap, esModule: true },
}

const config = isWatchMode ? esm : [cjs, esm]

export default config
