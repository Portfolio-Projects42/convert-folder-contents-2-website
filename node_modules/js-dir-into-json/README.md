# js-dir-into-json
> Recursively loads content of found JavaScript and JSON files in given directory into a single structured object

<a href="https://www.npmjs.com/package/js-dir-into-json" target="_blank"><img src="https://img.shields.io/npm/v/js-dir-into-json.svg" alt="Version"></a>
[![tests](https://github.com/devtin/js-dir-into-json/workflows/test/badge.svg)](https://github.com/devtin/js-dir-into-json/actions)

This module recursively loads exported content of all `*.js` and `*.json` files (configurable via `extensions`) found in
given `directory` using given `fileLoader` (defaults to `require`) creating a single object that preservers the file
structure of the loaded content as the property path, transforming the file and folder names using given
`pathTransformer` function (defaults to
lodash→<a href="https://lodash.com/docs/4.17.15#camelCase" target="_blank">camelCase</a>).

Useful to split what could be a big configuration object into a file / folder structure.

## Example

Take the following file structure:

```
<directory>
├── users/
│   ├── index.js
│   ├── maria.json
│   ├── martin.js
│   └── maria.json
└── some-config.json
```

**users/index.js**
```js
module.exports = {
  'some-guy': 'Un-altered'
}
```

**users/maria.json**
```json
{
  "name": "Maria",
  "email": "maria@hotmail.com"
}
```

**users/martin.js**
```js
module.exports = {
  name: "Martin",
  email: "tin@devtin.io"
}
```

**some-config.js** (see esm support below)
```js
export default {
  plugins: [
    'plugin-1',
    'plugin-2'
  ]
}
```

And the following script:

```js
const { jsDirIntoJson } = require('js-dir-into-json')

jsDirIntoJson('<directory>',
  {
    // extensions: ['*.js', '*.json'], // minimatch or RegExp
    // pathTransformer: default to lodash camelCase
    // fileLoader: default to require (or fileLoader = require('esm')(module) for esm support)
  }
).then(obj => {
  t.deepEquals(obj, {
    "users": {
      "maria": {
        "name": "Maria",
        "email": "maria@hotmail.com"
      },
      "martin": {
        "name": "Martin",
        "email": "tin@devtin.io"
      },
      "olivia": "thats me!",
      "some-guy": "Un-altered"
    },
    "someConfig": {
      "plugins": [
        "plugin-1",
        "plugin-2"
      ]
    }
  });
});
```

* * *

### License

[MIT](https://opensource.org/licenses/MIT)

&copy; 2020-present Martin Rafael Gonzalez
<tin@devtin.io>
