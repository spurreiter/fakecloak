const crypto = require('crypto')

const uuid4 = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
  )

const httpError = (status, code, msg) => {
  const err = new Error(msg || status)
  err.status = status
  err.code = code
  return err
}

module.exports = {
  uuid4,
  httpError
}
