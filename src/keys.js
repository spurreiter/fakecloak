const { config } = require('configg')()
const fs = require('fs')
const Keypairs = require('keypairs')

const jwtKeys = {
  privateKey: fs.readFileSync(config.jwt.private),
  publicKey: fs.readFileSync(config.jwt.public)
}
Keypairs.import({ pem: jwtKeys.publicKey.toString() }).then(jwk => {
  jwtKeys.jwk = Object.assign({
    alg: 'RS256',
    use: 'sig'
  }, jwk)
  // console.log(jwtKeys)
})

module.exports = jwtKeys
