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
