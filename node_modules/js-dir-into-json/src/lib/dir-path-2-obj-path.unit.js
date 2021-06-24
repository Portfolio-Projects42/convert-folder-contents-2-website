import { dirPath2ObjPath } from './dir-path-2-obj-path.js'
import camelCase from 'lodash/camelCase'
import test from 'ava'

test(`Converts paths into dot notation`, t => {
  t.is(dirPath2ObjPath('/some-path/papo.js'), 'some-path.papo')
  t.is(dirPath2ObjPath('/some-path/index.js'), 'some-path')
  t.is(dirPath2ObjPath('other-path/another/path'), 'other-path.another.path')
  t.is(dirPath2ObjPath('/'), '')
  t.is(dirPath2ObjPath('/index.js'), '')
  t.is(dirPath2ObjPath('/papo.js'), 'papo')
  t.is(dirPath2ObjPath('/papo-con-late.js'), 'papo-con-late')
})

test(`Transforms paths names using given pathTransformer`, t => {
  t.is(dirPath2ObjPath('/some-path/papo.js', camelCase), 'somePath.papo')
  t.is(dirPath2ObjPath('/some-path/index.js', camelCase), 'somePath')
  t.is(dirPath2ObjPath('other-path/another/path', camelCase), 'otherPath.another.path')
  t.is(dirPath2ObjPath('/', camelCase), '')
  t.is(dirPath2ObjPath('/index.js', camelCase), '')
  t.is(dirPath2ObjPath('/papo.js', camelCase), 'papo')
  t.is(dirPath2ObjPath('/papo-con-late.js', camelCase), 'papoConLate')
})
