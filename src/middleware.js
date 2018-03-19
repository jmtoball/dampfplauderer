const DataFaker = require('./DataFaker')

module.exports = function (req, res, next) {
  res.fake = function (fakeSchema) {
    res.send(DataFaker.fake(fakeSchema))
  }
  next()
}
