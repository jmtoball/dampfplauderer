const test = require('tape')
const sinon = require('sinon')
const DataFaker = require('./DataFaker')

test('DataFaker', t => {
  const subject = new DataFaker()

  t.test('#fakeValue', t => {
    t.notEqual(subject.fakeValue('random.word'), 'random.word', 'replaces the faker.js identifiers')
    t.equal(typeof subject.fakeValue('random.word'), 'string', 'produces fake strings')
    t.equal(typeof subject.fakeValue('random.number'), 'number', 'produces fake numbers')
    t.equal(subject.fakeValue(f => f.random.arrayElement(['a'])),
      'a',
      'runs functions for custom faker access'
    )
    t.end()
  })

  t.test('#fake', t => {
    t.test('produces the right types', t => {
      t.equal(Array.isArray(subject.fake(['random.word'])), true, 'arrays stay arrays')
      t.equal(typeof subject.fake({ foo: 'random.word' }), 'object', 'objects stay objects')
      t.end()
    })

    sinon.stub(subject, 'fakeValue')
    subject.fake('somestring')
    t.deepEqual(
      subject.fakeValue.lastCall.args,
      ['somestring'],
      'passes simple values on to fakeValue'
    )
    subject.fakeValue.restore()

    t.test('recurses objects', t => {
      let nestedObject = { foo: { bar: 'random.word', xul: { a: 42, b: 'random.number' } } }
      let result = subject.fake(nestedObject)
      t.deepEqual(Object.keys(nestedObject), Object.keys(result), 'keeps root structure')
      t.deepEqual(Object.keys(nestedObject.foo), Object.keys(result.foo), 'keeps nested structure')
      t.equal(result.foo.xul.a, 42, 'does not touch simple values')
      t.notEqual(result.foo.xul.b, 'random.number', 'fakes data for faker.js identifiers')
      t.end()
    })

    t.test('recurses arrays', t => {
      let nestedArray = [42, ['random.word', { foo: ['random.number'] }]]
      let result = subject.fake(nestedArray)
      t.equal(nestedArray.length, result.length, 'keeps root structur')
      t.equal(nestedArray[1].length, result[1].length, 'keeps nested structure')
      t.equal(result[0], 42, 'does not touch simple values')
      t.notEqual(result[1][1].foo[0], 'random.number', 'fakes data for faker.js identifiers')
      t.end()
    })
    t.end()
  })

  t.end()
})
