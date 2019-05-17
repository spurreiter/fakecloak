const { config } = require('configg')()
const fs = require('fs')

const jwtKeys = {
  privateKey: fs.readFileSync(config.jwt.private),
  publicKey: fs.readFileSync(config.jwt.public)
}

module.exports = jwtKeys
