const { Router } = require('express')
const { URLSearchParams } = require('url')
const bodyParser = require('body-parser')
const { uuid4 } = require('./utils')
const jwtKeys = require('./keys')
const jwt = require('./jwt')
const views = require('./views')

const now = () => Date.now() / 1000 | 0

const KEYCLOAK_SESSION = 'KEYCLOAK_SESSION'

const verifyToken = (config, req) => {
  const token = req.cookies && req.cookies[KEYCLOAK_SESSION]
  return jwt.verify(token)
    .then(obj => {
      const { exp, aud } = obj
      const { baseUri } = config.apps[aud] || {}
      if (exp > now() && baseUri) {
        return (baseUri)
      } else {
        return Promise.reject(new Error('expired'))
      }
    })
}

function ssoRouter (config) {
  const router = new Router()

  router.get(['/', '/protocol/openid-connect/auth'],
    (req, res, next) => {
      verifyToken(config, req)
        .then(baseUri => {
          res.redirect(baseUri)
        })
        .catch((err) => {
          console.log('%s', err)
          res.end(views.loginPage({}))
        })
    })

  router.post(['/', '/protocol/openid-connect/auth'],
    bodyParser.urlencoded({ extended: true }),
    (req, res, next) => {
      // client_id, scope
      const { state, redirect_uri, response_type } = req.query

      const { email, password } = req.body
      const user = config.users[email]

      const end = () => res.end(views.loginPage({ error: 'Wrong E-Mail or Password' }))

      if (user && user.password === password) {
        const { audience } = config
        const { baseUri } = config.apps[audience]
        jwt.sign({ audience })
          .then(token => {
            res.cookie(KEYCLOAK_SESSION, token)
            let url
            if (redirect_uri && response_type === 'code') {
              url = redirect_uri + '?' +
                new URLSearchParams(Object.entries({ state, code: uuid4() })).toString()
            }
            res.redirect(url || baseUri)
          })
          .catch((err) => {
            console.log('%s', err)
            end()
          })
      } else {
        end()
      }
    }
  )

  router.post('/protocol/openid-connect/token',
    bodyParser.urlencoded({ extended: true }),
    (req, res, next) => {
      console.log(req.body)
      const {
        // client_session_state,
        // client_session_host,
        // code,
        // grant_type,
        client_id
        // redirect_uri
      } = req.body

      const expires = 60

      jwt.sign({ audience: client_id, expires })
        .then(access_token => {
          const body = {
            access_token,
            token_type: 'Bearer',
            expires_in: expires
          }
          res.json(body)
        })
    })

  router.get('/protocol/openid-connect/certs',
    (req, res, next) => {
      // https://tools.ietf.org/html/rfc7517#
      res.json({ keys: [ jwtKeys.jwk ] })
    })

  router.get('/protocol/openid-connect/logout',
    (req, res, next) => {
      const { redirect_uri } = req.query
      res.clearCookie(KEYCLOAK_SESSION)
      res.redirect(redirect_uri)
    })

  return router
}

module.exports = { ssoRouter }
