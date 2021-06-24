import { name, version, author, license } from './package.json'
import commonjs from '@rollup/plugin-commonjs'

const initialYear = 2020
const yearsActive = new Date().getFullYear() !== initialYear ? `${ initialYear }-${ new Date().getFullYear() }` : initialYear

const banner = `/*!
 * ${ name } v${ version }
 * (c) ${ yearsActive } ${ author }
 * ${ license }
 */`

export default [
  {
    input: 'src/js-dir-into-json.js',
    output: [
      {
        file: `dist/js-dir-into-json.js`,
        format: 'cjs',
        banner
      },
      {
        file: `dist/js-dir-into-json.mjs`,
        format: 'esm',
        banner
      },
    ],
    plugins: [commonjs()]
  }
]
