# fake-cloak

NOTE: This project is unsecure. Only use for dev purposes.

## run with keycloak-nodejs-connect/example

```bash
git clone --depth 1 https://github.com/keycloak/keycloak-nodejs-connect.git
cd keycloak-nodejs-connect/example
npm i -S keycloak-connect@latest
npm i
(cat << EOS
{
  "realm" : "test",
  "auth-server-url" : "http://localhost:4000/auth",
  "ssl-required" : "node",
  "resource" : "app-test",
  "public-client" : true
}
EOS
) > keycloak.json
npm start
```
