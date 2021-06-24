import test from 'ava'
import { fileListIntoJson } from './file-list-into-json.js'

const papo = () => {
  return 'yup'
}
const fileContent = {
  'dir/file1.js': {
    some: 'content'
  },
  'dir/index.js': {
    hello: true
  },
  'sandy.js': {
    papo
  }
}

const fileList = Object.keys(fileContent)

test(`Imports all js/json files into a single object preserving the file structure as the object structure`, async t => {
  t.deepEqual(fileListIntoJson(fileList, {
    fileLoader (file) {
      return fileContent[file]
    }
  }), {
    dir: {
      file1: {
        some: 'content'
      },
      hello: true
    },
    sandy: {
      papo
    }
  })
})
