const fs = require('fs')
const { generateKeyPair } = require('crypto')

generateKeyPair('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
}, (err, publicKey, privateKey) => {
  if (err) {
    console.error(err)
    return
  }
  fs.writeFileSync(`${__dirname}/../public.pem`, publicKey, 'utf8')
  fs.writeFileSync(`${__dirname}/../private.pem`, privateKey, 'utf8')
})
