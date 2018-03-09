const jsonSchemaFaker = require('json-schema-faker')
jsonSchemaFaker.extend('faker', () => require('faker'))
const SwaggerReader = require('./SwaggerReader')

class SwaggerFakeServer {
  constructor (app, options) {
    this.app = app
    if (options.schema) {
      this.schema = options.schema
    } else if (options.uri) {
      this.uri = options.uri
    } else {
      throw new Error('Please provide an uri or schema option to SwaggerFakeServer')
    }
  }

  listen (port) {
    this.app.listen(process.env.SWAGGER_FAKE_SERVER_PORT || port || 3456)
  }

  async setup () {
    if (this.uri) {
      this.schemaReader = await SwaggerReader.fromURI(this.uri)
    } else {
      this.schemaReader = new SwaggerReader(this.schema)
    }
    this._mountRoutes()
  }

  _fakeResponses (responses) {
    // TODO: Support different strategies to choose status and response
    let response = responses[200]
    return (req, res, next) => {
      let schemaWithDefs = Object.assign(response.schema, {
        definitions: this.schemaReader.definitions
      })
      res.send(jsonSchemaFaker(schemaWithDefs))
    }
  }

  _mountRoutes () {
    let paths = this.schemaReader.paths
    for (let path in paths) {
      for (let method in paths[path]) {
        this.app[method](path, this._fakeResponses(paths[path][method].responses))
      }
    }
  }
}

module.exports = SwaggerFakeServer
