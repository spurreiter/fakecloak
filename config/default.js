const config = {
  uri: 'http://localhost:4000',
  realm: 'test',
  jwt: {
    public: `${__dirname}/../public.pem`,
    private: `${__dirname}/../private.pem`
  },
  audience: 'app-test',
  apps: {
    'app-test': {
      baseUri: 'http://localhost:3000'
    }
  },
  users: {
    'test@test': { password: 'test' }
  }
}

module.exports = { config }
