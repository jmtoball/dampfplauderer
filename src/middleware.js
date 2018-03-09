const DataFaker = require('./DataFaker')
const dataFaker = new DataFaker()

module.exports = function (req, res, next) {
  res.fake = function (fakeSchema) {
    res.send(dataFaker.fake(fakeSchema))
  }
  next()
}
