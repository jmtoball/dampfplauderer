# dampfplauderer
Easily fake APIs

## Name

A ___Dampfplauderer___ _(Bavarian, m, coll.)_ is someone who talks a lot, but
little of substance, even though he may pretend otherwise.

## Motivation

When developing apps in an agile team, you often face the issue of unequally
advanced development progress between different teams or services. So the
backend team may still be fighting the quirks of a third party API while the
frontend team would be ready to work on displaying said data. This issue can be
even worse in contexts where the development is spread across different
companies that operate in other methodologies and cycles.

Swagger is already a great tool for defining API contracts and base development
on them. For effective frontend-development, however, having a reliable and
controllable backend to test against is invaluable. Ideally, a staging
environment for the backend services can help. This is not an option for
producing edge-cases or if the backend development has not been progressed far
enough. In these cases, having a local fake server can help. And that's what
_dampfplauderer_ is for.

## Usage

### Installation

`npm --save-dev install dampfplauderer` / `yarn add --dev dampfplauderer`

### Usage without Swagger

If you don't use Swagger yet to document your APIs, that's no problem. You can also use dampflauderer to fake routes with ease.

Let's create a file to set up a small, but powerful fake server:

_fake_server.js_
```js
const dampfplauderer = require('dampfplauderer').middleware
const express = require('express')

const app = express()
app.use(dampfplauderer)

app.get('/user', (req, res, next) => {
  res.fake({
    created: 'date.past',
    userName: 'internet.userName',
    name: 'name.findName',
    email: 'internet.email'
  })
})

app.listen(3456)
```

Let's check it out by running `node fake_server.js`:
```sh
$ http localhost:3456/user

HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 114
Content-Type: application/json; charset=utf-8
Date: Fri, 09 Mar 2018 13:41:52 GMT
ETag: W/"72-0V0m/60kbq9GgmsP7O1Jnk55Dsc"
X-Powered-By: Express

{
    "created": "2017-08-24T06:51:41.751Z",
    "email": "Saige69@yahoo.com",
    "name": "Matt Rath",
    "userName": "Andreane_Zieme0"
}
```

That's great, but we could have done this manually, too. _dampfplauderer_ shines
for more complex and bigger amounts of data. Let's add an `/users`-route.

_fake_server.js_
```js
const dampfplauderer = require('dampfplauderer').middleware
const express = require('express')

const app = express()
app.use(dampfplauderer)

const userSchema = {
  created: 'date.past',
  userName: 'internet.userName',
  name: 'name.findName',
  email: 'internet.email'
}

app.get('/user', (req, res, next) => {
  res.fake(userSchema)
})

app.get('/users', (req, res, next) => {
  res.fake(new Array(20).fill(userSchema))
})

app.listen(3456)
```

Starting this with `node fake_server.js` and calling the route will now produce

```sh
$ http localhost:3456/users
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 2442
Content-Type: application/json; charset=utf-8
Date: Fri, 09 Mar 2018 13:48:18 GMT
ETag: W/"98a-zujrOsRSHusxcfqF/rCsMJuhVb0"
X-Powered-By: Express
[
    {
        "created": "2017-11-19T08:44:14.068Z",
        "email": "Muriel29@yahoo.com",
        "name": "Alan Abbott",
        "userName": "Marcelino50"
    },
    […]
]
```


### Usage with Swagger

If you already have Swagger in place for documenting backend APIs, that's great!
You can set up a local fake server in no time:

#### From CLI

_using a local YAML schema definition…_  
`npx dampflauderer ../fixtures/swagger/petstore.yaml`

_using a local JSON schema definition…_  
`npx dampflauderer ../fixtures/swagger/petstore.json`

_using an online YAML schema definition…_  
`npx dampflauderer https://raw.githubusercontent.com/jmtoball/dampflauderer/fixtures/swagger/petstore.yaml`

_using an online JSON schema definition…_  
`npx dampflauderer https://raw.githubusercontent.com/jmtoball/dampflauderer/fixtures/swagger/petstore.json`

Result in any case:  

```sh
$ http localhost:3456/pets
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 88
Content-Type: application/json; charset=utf-8
Date: Fri, 09 Mar 2018 12:11:36 GMT
ETag: W/"58-bvO+Trha4ZBIuWO3/8TgMXcNhzw"
X-Powered-By: Express

[
    {
        "id": -20164017,
        "name": "occaecat sed magna"
    },
    {
        "id": -71767243,
        "name": "elit nulla amet"
    }
]
```

#### Customizing the data

Now we have data in the right structure, but it doesn't really resemble the data
we would get from the backend. Let's fix this.

In the Swagger definition, we extend the schema with some helpers:
```yaml
  #[…]
  definitions:
    Pet:
      # […]
      properties:
        id:
          type: "integer"
          format: "int64"
          minimum: 1 # Ids aren't negative or 0
        name:
          type: "string"
          x-faker: "name.firstName" # Let's give the pets a nice name
        tag:
          type: "string"

```
(See the
[Faker.js](https://rawgit.com/Marak/faker.js/master/examples/browser/index.html)
and [json-schema-faker](http://json-schema-faker.js.org/) docs for all options)

With these changes in place, we now get this response:

```sh
$ http localhost:3456/pets
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 98
Content-Type: application/json; charset=utf-8
Date: Fri, 09 Mar 2018 12:48:06 GMT
ETag: W/"62-r2Cakk2AbznO93I3JyghDJFHUtw"
X-Powered-By: Express

[
    {
        "id": 76318422,
        "name": "Logan"
    },
    {
        "id": 56477959,
        "name": "Josefina"
    },
    {
        "id": 8952353,
        "name": "Isadore"
    }
]

```

#### From package.json

It's a good idea to put your fake-server into your package.json, e.g.:

_package.json_
```json[…]
  "scripts": {
    "swagger-fake-server": "dampfplauderer ../fixtures/swagger/petstore.yaml"
  }
```

Then you can easily start the fake-server using  
`npm run swagger-fake-server` / `yarn swagger-fake-server`

##### Combining Dampflauderer with my app or tests

This allows you to run the server together with your app or as a reliable backend
for integration tests with some help from
[concurrently](https://www.npmjs.com/package/concurrently) and
[wait-on](https://www.npmjs.com/package/wait-on) e.g.:

```
  "scripts": {
    "start": "[…]",
    "test": "[…]",
    "swagger-fake-server": "dampfplauderer ../fixtures/swagger/petstore.yaml",
    "start:fake": "concurrently  \"npm run swagger-fake-server\" \"npm run start\"",
    "test:integration": "concurrently \"npm run swagger-fake-server\" \"wait-on tcp:3456 && npm run test\""
  }
```
