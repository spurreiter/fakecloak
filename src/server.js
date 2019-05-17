const { config } = require('configg')()
const { URL } = require('url')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { ssoRouter } = require('./sso')

function server () {
  const app = express()

  app.use(
    morgan('tiny'),
    cors(),
    cookieParser()
  )
  app.use(`/auth/realms/${config.realm}`, ssoRouter(config))
  app.get('/', (req, res) => {
    res.redirect(`/auth/realms/${config.realm}`)
  })

  return app
}

module.exports = {
  server
}

if (module === require.main) {
  const { port } = new URL(config.uri)
  server().listen(port)
}
