const faker = require('faker')

class DataFaker {
  fakeValue (key) {
    if (typeof key === 'function') {
      return key(faker)
    }
    const segments = key
      .toString()
      .split('.')
      .reverse()
    let method = faker
    while (segments.length) {
      method = method[segments.pop()]
      if (!method) return key
    }
    return method()
  }

  fake (object) {
    if (Array.isArray(object)) {
      return object.map(this.fake.bind(this))
    } else if (typeof object === 'object') {
      return Object.keys(object).reduce((newObject, key) => {
        newObject[key] = this.fake(object[key])
        return newObject
      }, {})
    } else {
      return this.fakeValue(object)
    }
  }
}

module.exports = DataFaker
