const page = ({ title, body }) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
  * { box-sizing: border-box; }
  body { font-family: Arial,sans; }
  .error { color: red; }
  </style>
</head>
<body>
<div class="content">
${body}
</div>
</body>
</html>
`

const hiddenInput = (hidden = {}) => Object.entries(hidden)
  .map(([name, value]) => `<input type="hidden" name="${name}" value="${encodeURIComponent(value)}">`)
  .join('\n')

const loginPage = ({ error, hidden } = {}) => page({
  title: 'Login',
  body: `
  <form method="POST">
    ${error
    ? `
    <div class="error">
      ${error}
    </div>`
    : ''
}
    <div><label for="name">E-Mail</label></div>
    <div><input type="text" name="email" placeholder="test@test"></div>
    <div><label for="password">Password</label></div>
    <div><input type="password" name="password" placeholder="test"></div>
    ${hiddenInput(hidden)}
    <br>
    <div><button>Login</button></div>
  </form>
`
})

module.exports = {
  page,
  loginPage
}
