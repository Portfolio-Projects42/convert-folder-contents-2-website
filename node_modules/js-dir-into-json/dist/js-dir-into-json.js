/*!
 * js-dir-into-json v2.7.1
 * (c) 2020-2021 Martin Rafael Gonzalez <tin@devtin.io>
 * MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var deepListDir = require('deep-list-dir');
var merge = require('deepmerge');
var path = require('path');
var set = require('lodash/set');
var camelCase = require('lodash/camelCase.js');
var trim = require('lodash/trim');
var isPlainObject = require('is-plain-object');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var merge__default = /*#__PURE__*/_interopDefaultLegacy(merge);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var set__default = /*#__PURE__*/_interopDefaultLegacy(set);
var camelCase__default = /*#__PURE__*/_interopDefaultLegacy(camelCase);
var trim__default = /*#__PURE__*/_interopDefaultLegacy(trim);

const proxy = p => p;

function dirPath2ObjPath (dirPath = '', pathTransformer) {
  return trim__default['default'](dirPath, '/').replace(/((^|\/)index)?\.js(on)?$/i, '').split('/').map(pathTransformer || proxy).join('.')
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
function fileListIntoJson (fileList, { fileLoader = require, base = './', pathTransformer = camelCase__default['default'] } = {}) {
  let finalObject = {};
  const objsToReplaceVirtuals = [];
  fileList.forEach(jsFile => {
    const dotProp = dirPath2ObjPath(path__default['default'].relative(base, jsFile), pathTransformer);
    let fileContent = dotProp ? set__default['default']({}, dotProp, fileLoader(jsFile)) : fileLoader(jsFile);

    fileContent = unwrapDefaults(fileContent);
    finalObject = merge__default['default'](finalObject, fileContent, {
      isMergeableObject: isPlainObject.isPlainObject
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
  return fileListIntoJson(await deepListDir.deepListDir(path__default['default'].resolve(process.cwd(), directory), { pattern: extensions }), { fileLoader, base: directory, pathTransformer })
}

function jsDirIntoJsonSync (directory, { extensions = ['*.js', '*.json'], fileLoader = settings.fileLoader, pathTransformer } = {}) {
  return fileListIntoJson(deepListDir.deepListDirSync(path__default['default'].resolve(process.cwd(), directory), { pattern: extensions }), { fileLoader, base: directory, pathTransformer })
}

exports.jsDirIntoJson = jsDirIntoJson;
exports.jsDirIntoJsonSync = jsDirIntoJsonSync;
exports.settings = settings;
