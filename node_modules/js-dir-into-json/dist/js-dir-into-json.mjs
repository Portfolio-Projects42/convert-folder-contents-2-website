/*!
 * js-dir-into-json v2.7.1
 * (c) 2020-2021 Martin Rafael Gonzalez <tin@devtin.io>
 * MIT
 */
import { deepListDir, deepListDirSync } from 'deep-list-dir';
import merge from 'deepmerge';
import path from 'path';
import set from 'lodash/set';
import camelCase from 'lodash/camelCase.js';
import trim from 'lodash/trim';
import { isPlainObject } from 'is-plain-object';

const proxy = p => p;

function dirPath2ObjPath (dirPath = '', pathTransformer) {
  return trim(dirPath, '/').replace(/((^|\/)index)?\.js(on)?$/i, '').split('/').map(pathTransformer || proxy).join('.')
}

const unwrapDefaults = (obj) => {
  if (typeof obj !== 'object' || Array.isArray(obj) || obj === null) {
    return obj
  }

  if (Object.keys(obj).length === 1 && obj.default) {
    return obj.default
  }

  Object.keys(obj).forEach(prop => {
    if (Object.getOwnPropertyDescriptor(obj, prop).writable) {
      obj[prop] = unwrapDefaults(obj[prop]);
    }
  });

  return obj
};

const replaceVirtuals = (src, dst) => {
  if (!src || !dst) {
    return
  }
  Object.keys(src).forEach(prop => {
    const objDesc = Object.getOwnPropertyDescriptor(src, prop);
    if (typeof objDesc.get === 'function' || typeof objDesc.set === 'function') {
      delete dst[prop];
      Object.defineProperties(dst, {
        [prop]: objDesc
      });
    } else if (typeof src[prop] === 'object' && !Array.isArray(src[prop])) {
      replaceVirtuals(src[prop], dst[prop]);
    }
  });
};


/**
 * @param {String[]} fileList - List of js / json files
 * @param {Object} [options]
 * @param {Function|NodeRequire} [options.fileLoader=esm] - Function that resolves the files
 * @param {Function} [options.pathTransformer=lodash.camelCase] - Function that receives and can transform the file path name
 * @return {Promise<{}>}
 */
function fileListIntoJson (fileList, { fileLoader = require, base = './', pathTransformer = camelCase } = {}) {
  let finalObject = {};
  const objsToReplaceVirtuals = [];
  fileList.forEach(jsFile => {
    const dotProp = dirPath2ObjPath(path.relative(base, jsFile), pathTransformer);
    let fileContent = dotProp ? set({}, dotProp, fileLoader(jsFile)) : fileLoader(jsFile);

    fileContent = unwrapDefaults(fileContent);
    finalObject = merge(finalObject, fileContent, {
      isMergeableObject: isPlainObject
    });
    objsToReplaceVirtuals.push(fileContent);
  });

  objsToReplaceVirtuals.forEach(obj => {
    replaceVirtuals(obj, finalObject);
  });

  // todo: reset all virtuals
  return finalObject
}

const settings = {
  fileLoader: require
};

async function jsDirIntoJson (directory, { extensions = ['*.js', '*.json'], fileLoader = settings.fileLoader, pathTransformer } = {}) {
  return fileListIntoJson(await deepListDir(path.resolve(process.cwd(), directory), { pattern: extensions }), { fileLoader, base: directory, pathTransformer })
}

function jsDirIntoJsonSync (directory, { extensions = ['*.js', '*.json'], fileLoader = settings.fileLoader, pathTransformer } = {}) {
  return fileListIntoJson(deepListDirSync(path.resolve(process.cwd(), directory), { pattern: extensions }), { fileLoader, base: directory, pathTransformer })
}

export { jsDirIntoJson, jsDirIntoJsonSync, settings };
