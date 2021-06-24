import trim from 'lodash/trim'

const proxy = p => p

export function dirPath2ObjPath (dirPath = '', pathTransformer) {
  return trim(dirPath, '/').replace(/((^|\/)index)?\.js(on)?$/i, '').split('/').map(pathTransformer || proxy).join('.')
}
