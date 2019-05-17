const { Router } = require('express')
const bodyParser = require('body-parser')
const { verify, sign } = require('./jwt')
const views = require('./views')

const now = () => Date.now() / 1000 | 0

function ssoRouter (config) {
  const router = new Router()

  router.get('/', (req, res, next) => {
    const token = req.cookies.KEYCLOAK_SESSION
    verify(token)
      .then(obj => {
        const { exp, aud } = obj
        const { baseUri } = config.apps[aud] || {}
        console.log(exp, now(), baseUri)
        if (exp > now() && baseUri) {
          res.redirect(baseUri)
        } else {
          return Promise.reject(new Error('expired'))
        }
      })
      .catch((err) => {
        console.log('%s', err)
        res.end(views.loginPage({}))
      })
  })

  router.post('/',
    bodyParser.urlencoded({ extended: true }),
    (req, res, next) => {
      const { email, password } = req.body
      const user = config.users[email]

      const end = () => res.end(views.loginPage({ error: 'Wrong E-Mail or Password' }))

      if (user && user.password === password) {
        const { audience } = config
        const { baseUri } = config.apps[audience]
        sign({ audience })
          .then(token => {
            res.cookie('KEYCLOAK_SESSION', token)
            res.redirect(baseUri)
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

  return router
}

module.exports = { ssoRouter }
