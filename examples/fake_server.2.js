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
