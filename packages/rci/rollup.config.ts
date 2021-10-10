import type { RollupOptions } from 'rollup'
import ts from 'rollup-plugin-ts'
import pkg from './package.json'

const isWatchMode = process.env.ROLLUP_WATCH === 'true'

const input = 'src/index.ts'
const plugins = [ts({ browserslist: false })]
const external = ['react', 'react/jsx-runtime', 'use-code-input']
const watch: RollupOptions['watch'] = { include: ['src/**'], clearScreen: false }
const sourcemap = isWatchMode ? false : true
const onwarn: RollupOptions['onwarn'] = (warning) => {
  throw new Error(warning.message)
}

const cjs: RollupOptions = {
  ...{ input, watch, plugins, external, onwarn },
  output: { file: pkg.main, format: 'cjs', sourcemap },
}

const esm: RollupOptions = {
  ...{ input, watch, plugins, external, onwarn },
  output: { file: pkg.module, format: 'esm', sourcemap },
}

const config = isWatchMode ? esm : [cjs, esm]

export default config
