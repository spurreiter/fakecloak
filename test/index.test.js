const { strictEqual: equal } = require('assert')
const { sign, verify } = require('..')
const log = require('debug')('test:jwt')

describe('jwt', function () {
  let token

  it('shall generate a signed token', function () {
    return sign()
      .then(_token => {
        token = _token
        log(token)
        equal(typeof token, 'string')
      })
  })

  it('shall verify token', function () {
    return verify(token)
      .then(obj => {
        log(obj)
        equal(typeof obj, 'object')
      })
  })
})
