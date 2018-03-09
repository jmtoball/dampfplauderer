const test = require('tape')
const sinon = require('sinon')
const fetchMock = require('fetch-mock')
const SwaggerReader = require('./SwaggerReader')

test('SwaggerReader', t => {
  t.test('#fromJSON', t => {
    t.test('reads from local files', t => {
      SwaggerReader.fromJSON('fixtures/swagger/petstore.json')
        .then(instance => {
          t.equal(instance.schema.host, 'petstore.swagger.io', 'read host from schema')
          t.end()
        })
        .catch(t.fail)
    })

    t.test('reads from remote files', t => {
      const url = 'http://localhost/remote_schema.json'
      fetchMock.get(url, { swagger: '2', host: 'api.monkeystore.io' })
      SwaggerReader.fromJSON(url)
        .then(instance => {
          t.equal(instance.schema.host, 'api.monkeystore.io')
        })
        .catch(t.fail)
      t.end()
    })
    t.end()
  })

  t.test('#fromYAML', t => {
    t.test('reads from local files', t => {
      SwaggerReader.fromYAML('fixtures/swagger/petstore.yaml')
        .then(instance => {
          t.equal(instance.schema.host, 'petstore.swagger.io', 'read host from schema')
          t.end()
        })
        .catch(t.fail)
    })

    t.test('reads from remote files', t => {
      const url = 'http://localhost/remote_schema.yaml'
      fetchMock.get(url, `
        swagger: '2'
        host: 'api.monkeystore.io'
      `)
      SwaggerReader.fromYAML(url)
        .then(instance => {
          t.equal(instance.schema.host, 'api.monkeystore.io')
        })
        .catch(t.fail)
      t.end()
    })
    t.end()
  })
  t.test('#fromURI', t => {
    t.test('infers types from URL', t => {
      sinon.stub(SwaggerReader, 'fromJSON')
      sinon.stub(SwaggerReader, 'fromYAML')
      SwaggerReader.fromURI('https://localhost/remote_schema.yml')
      t.equal(SwaggerReader.fromYAML.called, true)
      SwaggerReader.fromURI('https://localhost/remote_schema.yaml?args=foo#okay')
      t.equal(SwaggerReader.fromYAML.calledTwice, true)
      SwaggerReader.fromURI('https://localhost/remote_schema.json')
      t.equal(SwaggerReader.fromJSON.called, true)
      SwaggerReader.fromURI('https://localhost/remote_schema.json?args=foo#okay')
      t.equal(SwaggerReader.fromJSON.calledTwice, true)
      SwaggerReader.fromJSON.restore()
      SwaggerReader.fromYAML.restore()
      t.end()
    })
    t.end()
  })
  t.end()
})
