/*!
 * js-dir-into-json v2.3.0
 * (c) 2020 Martin Rafael Gonzalez <tin@devtin.io>
 * MIT
 */
import { deepListDir, deepListDirSync } from 'deep-list-dir';
import merge from 'deepmerge';
import path from 'path';
import set from 'lodash/set';
import camelCase from 'lodash/camelCase.js';
import trim from 'lodash/trim';

function dirPath2ObjPath (dirPath = '') {
  return trim(dirPath, '/').replace(/((^|\/)index)?\.js(on)?$/i, '').split('/').map(camelCase).join('.')
}

const unwrapDefaults = (obj) => {
  if (typeof obj !== 'object' || Array.isArray(obj) || obj === null) {
    return obj
  }

  if (Object.keys(obj).length === 1 && obj.default) {
    return obj.default
  }

  Object.keys(obj).forEach(prop => {
    obj[prop] = unwrapDefaults(obj[prop]);
  });

  return obj
};

/**
 * @param {String[]} fileList - List of js / json files
 * @param {Object} [options]
 * @param {Function|NodeRequire} [options.fileLoader=esm] - Function that resolves the files
 * @param {Function} [options.path2dot=dirPath2ObjPath] - Function that receives the file path and resolves a dot notation path
 * @return {Promise<{}>}
 */
function fileListIntoJson (fileList, { fileLoader = require, base = './', path2dot = dirPath2ObjPath } = {}) {
  let finalObject = {};
  fileList.forEach(jsFile => {
    const dotProp = path2dot(path.relative(base, jsFile));
    let fileContent = dotProp ? set({}, dotProp, fileLoader(jsFile)) : fileLoader(jsFile);

    fileContent = unwrapDefaults(fileContent);
    finalObject = merge(finalObject, fileContent);
  });
  return finalObject
}

const settings = {
  fileLoader: require
};

async function jsDirIntoJson (directory, { extensions = ['*.js', '*.json'], fileLoader = settings.fileLoader, path2dot } = {}) {
  return fileListIntoJson(await deepListDir(path.resolve(process.cwd(), directory), { pattern: extensions }), { fileLoader, base: directory, path2dot })
}

function jsDirIntoJsonSync (directory, { extensions = ['*.js', '*.json'], fileLoader = settings.fileLoader, path2dot } = {}) {
  return fileListIntoJson(deepListDirSync(path.resolve(process.cwd(), directory), { pattern: extensions }), { fileLoader, base: directory, path2dot })
}

export { jsDirIntoJson, jsDirIntoJsonSync, settings };
