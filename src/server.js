const { config } = require('configg')()
const { URL } = require('url')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { ssoRouter } = require('./sso')
const { httpError } = require('./utils')

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

  app.use(
    (req, res, next) => {
      next(httpError(404))
    },
    (err, req, res, next) => {
      console.error('Error: %s %s', err.status, err.message)
      res.status = err.status || 500
      res.end()
    }
  )

  return app
}

module.exports = {
  server
}

if (module === require.main) {
  const { port } = new URL(config.uri)
  server().listen(port)
}
