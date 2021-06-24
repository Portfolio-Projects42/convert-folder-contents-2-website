import { deepListDir, deepListDirSync } from 'deep-list-dir'
import { fileListIntoJson } from './lib/file-list-into-json.js'
import path from 'path'

export const settings = {
  fileLoader: require
}

export async function jsDirIntoJson (directory, { extensions = ['*.js', '*.json'], fileLoader = settings.fileLoader, pathTransformer } = {}) {
  return fileListIntoJson(await deepListDir(path.resolve(process.cwd(), directory), { pattern: extensions }), { fileLoader, base: directory, pathTransformer })
}

export function jsDirIntoJsonSync (directory, { extensions = ['*.js', '*.json'], fileLoader = settings.fileLoader, pathTransformer } = {}) {
  return fileListIntoJson(deepListDirSync(path.resolve(process.cwd(), directory), { pattern: extensions }), { fileLoader, base: directory, pathTransformer })
}
