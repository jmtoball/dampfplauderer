/* global fetch */
require('isomorphic-fetch')
const fs = require('await-fs')
const YAML = require('yamljs')

function isRemote (uri) {
  return uri.match(/^https?:\/\//i)
}

class SwaggerReader {
  constructor (schema) {
    this.schema = schema
    this.urls = []
  }

  static async fromYAML (uri) {
    let rawSchema
    if (isRemote(uri)) {
      rawSchema = await (await fetch(uri)).text()
    } else {
      rawSchema = await fs.readFile(uri, 'utf-8')
    }
    return new SwaggerReader(YAML.parse(rawSchema))
  }

  static async fromJSON (uri) {
    let rawSchema
    if (isRemote(uri)) {
      rawSchema = await (await fetch(uri)).text()
    } else {
      rawSchema = await fs.readFile(uri, 'utf-8')
    }
    return new SwaggerReader(JSON.parse(rawSchema))
  }

  static async fromURI (uri) {
    if (uri.match(/\.ya?ml($|#|\?)/)) {
      return this.fromYAML(uri)
    } else if (uri.match(/\.json($|#|\?)/)) {
      return this.fromJSON(uri)
    } else {
      throw new Error('Could not infer type from URL')
    }
  }

  get paths () {
    return this.schema.paths
  }

  get definitions () {
    return this.schema.definitions
  }

  get schema () {
    return this._schema
  }

  set schema (schema) {
    this._schema = schema
  }
}

module.exports = SwaggerReader
