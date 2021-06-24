import test from 'ava'
import path from 'path'
import { jsDirIntoJson, jsDirIntoJsonSync } from '../'

test(`Imports all js/json files into a single object preserving the file structure as the object structure`, async t => {
  const res = await jsDirIntoJson(path.join(__dirname, './benchmark'))
  const resSync = jsDirIntoJsonSync(path.join(__dirname, './benchmark'))
  t.deepEqual(res, {
    'users': {
      'maria': {
        'name': 'Maria',
        'email': 'maria@hotmail.com'
      },
      'martin': {
        'firstName': 'Martin',
        'lastName': 'Gonzalez',
        'fullName': 'Martin Gonzalez',
        'email': 'tin@devtin.io'
      },
      'olivia': 'thats me!',
      'some-guy': 'Un-altered'
    },
    products: [
      'Product 1',
      'Product 2'
    ],
    someConfig: {
      plugins: [
        'plugin-1',
        'plugin-2'
      ]
    }
  })
  t.deepEqual(res, resSync)
})

test('Preserves getters / setters', async t => {
  const res = await jsDirIntoJson(path.join(__dirname, './benchmark'))
  res.users.martin.firstName = 'Fulano'
  t.is(res.users.martin.fullName, 'Fulano Gonzalez')
})
