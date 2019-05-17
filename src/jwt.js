const { config } = require('configg')()
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const { uuid4 } = require('./utils')
const jwtKeys = require('./keys')

const jwtSign = promisify(jwt.sign)
const jwtVerify = promisify(jwt.verify)

const timestamp = date => date.getTime() / 1000 | 0

const getPayload = ({
  date = new Date(), // @param {Date} [date]
  expires = 60, // @param {Number} [expires] in seconds
  refresh, // @param {Boolean} [refresh] if true issue a refresh token
  audience = 'app-test' // @param {String} [audience]
} = {}) => {
  return {
    jti: uuid4(),
    exp: timestamp(date) + expires,
    nbf: 0,
    iat: timestamp(date),
    iss: `${config.uri}/auth/realms/${config.realm}`,
    aud: audience,
    sub: uuid4(),
    typ: refresh ? 'Refresh' : 'Bearer', //  Bearer|Refresh
    azp: audience,
    auth_time: 0,
    session_state: uuid4(),
    realm_access: {
      roles: [
        'uma_authorization'
      ]
    },
    resource_access: {
      realm_management: {
        roles: [
          'view-realm'
        ]
      },
      account: {
        roles: [
          'view-profile'
        ]
      }
    }
  }
}

const sign = ({ expires, refresh, audience } = {}) => {
  const payload = getPayload({ expires, refresh, audience })
  return jwtSign(payload, jwtKeys.privateKey, { algorithm: 'RS256' })
}

const verify = (token) => {
  return jwtVerify(token, jwtKeys.publicKey)
}

module.exports = {
  sign,
  verify
}
